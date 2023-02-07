import { Router } from "express";
import {protect as managerProtect} from '../../../middleware/authMiddlewareManager.js'

import {
  createAction,
  destroyAction,
  getOrganization,
  updateAction,
} from "../../../controllers/api/v1/Organization.js";

const router = Router();

router.post("/get_organization",managerProtect, getOrganization);
router.post("/create_action",managerProtect, createAction);
router.post("/update_action",managerProtect, updateAction);
router.post("/destroy_action",managerProtect, destroyAction);
export default router;
