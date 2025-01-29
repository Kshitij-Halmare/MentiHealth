import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["reminder", "bookingConfirmation", "sessionFeedback","Liked","comment"],
      required: true,
    },
    notification_for:{type:String,required:true},
    blogId:{type:mongoose.Schema.Types.ObjectId,ref:"Blog"},
    // message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Notification= mongoose.model("Notification", notificationSchema);
  export default Notification;