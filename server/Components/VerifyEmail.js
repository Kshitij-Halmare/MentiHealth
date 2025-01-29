import UserModel from "../Schemas/UserSchema.js"
export default async function VerifyEmail(req, res) {
    const { code } = req.body;
    try {
        const user = await UserModel.findById(code);
        if (user) {
            user.isEmailVerified = true;
            await user.save();
            return res.status(200).json({
                succees: true,
                error: false,
                message: "Email Verified"
            })
        } else {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Please Signup with Correct email id"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error
        })
    }
}
// export default VerifyEmail;