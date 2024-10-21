import express from "express";
import { isAuthenticate, serviceProviderAuth } from "../utils/token.js";
import {
  creatingBooking,
  getAllBooking,
  getAllBookingForServicesProvider,
} from "../controller/booking.controller.js";

import { verifyGet } from "../middlewares/admin.validate.js";
import { verifyBooking } from "../middlewares/user.validate.js";

const router = express.Router();

router.patch(
  "/createBooking/:id",
  isAuthenticate,
  verifyBooking,
  creatingBooking
);
router.get("/getAllBooking", isAuthenticate, getAllBooking);
router.get(
  "/:id",
  serviceProviderAuth,
  verifyGet,
  getAllBookingForServicesProvider
);

export default router;
