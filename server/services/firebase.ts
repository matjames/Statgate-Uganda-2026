import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  setDoc, 
  doc 
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load configuration
let firebaseConfig: any = null;
let db: any = null;
let isFirebaseActive = false;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const app = initializeApp({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId
    });
    
    // Explicitly target the database ID from config
    const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
    db = getFirestore(app, dbId);
    isFirebaseActive = true;
    console.log(`[Firebase Service] Firestore Initialized successfully. DB ID: ${dbId}`);
  } else {
    console.warn("[Firebase Service] Config not found, continuing without cloud persistence.");
  }
} catch (err: any) {
  console.error("[Firebase Service] Initialization error:", err.message);
}

export function isCloudPersistenceEnabled() {
  return isFirebaseActive;
}

// 1. Audit Logs Sync
export async function syncAuditLogToCloud(userId: string, action: string, entity: string, changes: any) {
  if (!isFirebaseActive) return;
  try {
    const colRef = collection(db, "audit_logs");
    await addDoc(colRef, {
      userId,
      action,
      entity,
      changes: changes ? (typeof changes === "string" ? changes : JSON.stringify(changes)) : "{}",
      timestamp: serverTimestamp()
    });
    console.log("[Firebase Service] Audit log synced with Firestore.");
  } catch (err: any) {
    console.error("[Firebase Service] Failed to sync audit log:", err.message);
  }
}

// 2. Chat Messages Sync
export async function syncChatMessageToCloud(senderId: number | string, senderEmail: string, content: string) {
  if (!isFirebaseActive) return;
  try {
    const colRef = collection(db, "chat_messages");
    const docRef = await addDoc(colRef, {
      senderId,
      senderEmail,
      content,
      created_at: serverTimestamp()
    });
    return docRef.id;
  } catch (err: any) {
    console.error("[Firebase Service] Failed to sync message:", err.message);
  }
}

// Get recent chat messages
export async function getCloudChatHistory(limitCount: number = 50) {
  if (!isFirebaseActive) return null;
  try {
    const colRef = collection(db, "chat_messages");
    const q = query(colRef, orderBy("created_at", "asc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    const msgs: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let dateString = new Date().toISOString();
      if (data.created_at) {
        try {
          dateString = data.created_at.toDate().toISOString();
        } catch (e) {
          // fallback if it's not a Timestamp object yet due to serverTimestamp() delay
          dateString = new Date().toISOString();
        }
      }
      msgs.push({
        id: doc.id,
        sender_id: data.senderId || 0,
        sender_email: data.senderEmail || "anonymous",
        content: data.content || "",
        created_at: dateString
      });
    });
    return msgs;
  } catch (err: any) {
    console.error("[Firebase Service] Failed to fetch cloud chat:", err.message);
    return null;
  }
}

// 3. Automated Pipelines State Tracking
export async function syncPipelineToCloud(pipelineId: string, name: string, steps: string, status: string, recordsProcessed?: number) {
  if (!isFirebaseActive) return;
  try {
    const docRef = doc(db, "pipelines", pipelineId);
    await setDoc(docRef, {
      id: pipelineId,
      name,
      steps,
      status,
      recordsProcessed: recordsProcessed || null,
      timestamp: serverTimestamp()
    });
    console.log(`[Firebase Service] Pipeline ${pipelineId} state synchronized.`);
  } catch (err: any) {
    console.error(`[Firebase Service] Failed to sync pipeline state:`, err.message);
  }
}

// Get recent pipelines
export async function getCloudPipelines() {
  if (!isFirebaseActive) return null;
  try {
    const colRef = collection(db, "pipelines");
    const q = query(colRef, orderBy("timestamp", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const pipelines: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let dateString = new Date().toISOString();
      if (data.timestamp) {
        try {
          dateString = data.timestamp.toDate().toISOString();
        } catch (e) {
          dateString = new Date().toISOString();
        }
      }
      pipelines.push({
        id: doc.id,
        name: data.name || "",
        steps: data.steps || "",
        status: data.status || "",
        recordsProcessed: data.recordsProcessed || null,
        timestamp: dateString
      });
    });
    return pipelines;
  } catch (err: any) {
    console.error("[Firebase Service] Failed to fetch pipelines:", err.message);
    return null;
  }
}
