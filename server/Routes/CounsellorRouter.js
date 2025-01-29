import express from "express";
import Stripe from "stripe";
import { AvailableSlots, CallsendConfirmationEmail, CancelSlot, Counsellors, getCounsellorById, getDetails, Login, RegisterCounsellor, SelectSlot } from "../Components/RegisterCounsellor.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Stripe with your secret key (ensure the key is in your environment variables)
const counsellorRouter = express.Router();

// Register routes for counsellor actions
counsellorRouter.post("/registerCounsellor", RegisterCounsellor);
counsellorRouter.get("/getCounsellor", Counsellors);
counsellorRouter.get("/specificCounsellor/:id", getCounsellorById);
counsellorRouter.get('/availableSlots/:counsellorId', AvailableSlots);
counsellorRouter.post("/bookSlot", SelectSlot);
counsellorRouter.post("/login", Login);
counsellorRouter.post("/getDetails", getDetails);
counsellorRouter.post("/cancelSlot",CancelSlot);
counsellorRouter.post("/CallsendConfirmationEmail",CallsendConfirmationEmail);
// Checkout route for handling Stripe payments
counsellorRouter.post("/checkout-payment", async (req, res) => {
    console.log("Checkout Data:", req.body.data); // Log for debugging
    try {
      // Extract the selected slot data
      const { counsellorId, day, time, userId } = req.body.data;
      const item = {
        name: `Counseling session with ${counsellorId}`,
        price: 2000, 
        qty: 1,
        images: [], // You can pass images if available
      };
  
      // Map cart items to Stripe line items
      const line_items = [
        {
          price_data: {
            currency: "inr", 
            product_data: {
              name: item.name,
              images: item.images || [], // Ensure images are provided or default to an empty array
            },
            unit_amount: item.price * 100, // Convert price to the smallest unit (e.g., paise for INR)
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        },
      ];
  
      // Prepare checkout session parameters
      const params = {
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        line_items,
        success_url: `http://localhost:5173/success`,
        cancel_url: `http://localhost:5173/cancel`,
      };
  
      // Create a new checkout session
      const session = await stripe.checkout.sessions.create(params);
  
      // Send session ID back to frontend
      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error("Error creating Stripe session:", err.message);
      res.status(500).json({
        message: "An error occurred while creating the Stripe session",
        error: err.message,
      });
    }
  });
  

export default counsellorRouter;
