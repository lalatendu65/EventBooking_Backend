import mongoose from "mongoose";
const options = {
  timestamps: true,
  versionKey: false,
};
const serviceSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, require: true, index: true },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["venue", "hotel", "caterer", "cameraman", "DJ"],
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    availabilityDates: [
      {
        type: Date,
        required: true,
      },
    ],
    contactDetails: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    servicesStatus: {
      type: String,
      enum: ["AVAILABLE", "NOTAVAILABLE"],
      default: "AVAILABLE",
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceProvider",
      required: true,
    },
    bookedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  options
);
const Service = mongoose.model("Service", serviceSchema);
export default Service;
