import { Router } from "express";
import {
  createDepartment,
  getDepartment,
} from "../../../controllers/api/v1/Department.js";

const router = Router();

router.post("/create_department", createDepartment);
router.get("/get_department", getDepartment);

export default router;
