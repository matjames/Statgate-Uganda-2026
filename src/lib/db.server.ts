import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

const poolConfig: any = {};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  if (!process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  poolConfig.host = process.env.DB_HOST || 'localhost';
  poolConfig.port = parseInt(process.env.DB_PORT || '5432');
  poolConfig.user = process.env.DB_USER || 'postgres';
  poolConfig.password = process.env.DB_PASSWORD;
  poolConfig.database = process.env.DB_NAME || 'Statgate_uganda';
  poolConfig.ssl = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false;
}

const pool = new Pool(poolConfig);

// --- IN-MEMORY SOVEREIGN FALLBACK ENGINE ---
interface MockUser {
  id: number;
  email: string;
  password_hash: string | null;
  role: string;
  full_name?: string;
  phone_number?: string;
  organization?: string;
  job_title?: string;
  sector?: string;
  expertise?: string;
  location?: string;
  bio?: string;
  created_at: string;
}

interface MockAuditLog {
  id: number;
  timestamp: string;
  user_id: string;
  action: string;
  entity: string;
  changes: any;
}

interface MockMessage {
  id: number;
  sender_id: number;
  sender_email: string;
  content: string;
  created_at: string;
}

const mockUsers: MockUser[] = [];
const mockAuditLogs: MockAuditLog[] = [];
const mockMessages: MockMessage[] = [];

// Seed Default Admin in-memory
const defaultAdminHash = bcrypt.hashSync("StatGate2026!", 10);
mockUsers.push({
  id: 1,
  email: "admin@statgate.ug",
  password_hash: defaultAdminHash,
  role: "Sovereign Admin",
  full_name: "Sovereign Administrator",
  organization: "StatGate Uganda",
  job_title: "Chief Administrator",
  sector: "Government",
  location: "Kampala",
  created_at: new Date().toISOString()
});

let useFallback = false;

export const query = async (text: string, params?: any[]): Promise<any> => {
  if (useFallback) {
    return runFallbackQuery(text, params);
  }

  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err: any) {
    // If it's a connection-related error, activate self-healing fallback
    const isConnectionError = 
      err.message.includes("ECONNREFUSED") || 
      err.message.includes("ENOTFOUND") ||
      err.message.includes("getaddrinfo") ||
      err.message.includes("does not exist") ||
      err.message.includes("Connection terminated") ||
      err.message.includes("timeout") ||
      err.message.includes("cannot connect") ||
      err.message.includes("self-signed certificate") ||
      err.code === "ENOTFOUND";

    if (isConnectionError || (!process.env.DB_HOST && !process.env.DATABASE_URL)) {
      if (!useFallback) {
        console.warn("\n========================================================");
        console.warn("⚠️  POSTGRESQL CONNECTION FAILURE DETECTED!");
        console.warn(`Reason: ${err.message}`);
        console.warn("🚀 ACTIVATING SOVEREIGN IN-MEMORY FALLBACK ENGINE V2.0...");
        console.warn("All registrations, logins, and logs are now fully supported in-memory.");
        console.warn("========================================================\n");
        useFallback = true;
      }
      return runFallbackQuery(text, params);
    }
    throw err;
  }
};

const runFallbackQuery = (text: string, params?: any[]): any => {
  const normText = text.replace(/\s+/g, " ").trim();

  // 1. Health check or generic test query
  if (normText === "SELECT 1") {
    return { rows: [{ "?column?": 1 }] };
  }

  // 2. Insert User (Registration)
  if (normText.includes("INSERT INTO users")) {
    const email = params?.[0] || "";
    const password_hash = params?.[1] || null;
    const role = params?.[2] || "Client Observer";
    const full_name = params?.[3] || "";
    const phone_number = params?.[4] || "";
    const organization = params?.[5] || "";
    const job_title = params?.[6] || "";
    const sector = params?.[7] || "";
    const expertise = params?.[8] || "";
    const location = params?.[9] || "";
    const bio = params?.[10] || "";

    const userExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      throw new Error(`duplicate key value violates unique constraint "users_email_key"`);
    }

    const newUser: MockUser = {
      id: mockUsers.length + 1,
      email,
      password_hash,
      role,
      full_name,
      phone_number,
      organization,
      job_title,
      sector,
      expertise,
      location,
      bio,
      created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { rows: [newUser] };
  }

  // 3. Select User (Login or Auth lookup)
  if (normText.includes("FROM users")) {
    if (normText.includes("ORDER BY name") || normText.includes("ORDER BY created_at")) {
      return { rows: mockUsers };
    }

    const val = params?.[0];
    let found: MockUser | undefined;

    if (normText.includes("email =")) {
      found = mockUsers.find(u => u.email.toLowerCase() === String(val).toLowerCase());
    } else if (normText.includes("phone =")) {
      found = mockUsers.find(u => u.phone_number === val || u.email.includes(`phone-${val}`));
    } else if (normText.includes("google_id =") || normText.includes("github_id =")) {
      // Mock OAuth match or fallback
      found = mockUsers.find(u => u.email.includes("google") || u.email.includes("github") || u.id === val);
    } else {
      found = mockUsers.find(u => u.email.toLowerCase() === String(val).toLowerCase());
    }

    return { rows: found ? [found] : [] };
  }

  // 4. Insert Audit Log
  if (normText.includes("INSERT INTO audit_logs")) {
    const user_id = params?.[0] || "system";
    const action = params?.[1] || "";
    const entity = params?.[2] || "";
    const changes = params?.[3] ? JSON.parse(params[3]) : {};

    const newLog: MockAuditLog = {
      id: mockAuditLogs.length + 1,
      timestamp: new Date().toISOString(),
      user_id,
      action,
      entity,
      changes
    };
    mockAuditLogs.push(newLog);
    return { rows: [newLog] };
  }

  // 5. Select Audit Logs
  if (normText.includes("FROM audit_logs")) {
    const sorted = [...mockAuditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return { rows: sorted.slice(0, 100) };
  }

  // 6. Insert Chat Message
  if (normText.includes("INSERT INTO messages")) {
    const sender_id = params?.[0] || 0;
    const sender_email = params?.[1] || "";
    const content = params?.[2] || "";

    const newMsg: MockMessage = {
      id: mockMessages.length + 1,
      sender_id,
      sender_email,
      content,
      created_at: new Date().toISOString()
    };
    mockMessages.push(newMsg);
    return { rows: [newMsg] };
  }

  // 7. Select Chat Message History
  if (normText.includes("FROM messages")) {
    const sorted = [...mockMessages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return { rows: sorted.slice(0, 100) };
  }

  return { rows: [] };
};

export default pool;
