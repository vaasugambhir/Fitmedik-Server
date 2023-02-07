import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import HospitalManager from "../models/HospitalManagerModel.js";

const User = HospitalManager

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.HOSPITAL_MANAGER_SECRET_KEY1);

      // console.log(decoded.data._id)
      req.user = await User.findById(decoded.data._id);
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
