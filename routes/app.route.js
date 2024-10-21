import { Router } from "express";
import authRoute from "./auth.route.js";
import serviceRoute from "./services.router.js";
import bookingRoute from "./booking.route.js";
const route = Router();

// Setup your routes here
route.use("/api/v1/auth", authRoute);
route.use("/api/v1/services", serviceRoute);
route.use("/api/v1/booking", bookingRoute);

export default route;
