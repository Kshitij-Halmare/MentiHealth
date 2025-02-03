import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Provide password"]
    },
    phoneNo: {
        type: Number
    },
    avatar: {
        type: String,
        default: ""
    },
    mentalHealthRecords: [
        {
            data: { type: Date, default: Date.now() },
            notes: { type: String },
            summary: { type: String }
        }
    ],
    previousChats: [
        {
            chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        },
    ],
    isEmailVerified: {
        type: Boolean,
        default: true
    },
    refresh_token: {
        type: String,
        default: ""
    },
    testimonials: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        min: 0,  // changed minLength to min
        max: 5   // changed maxLength to max
    },
    forget_password: {  // Fixed field name here
        type: String
    },
    duration_forget_password: {
        type: Date
    },
    blogs: {
        type:[{
          title:{
            type:String,
            required:true
          },
          banner:{
            type:String,
            required:true
          }
        }]
      },
    bookedSessions: [
        {
            counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counsellor" },
            date: { type: Date, required: true },
            time: { type: String, required: true },
            meetingLink: { type: String },
        },
    ],
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
