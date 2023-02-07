import { Router } from "express";
import { apiHome } from "../../../controllers/api/v1/Api_Home.js";
// import { signUp } from '../../../controllers/api/v1/SignUp.js';
import Organization from "./Organization.js";
import Department from "./Department.js";
import HealthData from "./Health_Data.js";
import User from "../../../models/User.js";
import OrganizationSchema from "../../../models/Organization.js";
import DepartmentSchema from "../../../models/Department.js";
const router = Router();

router.use("/organization", Organization);
router.use("/department", Department);
router.use("/health-data", HealthData);

// router.get('/SignUp', signUp);
router.get("/", apiHome);

export default router;
