import UserModel from "../models/user.model.js";
import ServiceProvider from "../models/servicesProvider.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/token.js";
// customer signup
export const userSignup = async (req, res) => {
  try {
    const { name, email, password, cPassword, contactNo } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists Please Login" });
    }
    if (password !== cPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hasPassword = await bcrypt.hash(password, 10);
    // creating userId
    const lastCustomer = await UserModel.findOne().sort({ userId: -1 });
    const lastNumber = lastCustomer
      ? parseInt(lastCustomer.userId.substring(2), 10)
      : 0;
    const newUserId = `CU${(lastNumber + 1).toString().padStart(4, "0")}`;
    const user = await UserModel.create({
      userId: newUserId,
      name: name,
      email: email,
      password: hasPassword,
      contactNumber: contactNo,
      role: "user",
    });
    res.status(200).json({
      message: "user Sign up successfully pls login now ",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};
// customer Login
export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email is not register please signup" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateTokens(user);
    res.status(200).json({
      message: "Login successfully ",
      data: {
        Id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        accessToken: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to login user" });
  }
};

// serviceProvider signup
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password, cPassword, contactNo } = req.body;
    const existingUser = await ServiceProvider.findOne({ email }).lean();
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists Please Login" });
    }
    if (password !== cPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hasPassword = await bcrypt.hash(password, 10);
    const lastCustomer = await ServiceProvider.findOne().sort({ adminId: -1 });
    const lastNumber = lastCustomer
      ? parseInt(lastCustomer.adminId.substring(2), 10)
      : 0;
    const newUserId = `SER${(lastNumber + 1).toString().padStart(4, "0")}P`;
    // creating serviceProvider adminId
    const serviceProvider = await ServiceProvider.create({
      name: name,
      adminId: newUserId,
      email: email,
      password: hasPassword,
      contactNumber: contactNo,
      role: "admin",
    });
    res.status(200).json({
      message: "serviceProvider Sign up successfully pls login now ",
      data: serviceProvider,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};
// serviceProvider Login
export const adminSigIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const serviceProvider = await ServiceProvider.findOne({
      email,
      role: "admin",
    });
    if (!serviceProvider) {
      return res
        .status(400)
        .json({ message: "email is not register as Admin" });
    }
    const isMatch = await bcrypt.compare(password, serviceProvider.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateTokens(serviceProvider);
    res.status(200).json({
      message: "Login successfully",
      data: {
        serviceProviderId: serviceProvider._id,
        email: serviceProvider.email,
        accessToken: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to login user" });
  }
};
