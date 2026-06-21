import { Router } from "express";
import { analyticsRouter } from "./analytics";
import { datasetsRouter } from "./datasets";
import { reportsRouter } from "./reports";
import { aiRouter } from "./ai";
import { governanceRouter } from "./governance";
import { authenticateToken } from "../auth/middleware";

const apiRouter = Router();

apiRouter.use("/analytics", authenticateToken, analyticsRouter);
apiRouter.use("/datasets", authenticateToken, datasetsRouter);
apiRouter.use("/reports", authenticateToken, reportsRouter);
apiRouter.use("/ai", authenticateToken, aiRouter);
apiRouter.use("/governance", governanceRouter); // Governance routes have their own auth inside

export default apiRouter;

