import UserModel from "../Schemas/UserSchema.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../Config/sendEmail.js";
import verifyTemplate from "../VerifyTemplate/VerifyTemplate.js";
import generateAccessToken from "../utils/generateaccessToken.js";
import uploadImageCloudinary from "../utils/uploadImage.js";
import otpTemplate from "../VerifyTemplate/ResendOtpTEmplate.js";
import ChatModel from "../Schemas/ChatSchema.js";
const getUserData = (data) => {
    const data1 = { _id: data._id, name: data.name, email: data.email, isEmailVerified: data.isEmailVerified, }
    return data1;
}
export async function RegisterUser(req, res) {
    console.log(req.body);
    const { name, email, password, phoneNo, avatar } = req.body;
    const file = req.file;  // This is the uploaded avatar image file

    try {
        // Log the file and request body for debugging
        console.log("file", req.file);

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "User already exists, please log in.",
            });
        }

        // Initialize avatarUrl as null
        let avatarUrl = null;

        // Upload the avatar image to Cloudinary if a file was provided
        if (file) {
            const uploadResult = await uploadImageCloudinary(file.buffer); // Use the file buffer for Cloudinary
            console.log(uploadResult);  // Log the Cloudinary response
            avatarUrl = uploadResult.secure_url; // Get the secure URL for the uploaded image
        }
        console.log({ name, email, password, phoneNo, avatar });
        // Hash the user's password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user in the database
        const newUser = await UserModel.create({
            name,
            email,
            phoneNo,
            password: hashedPassword,
            avatar, // Store the avatar URL in the user's document
        });

        console.log("New User:", newUser);  // Log the new user for debugging
        const verifyEmailUrl = `http://localhost:5173/verify-email/${newUser._id}`;
        const emailSent = await sendEmail({
            sendTo: email,
            subject: "Verify Your Email",
            html: verifyTemplate(name, verifyEmailUrl),
        });

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                error: true,
                message: "Failed to send verification email.",
            });
        }
        return res.status(200).json({
            success: true,
            error: false,
            message: "User registered successfully. Please verify your email.",
        });
    } catch (error) {
        // Handle errors and send a detailed message
        console.error(error);  // Log the error for debugging
        return res.status(500).json({
            success: false,
            error: true,
            message: `An error occurred: ${error.message}`,
        });
    }
}

export async function Login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Email and password are required.",
        });
    }

    try {
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "User does not exist. Please register.",
            });
        }

        // Verify password
        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Incorrect password.",
            });
        }

        // Prepare data to send back
        const userData = {
            _id: user._id,
            email: user.email,
            role:"User"
        };

        // Generate the refresh token
        const refreshToken = await generateAccessToken(userData);
        
        // Set refresh token as a cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag only in production
            sameSite: "Lax",
        });

        return res.status(200).json({
            success: true,
            error: false,
            message: "Login successful.",
            userData, // Return relevant user data
            data: { refreshToken },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: `An error occurred: ${error.message}`,
        });
    }
}

export async function Logout(req, res) {
    const { userId } = req; // Assuming auth middleware sets `userId`

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Invalid logout request. User ID is missing.",
        });
    }

    try {
        // Find user and clear refresh token
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "User not found.",
            });
        }

        await UserModel.updateOne({ _id: userId }, { refresh_token: "" });

        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        return res.status(200).json({
            success: true,
            error: false,
            message: "Successfully logged out.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: `An error occurred: ${error.message}`,
        });
    }
}

export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId
        const image = req.file
        const upload = await uploadImageCloudinary(image);
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })
        console.log("image", image);
        return res.status(200).json({
            message: "upload profile",
            data: {
                _id: userId,
                avatar: upload.url
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err,
            success: false,
            error: true
        })
    }
}

