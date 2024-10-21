import Service from "../models/services.model.js";
import ServiceProvider from "../models/servicesProvider.model.js";
import { getServices } from "../utils/aggregation.js";

// creating new services
export const createNewServices = async (req, res) => {
  try {
    // creating  a unique id for each services
    const lastService = await Service.findOne().sort({ uniqueId: -1 });
    const lastNumber = lastService
      ? parseInt(lastService.uniqueId.substring(2), 10)
      : 0;
    const newServicesId = `SE${(lastNumber + 1).toString().padStart(4, "0")}ID`;

    req.body.uniqueId = newServicesId;
    req.body.serviceProvider = req.user._id;

    // Create a new service
    const newService = await Service.create(req.body);
    // Update the service provider to include the new service
    await ServiceProvider.findByIdAndUpdate(req.user._id, {
      $push: {
        servicesOffered: newService._id,
      },
    });

    res.status(200).json({
      message: "Services created successfully",
      data: newService,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create services",
      error,
    });
  }
};
// updating the services by Id
export const updateServicesById = async (req, res) => {
  try {
    const servicesId = req.params.id;

    // Fetch the service by ID
    const service = await Service.findById(servicesId);
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Ensure that the logged-in user is the service provider
    if (service.serviceProvider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this service",
      });
    }

    // Update the service with the new data
    const updatedService = await Service.findByIdAndUpdate(
      servicesId,
      req.body,
      {
        new: true,
        runValidators: true, // Ensure updated data passes schema validation
      }
    );

    res.status(200).json({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// deleting services By Id
export const deleteServicesById = async (req, res) => {
  try {
    const servicesId = req.params.id;

    // Find the service by ID
    const service = await Service.findById(servicesId);
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Check if the user is authorized to delete this service
    if (service.serviceProvider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this service",
      });
    }

    const deletedService = await Service.findByIdAndDelete(servicesId);

    //  remove the service from the ServiceProvider's list of offered services
    await ServiceProvider.findByIdAndUpdate(req.user._id, {
      $pull: { servicesOffered: servicesId },
    });

    res.status(200).json({
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
};
// getting all services for servicesProvider
export const getAllServicesForProvider = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const servicesProvider = await ServiceProvider.findById(req.user._id);
    // getting services id form servicesProvider
    const servicesId = servicesProvider.servicesOffered;
    if (!servicesId && servicesId.length === 0) {
      return res.status(404).json({
        message: "No services found",
      });
    }
    // getting all services
    const allServices = await getServices(pageNumber, pageSize, servicesId);
    // count of the total document
    const totalCount = await Service.countDocuments({
      _id: { $in: servicesId },
    });
    res.status(200).json({
      message: "all services fetched Successfully",
      data: allServices,
      count: totalCount,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// getting all services for users
export const getAllServices = async (req, res) => {
  try {
    const { priceRange, category, location, availability, page, limit } =
      req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    // Construct query object
    const query = { servicesStatus: "AVAILABLE" };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by location if provided
    if (location) {
      query.location = { $regex: new RegExp(location, "i") };
    }

    // Filter by priceRange if provided (expects priceRange as "min-max", e.g., "1000-2000")
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      query.pricePerDay = { $gte: minPrice, $lte: maxPrice };
    }

    // Filter by availability if provided (expects availability as "YYYY-MM-DD to YYYY-MM-DD")
    if (availability) {
      // Split the dates correctly
      const [startDateStr, endDateStr] = availability.split(" to ");
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // Check if the date objects are valid
      if (!isNaN(startDate) && !isNaN(endDate)) {
        query.availabilityDates = {
          $elemMatch: { $gte: startDate, $lte: endDate },
        };
      } else {
        return res
          .status(400)
          .json({ message: "Invalid date range provided." });
      }
    }

    // Pagination logic
    const skip = (pageNumber - 1) * pageSize;

    // Fetch all services based on the query and apply pagination
    const allServices = await Service.find(query)
      .skip(skip)
      .limit(Number(pageSize));

    // Count total documents for pagination info
    const totalServices = await Service.countDocuments(query);

    // Send response with services and pagination info
    res.status(200).json({
      message: "all services fetched Successfully",
      data: allServices,
      count: totalServices,
      totalPages: Math.ceil(totalServices / pageSize),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching services", error });
  }
};
