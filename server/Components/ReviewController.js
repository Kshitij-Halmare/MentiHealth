import ReviewModel from "../Schemas/ReviewSchema.js";
export async function AddReview(req, res) {
    const { review, userId } = req.body;
    console.log(review, userId);
    try {
        if (!review) {
            return res.status(400).json({
                message: "Review Required",
                error: true,
                success: false
            })
        }
        const newReview = {
            userId: userId,
            type: "Website",
            comment: review
        };
        const rev = new ReviewModel(newReview);
        await rev.save();
        return res.status(200).json({
            message: "Review Added SuccessFully",
            data: rev,
            error: false,
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: err,
            error: true,
            success: false
        })
    }
}


export async function ShowReviewWebsite(req, res) {
    try {
        const data = await ReviewModel.find({ type: "Website" })  // You should filter for "Website" reviews
            .populate("userId", "name")  // Correct the field name from "UserId" to "userId"
            .sort({ createdAt: -1 })  // Correct sorting syntax
            .limit(10);  // Limit the result to the latest 10 reviews

        return res.status(200).json({
            message: "Reviews Fetched Successfully",
            data: data,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: `Server Error: ${err.message}`,
            success: false
        });
    }
}
