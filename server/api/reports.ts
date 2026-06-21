import { Router } from "express";

export const reportsRouter = Router();

reportsRouter.get("/", (req, res) => {
  res.json([
    { id: "r1", title: "National Demographic Dividend Analysis 2026", category: "Demographics", date: "2026-06-15", author: "StatGate Analytics", format: "PDF", status: "Verified" },
    { id: "r2", title: "Q2 Financial Integrity & Vendor Disbursements", category: "Finance", date: "2026-06-10", author: "Compliance Dept", format: "XLSX", status: "Verified" },
    { id: "r3", title: "Regional Healthcare Infrastructure Correlates", category: "Health", date: "2026-06-05", author: "AI Research", format: "PDF", status: "Verified" },
    { id: "r4", title: "Field Enumerator Recruitment Efficacy", category: "Operations", date: "2026-05-28", author: "HR Intelligence", format: "PDF", status: "Verified" },
    { id: "r5", title: "Agro-Economic Output Forecasts", category: "Economics", date: "2026-05-20", author: "StatGate Analytics", format: "HTML", status: "Verified" }
  ]);
});

