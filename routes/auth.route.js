import express from "express";
import {
  userSignup,
  userSignIn,
  adminSignup,
  adminSigIn,
} from "../controller/auth.controller.js";

const router = express.Router();
router.post("/signup", userSignup);
router.post("/login", userSignIn);
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminSigIn);
export default router;
