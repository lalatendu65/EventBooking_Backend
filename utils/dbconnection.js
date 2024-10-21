import mongoose from "mongoose";
//db connection
const connectToDatabase = (DB_URL) => {
  mongoose.connect(DB_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Error in connecting to DB: " + err);
  });
};
export default connectToDatabase;
