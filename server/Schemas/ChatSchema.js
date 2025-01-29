import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({
    userId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
      }
    ],
    mentalHealthInsights: { type: String },  // AI-generated insights from the conversation
    mentalHealthScore: { type: Number },     // The average mental health score
    interactionCount: { type: Number, default: 1 },  // The count of interactions
    cumulativeScore: { type: Number, default: 0 },  // Sum of all mental health scores
    createdAt: { type: Date, default: Date.now },
  });
  
  const ChatModel = mongoose.model("Chat", ChatSchema);
  export default ChatModel;
  