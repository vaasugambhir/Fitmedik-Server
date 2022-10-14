import { Router } from "express";
import {
  createOrganization,
  getOrganization,
} from "../../../controllers/api/v1/Organization.js";

const router = Router();

router.post("/create_organization", createOrganization);
router.post("/get_organization", getOrganization);

export default router;
