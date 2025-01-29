import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counsellor", required: true },
    sessionDate: { type: Date, required: true },
    sessionTime: { type: String, required: true },
    meetingLink: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    notes: { type: String },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    numberOfMeetings: { type: Number, default: 1 }, // Field to track the number of meetings
  },
  {
    timestamps: true,
  }
);

// Create an index for sessionDate to make date-based queries more efficient
bookingSchema.index({ sessionDate: 1, sessionTime: 1 });

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
