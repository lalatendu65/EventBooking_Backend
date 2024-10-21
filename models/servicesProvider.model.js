import mongoose from "mongoose";
const options = {
  timestamps: true,
  versionKey: false,
};
const serviceProviderSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  options
);

const ServiceProvider = mongoose.model(
  "serviceProvider",
  serviceProviderSchema
);
export default ServiceProvider;
