import { Router } from "express";
import api_v1 from "./v1/index.js";
const router = Router();

router.use("/v1", api_v1);

export default router;
