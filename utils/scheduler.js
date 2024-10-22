import scheduler from "node-schedule";
import Booking from "../models/booking.model.js";

const rule = new scheduler.RecurrenceRule();
rule.minute = 0; // Run the job at the start of every hour

async function statusChangeToCompleted(bookingId) {
  try {
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return;

    const currentTime = new Date();
    const bookingTime = new Date(booking.endDate);

    if (currentTime.getTime() > bookingTime.getTime()) {
      await Booking.findByIdAndUpdate(
        bookingId,
        { status: "COMPLETED" },
        { new: true }
      );
      console.log(`Booking ${bookingId} status updated to COMPLETED`);
    }
  } catch (error) {
    console.error(`Error in statusChangeToCompleted: ${error.message}`);
  }
}

export const startAutoCompletingBooking = () => {
  scheduler.scheduleJob(rule, async () => {
    try {
      const currentTime = new Date();

      // Fetch only UPCOMING bookings where the endDate is in the past
      const bookings = await Booking.find({
        status: "UPCOMING",
        endDate: { $lte: currentTime },
      }).lean();

      if (bookings && bookings.length > 0) {
        for (const booking of bookings) {
          await statusChangeToCompleted(booking._id);
        }
      }
    } catch (error) {
      console.error(`Error in startAutoCompletingBooking: ${error.message}`);
    }
  });
};
