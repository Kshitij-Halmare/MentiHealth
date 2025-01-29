import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs"; // Import bcryptjs for password comparison
import UserModel from "../Schemas/UserSchema.js";

// Function to generate the access token
const generateAccessToken = async (userData) => {
    try {
        const token = await jwt.sign(userData,
            process.env.SECRET_ACCESS_TOKEN || "abc", 
            { expiresIn: '7d' }
        );
        
        // Save refresh token into user document
        await UserModel.findByIdAndUpdate(userData._id, {
            $set: { refresh_token: token }
        });

        return token;
    } catch (err) {
        console.error(err);
        throw new Error("Error generating access token.");
    }
};

export default generateAccessToken;