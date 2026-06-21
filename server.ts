import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool, { query } from "./src/lib/db.server";
import apiRouter from "./server/api";

import { authenticateToken, authorizeRoles, UserRole } from "./server/auth/middleware";
import { WorkflowEngine } from "./server/workflows/engine";
import { 
  syncAuditLogToCloud, 
  syncChatMessageToCloud, 
  getCloudChatHistory,
  isCloudPersistenceEnabled
} from "./server/services/firebase";

const currentFilename = typeof __filename !== "undefined" ? __filename : (typeof import.meta !== "undefined" && import.meta.url ? fileURLToPath(import.meta.url) : "");
const currentDirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(currentFilename);

const JWT_SECRET = process.env.JWT_SECRET || "sovereign-secret-key-2026";

// --- Sovereign Engine V2.0 Core Logic ---

interface AuditLog {
  timestamp: string;
  userId: string;
  action: string;
  entity: string;
  changes: any;
}

const auditTrail: AuditLog[] = [];

async function logAction(userId: string, action: string, entity: string, changes: any) {
  const log = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    entity,
    changes,
  };
  
  try {
    await query(
      "INSERT INTO audit_logs (user_id, action, entity, changes) VALUES ($1, $2, $3, $4)",
      [userId, action, entity, JSON.stringify(changes)]
    );
  } catch (err: any) {
    console.error("[DB] Failed to log action:", err.message);
  }

  // Sync to Firebase Cloud Storage dynamically
  try {
    await syncAuditLogToCloud(userId, action, entity, changes);
  } catch (cloudErr: any) {
    console.error("[Cloud DB] Failed to sync action:", cloudErr.message);
  }

  auditTrail.push(log);
  console.log(`[AUDIT] ${log.timestamp} - ${userId}: ${action} on ${entity}`);
}

