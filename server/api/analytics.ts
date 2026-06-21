import { Router } from "express";

export const analyticsRouter = Router();

analyticsRouter.get("/dashboard/stats", (req, res) => {
  res.json({
    activeAgents: 124,
    totalProjects: 42,
    pendingPayments: "12.4M UGX",
    complianceScore: "98.2%"
  });
});

analyticsRouter.get("/staff", (req, res) => {
  res.json([
    { id: "AGT001", name: "Sarah Namukasa", region: "Central", district: "Kampala", status: "Active", integrityScore: 98, lastActive: new Date().toISOString(), isActive: true },
    { id: "AGT002", name: "James Okello", region: "Northern", district: "Gulu", status: "On Leave", integrityScore: 85, lastActive: new Date(Date.now() - 86400000).toISOString(), isActive: false },
  ]);
});

analyticsRouter.get("/districts", (req, res) => {
  res.json([
    { id: "KLA", name: "Kampala", activeAgents: 24, integrityScore: 99.2, coords: [0.3476, 32.5825] },
    { id: "GUL", name: "Gulu", activeAgents: 12, integrityScore: 96.5, coords: [2.7747, 32.2990] },
    { id: "MBR", name: "Mbarara", activeAgents: 15, integrityScore: 98.1, coords: [-0.6072, 30.6545] },
    { id: "JJA", name: "Jinja", activeAgents: 10, integrityScore: 97.8, coords: [0.4479, 33.2032] },
    { id: "ARU", name: "Arua", activeAgents: 8, integrityScore: 95.4, coords: [3.0303, 30.9073] },
  ]);
});

analyticsRouter.post("/query", (req, res) => {
  const { dimensions, metrics, filters } = req.body;
  
  // Real implementation would translate this to SQL (e.g. GROUP BY dimensions)
  // For now, simulate query engine processing
  console.log(`[QueryPlanner] Formulating query for dimensions: ${dimensions.join(',')}`);

  // Mock results structure dynamically based on dimensions and metrics requested
  const results = [];
  const regions = ["Central", "Northern", "Western", "Eastern"];
  const districts = ["Kampala", "Gulu", "Mbarara", "Arua", "Jinja"];
  
  for (let i = 0; i < 15; i++) {
    const row: any = {};
    dimensions.forEach((dim: string) => {
      if (dim === "region") row[dim] = regions[i % regions.length];
      if (dim === "district") row[dim] = districts[i % districts.length];
      if (dim === "year") row[dim] = 2026;
      if (dim === "status") row[dim] = i % 2 === 0 ? "Verified" : "Pending";
    });

    metrics.forEach((metric: string) => {
       if (metric === "population") row[metric] = Math.floor(Math.random() * 2000000) + 100000;
       if (metric === "growthRate") row[metric] = (Math.random() * 5).toFixed(1) + "%";
       if (metric === "integrityScore") row[metric] = (Math.random() * 20 + 80).toFixed(1);
    });

    results.push(row);
  }

  res.json({
    executionTimeMs: Math.floor(Math.random() * 150) + 20,
    rowCount: results.length,
    data: results
  });
});
