import { Router } from "express";
import { authenticateToken, authorizeRoles, UserRole } from "../auth/middleware";
import { getCloudPipelines, isCloudPersistenceEnabled } from "../services/firebase";

export const governanceRouter = Router();

let pipelines = [
  { id: "1", name: "National Census Sync", steps: "Extract > Validate > Load", status: "Healthy", recordsProcessed: 4500000 },
  { id: "2", name: "Economic Indicators Pipeline", steps: "API Fetch > Cleanse > Index", status: "Running", recordsProcessed: 120000 },
  { id: "3", name: "Health Infrastructure Data", steps: "Submit > Manual Review > Approve", status: "Pending Review", recordsProcessed: 850 }
];

let alerts = [
  { id: "a1", type: "error", title: "Anomaly Detected", description: "Unusual spike in reported population density in Wakiso." },
  { id: "a2", type: "info", title: "New Schema Contract", description: "Economic indicators dataset updated its schema." }
];

// RBAC: Only Sovereign Admin, Lead Analyst can fetch lineage
governanceRouter.get("/lineage", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN, UserRole.LEAD_ANALYST), async (req, res) => {
  try {
    if (isCloudPersistenceEnabled()) {
      const cloudPipelines = await getCloudPipelines();
      if (cloudPipelines && cloudPipelines.length > 0) {
        // We merge with default core pipelines to display both hardcoded and real-time cloud-persisted ones
        const combined = [...cloudPipelines, ...pipelines];
        return res.json(combined);
      }
    }
  } catch (err: any) {
    console.error("[Governance API] Failed to fetch cloud pipelines:", err.message);
  }
  res.json(pipelines);
});

// RBAC: Operations for approvals
governanceRouter.post("/lineage/:id/approve", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN), (req, res) => {
  const { id } = req.params;
  const pipeline = pipelines.find(p => p.id === id);
  if (pipeline) {
    pipeline.status = "Healthy";
    res.json({ success: true, pipeline });
  } else {
    res.status(404).json({ error: "Pipeline not found" });
  }
});

// Access Control & Permissions visibility
governanceRouter.get("/alerts", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN, UserRole.LEAD_ANALYST), (req, res) => {
  res.json(alerts);
});

// Acknowledge alert
governanceRouter.post("/alerts/:id/acknowledge", authenticateToken, authorizeRoles(UserRole.SOVEREIGN_ADMIN, UserRole.LEAD_ANALYST), (req, res) => {
  alerts = alerts.filter(a => a.id !== req.params.id);
  res.json({ success: true });
});
