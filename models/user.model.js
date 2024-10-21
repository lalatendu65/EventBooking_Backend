import mongoose from "mongoose";
const options = {
  timestamps: true,
  versionKey: false,
};
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: String, required: true },
    role: {
      type: String,
      required: true,
    }, // Admin or Super admin
    contactNumber: { type: String, required: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }], // User's bookings
  },
  options
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
