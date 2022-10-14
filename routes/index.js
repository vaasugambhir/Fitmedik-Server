import { Router } from "express";
import { Home } from "../controllers/Home_Controller.js";
import api from "./api/index.js";

const router = Router();

router.get("/", Home);
router.use("/api", api);

export default router;