export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId;
        const { name, email, password, phoneNo } = req.body;
        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                error: true,
                success: false,
            });
        }
        const user = await UserModel.findByIdAndUpdate(userId, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(phoneNo && { phoneNo: phoneNo }),
            ...(password && { password: password }),
        })

        return res.statu(200).json({
            message: "Data updated",
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmail(req, res) {
    try {
        const code = req.body.userId;
        console.log(code);

        const user = await UserModel.findByIdAndUpdate(code,{isEmailVerified:true});
        console.log(user);
        if (user) {
            return res.status(200).json({
                message: "User Signed SuccessFully",
                error: false,
                success: true,
                data:user
            });
        } else {
            return res.status(400).json({
                message: "User Cannot Signed in",
                error: true,
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error,
            error: false,
            success: true
        });
    }
}
export async function resetOtp(req, res) {
    const { email } = req.body;  // Extract email from the request body
    console.log(`Requested OTP for email: ${email}`);

    if (!email) {
        return res.status(400).json({
            message: "Email is required.",
            error: true,
            success: false,
        });
    }

    try {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);  // Ensure 6-digit OTP
        console.log(`Generated OTP: ${otp}`);

        // Find the user and update the OTP and the timestamp
        const user = await UserModel.findOneAndUpdate(
            { email: email },  // Find the user by email
            {
                forget_password: otp,  // Store the OTP in the user's document
                duration_forget_password: Date.now(),  // Store the current timestamp for expiration
            },
            { new: true }  // Return the updated user document
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false,
            });
        }

        // Construct verification URL (replace with actual deployed URL when ready)
        const verifyEmailUrl = `http://localhost:5173/resetOtp/${user._id}`;  // Use dynamic link

        // Ensure otpTemplate is imported or defined correctly
        const emailSent = await sendEmail({
            sendTo: email,
            subject: "Password Reset OTP",
            html: otpTemplate(user.name, otp, verifyEmailUrl), // Assuming `user.name` is available
        });
        console.log(user);
        if (emailSent) {
            return res.status(200).json({
                message: "OTP sent successfully.",
                error: false,
                success: true,
            });
        } else {
            return res.status(500).json({
                message: "Failed to send OTP email.",
                error: true,
                success: false,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false,
        });
    }
}
export async function CheckOtp(req, res) {
    const { userID, otp } = req.body;
    console.log(userID, otp);

    try {
        const user = await UserModel.findById(userID.userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        if (user.forget_password === otp) {
            return res.status(200).json({
                message: "OTP Verified",
                data: user,
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "Invalid OTP",
                data: user,
                success: false,
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error. Please try again later.",
            success: false,
        });
    }
}
export async function ChangePassword(req, res) {
    const { password, userId } = req.body;  // Destructure password and userId from req.body

    // Basic validation for the password and userId
    if (!password || password.length < 5) {
        return res.status(400).json({
            message: "Password must be at least 5 characters long",
            success: false,
            error: true,
        });
    }

    if (!userId) {
        return res.status(400).json({
            message: "User ID is required",
            success: false,
            error: true,
        });
    }

    try {
        // Hashing the password with bcrypt
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Updating the user's password
        const user = await UserModel.findByIdAndUpdate(userId, {
            password: hashedPassword
        }, { new: true });  // { new: true } ensures the updated user document is returned

        if (user) {
            return res.status(200).json({
                message: "Password Changed Successfully",
                success: true,
                error: false,
                data: user
            });
        } else {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }
    } catch (error) {
        console.error("Error changing password:", error);  // Optional: log the error for debugging
        return res.status(500).json({
            message: "An error occurred while changing the password",
            success: false,
            error: true,
        });
    }
}
export async function getScore(req,res){
    const {userId}=req.body;
    console.log(userId);
    try{
        const data=await ChatModel.find({userId:userId});
        return res.status(200).json({
            message:"retreived SuccessFully",
            data:data,
            success:true
        })
    }catch(err){
        return res.statu(500).json({
            message:err,
            success:false
        })
    }
}