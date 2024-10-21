import express from "express";
import {
  createNewServices,
  updateServicesById,
  deleteServicesById,
  getAllServicesForProvider,
  getAllServices,
} from "../controller/services.controller.js";
import { isAuthenticate, serviceProviderAuth } from "../utils/token.js";
import {
  verifyAdmin,
  verifyUpdate,
  verifyCreate,
} from "../middlewares/admin.validate.js";

const router = express.Router();
router.post(
  "/createServices",
  serviceProviderAuth,
  verifyCreate,
  createNewServices
);
router.patch(
  "/updateServices/:id",
  serviceProviderAuth,
  verifyUpdate,
  updateServicesById
);
router.delete("/deleteServices/:id", serviceProviderAuth, deleteServicesById);
router.get(
  "/allServices",
  serviceProviderAuth,
  verifyAdmin,
  getAllServicesForProvider
);
router.get("/getAllServices", isAuthenticate, getAllServices);

export default router;
