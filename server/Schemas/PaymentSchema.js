import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counsellor", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "Rupees" },
    paymentStatus: { type: String, enum: ["success", "pending", "failed"], default: "pending" },
    paymentMethod: { type: String, enum: ["credit_card", "paypal", "stripe"], required: true },
    transactionId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  const PaymentModel = mongoose.model("Payment", paymentSchema);
  