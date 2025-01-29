import mongoose from "mongoose";

// Define the Counsellor schema
const CounsellorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneno: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    liscenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    specializations: {
      type: [String],
      required: true,
    },
    availability: {
      Monday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Tuesday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Wednesday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Thursday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Friday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Saturday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Sunday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
    },
    defaultAvailability: {
      Monday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Tuesday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Wednesday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Thursday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Friday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Saturday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
      Sunday: [{ time: { type: String, required: true }, isBooked: { type: Boolean, default: false } }],
    },
    rating: {
      type: String,
      default: "0",
    },
    price: {
      type: String,
      required: true,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"  // Ensure you reference the "Review" model correctly
    }],
});

// Register the Counsellor schema and model
const CounsellorModel = mongoose.model("Counsellor", CounsellorSchema);

export default CounsellorModel;
