import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ServiceProvider from "../models/servicesProvider.model.js";
import UserModel from "../models/user.model.js";
dotenv.config();
export const generateTokens = (user) => {
  const payload = { _id: user._id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d", // Short-lived access token
  });

  return accessToken;
};
export async function isAuthenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    // Check if the token is provided
    if (!token) {
      return res.status(401).json({ message: "Access Token required" });
    }

    // Verify the access token
    const { exp, iat, ...userDetail } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // Check if the user exists in the database
    const user = await UserModel.findOne({ _id: userDetail._id });
    if (!user) {
      return res.status(404).json({ message: "Unauthorized token!" });
    }

    // Attach user to request object
    req.user = userDetail;
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      // Handle other errors (e.g., database errors)
      console.error("Authentication error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export async function serviceProviderAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    // Check if the token is provided
    if (!token) {
      return res.status(401).json({ message: "Access Token required" });
    }

    // Verify the access token
    const { exp, iat, ...userDetail } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // Check if the user exists in the database
    const user = await ServiceProvider.findOne({ _id: userDetail._id });
    if (!user) {
      return res.status(404).json({ message: "Unauthorized token!" });
    }

    // Attach user to request object
    req.user = userDetail;
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      // Handle other errors (e.g., database errors)
      console.error("Authentication error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
