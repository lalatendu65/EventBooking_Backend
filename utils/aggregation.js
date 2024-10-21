import Service from "../models/services.model.js";
import Booking from "../models/booking.model.js";

export const getServices = (pageNumber, pageSize, servicesId) => {
  const matchStage = {
    _id: { $in: servicesId },
  };
  return Service.aggregate([
    {
      $match: matchStage,
    },
    {
      $project: {
        _id: 1,
        uniqueId: 1,
        title: 1,
        category: 1,
        pricePerDay: 1,
        description: 1,
        location: 1,
        availabilityDates: 1,
        contactDetails: 1,
        servicesStatus: 1,
        serviceProvider: 1,
        bookedServices: 1,
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
    {
      $skip: (pageNumber - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ]);
};

export const bookings = (pageNumber, pageSize, status, bookingId) => {
  const matchStage = {
    _id: { $in: bookingId },
  };
  if (status) {
    matchStage.status = { $in: status.split(",") }; // Add status condition
  }
  return Booking.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service",
      },
    },
    {
      $unwind: "$service",
    },
    {
      $project: {
        _id: 1,
        user: 1,
        service: 1,
        bookingDate: 1,
        startDate: 1,
        endDate: 1,
        totalPrice: 1,
        status: 1,
        updatedAt: 1,
        uniqueId: "$service.uniqueId",
        title: "$service.title",
        category: "$service.category",
        description: "$service.description",
        location: "$service.description",
        contactDetails: "$service.contactDetails",
        serviceProvider: "$service.serviceProvider",
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
    {
      $skip: (pageNumber - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ]);
};