// --- Server Initialization ---

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  app.use(express.json());

  // --- Database Initialization ---
  try {
    // Audit Logs Table
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        user_id TEXT,
        action TEXT,
        entity TEXT,
        changes JSONB
      );
    `);

    // Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT NOT NULL,
        full_name TEXT,
        phone_number TEXT,
        organization TEXT,
        job_title TEXT,
        sector TEXT,
        expertise TEXT,
        location TEXT,
        bio TEXT,
        google_id TEXT UNIQUE,
        github_id TEXT UNIQUE,
        phone TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Messages Table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id),
        sender_email TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed Admin if not exists (Production should use a proper migration/setup script)
    const adminEmail = "admin@statgate.ug";
    const existingAdmin = await query("SELECT * FROM users WHERE email = $1", [adminEmail]);
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("StatGate2026!", 10);
      await query(
        "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
        [adminEmail, hashedPassword, UserRole.SOVEREIGN_ADMIN]
      );
      console.log("[DB] Default admin created.");
    }

    console.log("[DB] Production tables verified.");
  } catch (err) {
    console.error("[DB] Initialization failed:", err.message);
  }

  // --- API v1 Endpoints ---
  app.use("/api/v1", apiRouter);

  // Health & System Status
  app.get("/api/v1/health", async (req, res) => {
    let dbStatus = "Connected";
    try {
      await query("SELECT 1");
    } catch (err: any) {
      dbStatus = `Disconnected (${err.message})`;
    }

    res.json({ 
      status: "Sovereign Engine V2.0 Active", 
      region: "Kampala/EAC",
      dataSovereignty: "Enforced",
      database: dbStatus,
      firebase: isCloudPersistenceEnabled() ? "Active" : "Disabled",
      timestamp: new Date().toISOString() 
    });
  });

  // Auth & Identity Service
  app.post("/api/v1/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        token,
        user: { email: user.email, role: user.role },
        permissions: user.role === UserRole.SOVEREIGN_ADMIN ? ["*"] : ["read:analytics"]
      });
    } catch (err) {
      console.error("[AUTH] Login error:", err.message);
      if (err.message.includes("ECONNREFUSED") || err.message.includes("Connection terminated")) {
        return res.status(503).json({ error: "Database connection failed. Please ensure your Postgres server is reachable." });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/api/v1/auth/register", async (req, res) => {
    const { 
      email, 
      password, 
      role, 
      fullName, 
      phoneNumber, 
      organization, 
      jobTitle, 
      sector, 
      expertise, 
      location, 
      bio 
    } = req.body;
    
    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      await query(
        `INSERT INTO users (
          email, password_hash, role, full_name, phone_number, 
          organization, job_title, sector, expertise, location, bio
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          email, hashedPassword, role || UserRole.CLIENT_OBSERVER, fullName, phoneNumber, 
          organization, jobTitle, sector, expertise, location, bio
        ]
      );
      res.json({ status: "User registered successfully" });
    } catch (err) {
      console.error("[AUTH] Registration error:", err.message);
      res.status(400).json({ error: "Registration failed: User may already exist or invalid data" });
    }
  });

  // --- OAuth & Third-Party Auth ---

  app.get("/api/v1/auth/google/url", (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID || 'MOCK_ID'}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
    res.json({ url });
  });

  app.get("/api/v1/auth/github/url", (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/v1/auth/github/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID || 'MOCK_ID'}&redirect_uri=${redirectUri}&scope=user:email`;
    res.json({ url });
  });

  // Generic Callback Handler (Mock for development)
  app.get("/api/v1/auth/:provider/callback", async (req, res) => {
    const { provider } = req.params;
    const { code } = req.query;
    
    // In a real app, you'd exchange the code for tokens here
    const mockEmail = `${provider}-user@example.com`;
    const mockId = `mock-${provider}-${Date.now()}`;

    try {
      let result = await query(`SELECT * FROM users WHERE ${provider}_id = $1`, [mockId]);
      let user = result.rows[0];

      if (!user) {
        const insertResult = await query(
          `INSERT INTO users (email, role, ${provider}_id) VALUES ($1, $2, $3) RETURNING *`,
          [mockEmail, UserRole.CLIENT_OBSERVER, mockId]
        );
        user = insertResult.rows[0];
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      // Send success script to close popup and notify parent
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'OAUTH_SUCCESS', 
                token: '${token}', 
                user: ${JSON.stringify({ email: user.email, role: user.role })} 
              }, '*');
              window.close();
            </script>
            <p>Authentication successful. Closing window...</p>
          </body>
        </html>
      `);
    } catch (err) {
      res.status(500).send("Authentication failed");
    }
  });

  // Phone Auth (Mock OTP)
  app.post("/api/v1/auth/phone/request", (req, res) => {
    const { phone } = req.body;
    console.log(`[OTP] Sending mock code 123456 to ${phone}`);
    res.json({ status: "OTP Sent" });
  });

  app.post("/api/v1/auth/phone/verify", async (req, res) => {
    const { phone, code } = req.body;
    if (code !== "123456") return res.status(401).json({ error: "Invalid OTP" });

    try {
      let result = await query("SELECT * FROM users WHERE phone = $1", [phone]);
      let user = result.rows[0];

      if (!user) {
        const insertResult = await query(
          "INSERT INTO users (email, role, phone) VALUES ($1, $2, $3) RETURNING *",
          [`phone-${phone}@statgate.ug`, UserRole.CLIENT_OBSERVER, phone]
        );
        user = insertResult.rows[0];
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({ token, user: { email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: "Phone auth failed" });
    }
  });

  // --- Statistician Data Analysis Service ---

  app.post("/api/v1/analysis/compute", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN, UserRole.LEAD_ANALYST), (req, res) => {
    const { data, metrics } = req.body;
    
    // Mock statistical computation
    const results = metrics.map((metric: string) => {
      if (metric === "mean") return { metric, value: 85.4 };
      if (metric === "variance") return { metric, value: 12.2 };
      if (metric === "confidence") return { metric, value: "95%" };
      return { metric, value: "N/A" };
    });

    res.json({
      timestamp: new Date().toISOString(),
      results,
      integrityCheck: "PASSED",
      engine: "Sovereign-Stats-V1"
    });
  });

  // Sync & Field Data Service (The Refinement Engine)
  app.post("/api/v1/sync/upload", (req, res) => {
    const { data, userId, coords } = req.body;
    
    // Geofencing Simulation (Kampala bounds approx)
    const isWithinBounds = coords ? (
      coords[0] >= 0.2 && coords[0] <= 0.5 && 
      coords[1] >= 32.4 && coords[1] <= 32.7
    ) : true;

    // Anonymization Service Simulation
    const anonymizedData = data.map((item: any) => {
      const { pii, ...safeData } = item;
      return safeData;
    });

    const integrityScore = isWithinBounds ? 98.4 : 65.2;
    const geofenceStatus = isWithinBounds ? "VERIFIED" : "OUT_OF_BOUNDS";

    logAction(userId || "system", "UPLOAD_SYNC", "FieldData", { 
      count: data.length, 
      geofence: geofenceStatus,
      integrity: integrityScore
    });

    // Smart-Pay Trigger Simulation
    if (integrityScore > 95) {
      logAction("system", "SMART_PAY_TRIGGER", "FinancialLedger", { 
        amount: "50,000 UGX", 
        recipient: userId || "AGT-001" 
      });
    }

    res.json({
      status: "Refinement Complete",
      processedCount: anonymizedData.length,
      integrityScore,
      geofenceStatus,
      storageLocation: "Kampala-Local-S3"
    });
  });

  // Fellowship & Recruitment System
  app.post("/api/recruitment/apply", (req, res) => {
    const { email, firstName } = req.body;
    logAction("system", "RECRUITMENT_APPLY", "Applicant", { email, firstName });
    res.json({ status: "success", applicationId: `APP-${Date.now()}` });
  });

  app.get("/api/v1/fellowship/leaderboard", (req, res) => {
    res.json([
      { name: "Ivan K.", score: 985, rank: 1, specialty: "R/Tidyverse" },
      { name: "Sarah N.", score: 972, rank: 2, specialty: "Python/Pandas" },
      { name: "Moses O.", score: 960, rank: 3, specialty: "Geospatial" },
    ]);
  });

  // Audit Logs (Admin Only)
  app.get("/api/v1/admin/audit", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN), async (req, res) => {
    try {
      const result = await query("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100");
      res.json(result.rows);
    } catch (err) {
      console.error("[AUDIT] Fetch error:", err.message);
      res.json(auditTrail); // Fallback to in-memory if DB fails
    }
  });

  // User Management (Admin Only)
  app.get("/api/v1/admin/users", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN), async (req, res) => {
    try {
      const result = await query("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      console.error("[USERS] Fetch error:", err.message);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/v1/admin/users", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN), async (req, res) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const result = await query(
        "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
        [email, passwordHash, role]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("[USERS] Create error:", err.message);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // --- Chat API ---
  app.get("/api/v1/chat/history", authenticateToken, async (req, res) => {
    try {
      if (isCloudPersistenceEnabled()) {
        const cloudMsgs = await getCloudChatHistory(100);
        if (cloudMsgs && cloudMsgs.length > 0) {
          return res.json(cloudMsgs);
        }
      }
      const result = await query(
        "SELECT * FROM messages ORDER BY created_at ASC LIMIT 100"
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // --- Socket.io Logic ---
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return next(new Error("Authentication error"));
      (socket as any).user = user;
      next();
    });
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    console.log(`[Chat] User connected: ${user.email}`);

    socket.on("send_message", async (content) => {
      try {
        let newMessage: any = null;
        try {
          const result = await query(
            "INSERT INTO messages (sender_id, sender_email, content) VALUES ($1, $2, $3) RETURNING *",
            [user.id, user.email, content]
          );
          newMessage = result.rows[0];
        } catch (dbErr: any) {
          console.warn("[Chat DB] DB query error, creating standard response", dbErr.message);
          newMessage = {
            id: Date.now().toString(),
            sender_id: user.id || 0,
            sender_email: user.email,
            content,
            created_at: new Date().toISOString()
          };
        }

        // Push to Firebase Cloud Firestore for multi-node persistence
        if (isCloudPersistenceEnabled()) {
          try {
            const cloudDocId = await syncChatMessageToCloud(user.id || 0, user.email, content);
            if (cloudDocId) {
              newMessage.id = cloudDocId;
            }
          } catch (cloudErr: any) {
            console.error("[Cloud DB] Failed to sync message to Firestore:", cloudErr.message);
          }
        }

        io.emit("receive_message", newMessage);
      } catch (err) {
        console.error("Failed to save message", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Chat] User disconnected: ${user.email}`);
    });
  });

  // Start background engines
  const workflowEngine = new WorkflowEngine(io);
  workflowEngine.start();

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`StatGate Sovereign Engine V2.0 running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Sovereign Engine:", err);
  process.exit(1);
});
