import { Router } from "express";
import { apiHome } from "../../../controllers/api/v1/Api_Home.js";
import Organization from "./Organization.js";
import Department from "./Department.js";
import User from "../../../models/User.js";
const router = Router();

router.get("/", apiHome);

router.get("/user", async (req, res) => {
  const users = await User.find();

  return res.status(200).json({ users });
});

router.use("/organization", Organization);
router.use("/department", Department);

export default router;
