import mongoose from "mongoose";
const mentalHealthAnalyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    insights: [
        {
            date: { type: Date, default: Date.now },
            sentiment: { type: String, enum: ["positive", "neutral", "negative"] },
            summary: { type: String },
        },
    ],
    activityStats: {
        totalChats: { type: Number, default: 0 },
        totalSessions: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});

const MentalHealthAnalyticsModel = mongoose.model(
    "MentalHealthAnalytics",
    mentalHealthAnalyticsSchema
);
export default MentalHealthAnalyticsModel;