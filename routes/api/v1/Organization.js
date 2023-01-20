import { Router } from "express";
import {
  createAction,
  createOrganization,
  destroyAction,
  getOrganization,
  updateAction,
} from "../../../controllers/api/v1/Organization.js";

const router = Router();

router.post("/create_organization", createOrganization);
router.post("/get_organization", getOrganization);
router.post("/create_action", createAction);
router.post("/update_action", updateAction);
router.post("/destroy_action", destroyAction);

export default router;
