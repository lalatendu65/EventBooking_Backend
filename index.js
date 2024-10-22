import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./utils/dbconnection.js";
import routes from "./routes/app.route.js";
import mongoSanitize from "express-mongo-sanitize";
import { startAutoCompletingBooking } from "./utils/scheduler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.MONGO_URL;
// Database Connection
connectToDatabase(DB_URL);
// Middleware
app.use(mongoSanitize());
app.use(cors());
app.use(express.json({ limit: "1000mb" })); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form data

// scheduler
startAutoCompletingBooking();
// routes
app.use(routes);

// Basic route to check if the server is working
app.get("/", (req, res) => {
  res.send(
    `<body style = "display: flex; background-color: #89CFF0; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <h1 style = "width: 200px; height: 200px; background-color: #89CFF0; text-align: center; padding: 20px;">
            Welcome to webglow!
            a event Booking Site 
          </h1>
        </body>`
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
