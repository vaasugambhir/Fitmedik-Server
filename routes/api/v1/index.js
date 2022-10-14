import { Router } from "express";
import { apiHome } from "../../../controllers/api/v1/Api_Home.js";
import Organization from "./Organization.js";
import Department from "./Department.js";
const router = Router();

router.get("/", apiHome);
router.use("/organization", Organization);
router.use("/department", Department);


export default router;
