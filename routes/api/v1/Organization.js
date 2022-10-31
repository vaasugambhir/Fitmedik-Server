import { Router } from "express";
import {
  createAction,
  createOrganization,
  getOrganization,
} from "../../../controllers/api/v1/Organization.js";

const router = Router();

router.post("/create_organization", createOrganization);
router.post("/get_organization", getOrganization);
router.post("/create_action", createAction);
export default router;
