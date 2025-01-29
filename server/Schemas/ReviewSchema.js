import mongoose from "mongoose";

// Define the Review schema
const reviewSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:["Counsellor","Website"],
        required:true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counsellor" },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;
