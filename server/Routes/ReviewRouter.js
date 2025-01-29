import express from "express"
import { AddReview, ShowReviewWebsite } from "../Components/ReviewController.js";
const ReviewRouter=express.Router();
ReviewRouter.post("/addReview",AddReview);
ReviewRouter.get("/getWebsiteReview",ShowReviewWebsite);
export default ReviewRouter;