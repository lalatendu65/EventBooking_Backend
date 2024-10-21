import Service from "../models/services.model.js";
import Booking from "../models/booking.model.js";
import UserModel from "../models/user.model.js";
import { bookings } from "../utils/aggregation.js";
import { transporter } from "../utils/sendingmail.js";
import dotenv from "dotenv";
dotenv.config();
// booking the services
export const creatingBooking = async (req, res) => {
  try {
    const servicesId = req.params.id;
    const userId = req.user._id;
    const { startDate, endDate } = req.body;

    const service = await Service.findById(servicesId).lean();
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const pricePerDay = service.pricePerDay;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    // Calculate the duration in milliseconds
    const durationInMs = endDateObj.getTime() - startDateObj.getTime();
    const durationInDays = durationInMs / (1000 * 60 * 60 * 24);

    // Calculate total price
    const totalPrice = durationInDays * pricePerDay;

    const newBooking = await Booking.create({
      bookingDate: new Date(),
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      user: userId,
      service: req.params.id,
    });
    const updateServices = await Service.findByIdAndUpdate(servicesId, {
      $push: {
        bookedServices: newBooking._id,
      },
    });
    const updateBookingToUser = await UserModel.findByIdAndUpdate(userId, {
      $push: {
        bookings: newBooking._id,
      },
    });

    if (!newBooking && !updateServices && !updateBookingToUser) {
      return res.status(400).json({ message: "Failed to create booking" });
    }
    const user = await UserModel.findById(userId).lean();
    const userEmail = user.email;
    console.log(service.category);
    // creating mail body
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Booking Confirmation",
      text: `Dear ${user.name}, Your booking with ID ${newBooking._id} has been successfully booked from ${startDate} to ${endDate} for ${service.category}.`,
      html: `<p>Dear ${user.name},</p><p>Your booking with ID <strong>${newBooking._id}</strong> has been successfully booked from <strong>${startDate}</strong> to <strong>${endDate}</strong> for <strong>${service.category}</strong>.</p>`,
    };
    // sending mail Body
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res
      .status(201)
      .json({ message: "Booking created successfully", data: newBooking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating booking" });
  }
};
// get all the booking for the User
export const getAllBooking = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const user = await UserModel.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bookingId = user.bookings;

    if (!bookingId && bookingId.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    const getBooking = await bookings(pageNumber, pageSize, status, bookingId);
    const totalCount = await Booking.countDocuments({
      _id: { $in: bookingId },
      ...(status && { status }), // Add status condition if it exists
    });
    res.status(200).json({
      message: "All booking fetched successFully ",
      data: getBooking,
      count: totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// get single booking for the services provider
export const getAllBookingForServicesProvider = async (req, res) => {
  try {
    const getAllBooking = await Booking.findById(req.params.id);
    if (!getAllBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({
      message: "Booking fetched successFully ",
      data: getAllBooking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error fetching bookings" });
  }
};
