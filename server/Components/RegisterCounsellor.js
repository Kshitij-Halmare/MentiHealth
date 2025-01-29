import bcryptjs from "bcryptjs";
import CounsellorModel from "../Schemas/CounsellorSchema.js";
import BookingModel from "../Schemas/BookingSchema.js";  // Import the Booking model
import UserModel from "../Schemas/UserSchema.js";
import cron from "node-cron"
import generateAccessToken from "../utils/generateaccessToken.js";
import sendEmail from "../Config/sendEmail.js";


cron.schedule('0 * * * *', sendMeetingLinksForUpcomingMeetings);
export async function RegisterCounsellor(req, res) {
    const {
        name,
        price,
        email,
        phoneno,
        qualifications,
        experience,
        bio,
        image,
        specializations,
        password,
        liscenceNumber,
        availability,
    } = req.body;
    console.log(name, price, email, phoneno, qualifications, experience, bio, image, specializations, password, liscenceNumber, availability);

    try {
        // Validate required fields
        if (!name || !email || !phoneno || !qualifications || !experience || !bio || !image || !specializations || !password || !liscenceNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check for existing email or license number
        const existingCounsellor = await CounsellorModel.findOne({
            $or: [{ email }, { liscenceNumber }],
        });

        if (existingCounsellor) {
            return res.status(409).json({
                success: false,
                message: "Email or License Number already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Handle default availability structure if not provided
        const formattedAvailability = availability || {
            Monday: [{ time: "", isBooked: false }],
            Tuesday: [{ time: "", isBooked: false }],
            Wednesday: [{ time: "", isBooked: false }],
            Thursday: [{ time: "", isBooked: false }],
            Friday: [{ time: "", isBooked: false }],
            Saturday: [{ time: "", isBooked: false }],
            Sunday: [{ time: "", isBooked: false }],
        };

        // Create the new counsellor
        const newCounsellor = await CounsellorModel.create({
            name,
            email,
            phoneno,
            qualifications,
            experience,
            bio,
            image,
            price,
            specializations,
            password: hashedPassword,
            liscenceNumber,
            availability: formattedAvailability,
        });

        return res.status(201).json({
            success: true,
            message: "Counsellor created successfully",
            counsellor: {
                id: newCounsellor._id,
                name: newCounsellor.name,
                email: newCounsellor.email,
                price: newCounsellor.price,
                specializations: newCounsellor.specializations,
                availability: newCounsellor.availability,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}


export async function Counsellors(req, res) {
    try {
        const data = await CounsellorModel.find();

        if (data && data.length > 0) { // Ensure data exists and has records
            res.status(200).json({
                success: true,
                message: "Data retrieved successfully",
                user: data
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No data found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message // Send error details for debugging
        });
    }
}

export async function getCounsellorById(req, res) {
    try {
        const { id } = req.params;
        // console.log(id);
        const counsellor = await CounsellorModel.findById(id); // Replace with your database logic
        // console.log(counsellor);
        if (counsellor) {
            res.json({ success: true, user: counsellor });
        } else {
            res.json({ success: false, message: 'Counsellor not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


export async function AvailableSlots(req, res) {
    try {
        const { counsellorId } = req.params;
        // console.log('Counsellor ID:', counsellorId);
        const counsellor = await CounsellorModel.findById(counsellorId);

        if (!counsellor) {
            return res.json({
                success: false,
                message: "Counsellor not found"
            });
        }
        // console.log(counsellor);
        // console.log(counsellor.availability);

        return res.json({
            success: true,
            availableslots: counsellor
        });

    } catch (err) {
        console.log(err);  // Log any error for debugging
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
export async function CallsendConfirmationEmail(req,res){
    console.log("req",req.body);
    const user=req.body.book.user;
    const counsellor=req.body.book.counsellor;
    const newBooking=req.body.book.newBooking;
    try{
        await sendConfirmationEmail(user,counsellor,newBooking);
        return res.status(200).json({
            mressage:"SuccessFully sent",
            success:true
        })
    }catch(err){
        return res.status(500).json({
            message:err,
            success:false
        })
    }
}


async function sendConfirmationEmail(user, counsellor, booking) {
    console.log("reviecved",user,counsellor,booking);
    const emailSent = await sendEmail({
        sendTo: user.email, // Recipient email
        subject: `Your Appointment with ${counsellor.name} - Booking Confirmed`,
        html: confirmationEmailTemplate(user.name, counsellor.name, booking.sessionDate.toLocaleString(), booking.sessionTime, booking.meetingLink),
    });

    if (!emailSent) {
        console.error(`Failed to send confirmation email to ${user.email}`);
    } else {
        console.log(`Confirmation email sent to ${user.email}`);
    }
}

// Confirmation email template
function confirmationEmailTemplate(userName, counsellorName, sessionDateTime, sessionTime, meetingLink) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f7f6; color: #333; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #4a90e2; text-align: center;">Appointment Booking Confirmed!</h1>
            
            <p>Dear <strong>${userName}</strong>,</p>
            
            <p>Thank you for booking your session with <strong>${counsellorName}</strong>! We’re excited to help you on your journey. Below are the details of your upcoming session:</p>
            
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Session Date & Time:</strong> ${sessionDateTime} (${sessionTime})</p>
              <p><strong>Meeting Link 1 hour prior Join Your Session </a></p>
            </div>
  
            <p>We look forward to connecting with you! If you have any questions or need further assistance, feel free to reach out to us.</p>
  
            <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
              <p>Best regards,</p>
              <p>The Open Heart Team</p>
              <p><em>If you did not make this booking, please contact our support immediately.</em></p>
            </div>
  
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 12px; color: #aaa;">You’re receiving this email because you booked a session with us. For any inquiries, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
}

// Function to handle the slot selection (booking the slot and sending email)
export async function SelectSlot(req, res) {
    const { counsellorId, day, time, userId } = req.body;

    if (!counsellorId || !day || !time || !userId) {
        return res.status(400).json({ message: "Counsellor ID, day, time, and user ID are required" });
    }

    try {
        // Find the counsellor by ID
        const counsellor = await CounsellorModel.findById(counsellorId);
        if (!counsellor) {
            return res.status(404).json({ message: "Counsellor not found" });
        }

        // Validate day of the week
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (!daysOfWeek.includes(day)) {
            return res.status(400).json({ message: "Invalid day of the week" });
        }

        // Calculate the date for the requested day of the week
        const today = new Date();
        const currentDayIndex = today.getDay(); // Get today's day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const targetDayIndex = daysOfWeek.indexOf(day); // Get the index of the requested day
        const daysDifference = targetDayIndex - currentDayIndex;

        // If the target day has already passed this week, move to next week
        const daysUntilTarget = daysDifference >= 0 ? daysDifference : daysDifference + 7;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);

        // Parse the time (e.g., "1 PM" => 13:00)
        const [hourString, period] = time.split(" ");
        let hour = parseInt(hourString);
        if (period === "PM" && hour < 12) {
            hour += 12; // Convert PM time to 24-hour format
        }
        if (period === "AM" && hour === 12) {
            hour = 0; // Convert 12 AM to 00:00
        }

        // Set the target date's time to the specified hour
        targetDate.setHours(hour, 0, 0, 0); // Set minutes, seconds, and milliseconds to 0

        // Find the slot for the given day and time
        const slot = counsellor.availability[day].find((s) => s.time === time);
        if (!slot || slot.isBooked) {
            return res.status(400).json({ message: "Slot is unavailable or already booked" });
        }

        // Find the user by userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user already has a booking at the same time
        const existingBooking = await BookingModel.findOne({
            userId,
            counsellorId,
            sessionDate: { $eq: targetDate.setHours(0, 0, 0, 0) },  // Compare only the date (no time)
            sessionTime: time,
        });
        if (existingBooking) {
            return res.status(400).json({ message: "You already have a session booked at this time." });
        }

        // Create a new Booking record
        const newBooking = new BookingModel({
            userId: user._id,
            counsellorId: counsellor._id,
            counsellorName:counsellor.name,
            sessionDate: targetDate, // Use the calculated session date
            sessionTime: time,
            meetingLink: "https://dummy-meeting-link.com/meeting/" + new Date().getTime(),  // Replace with logic to generate a meeting link
        });

        // Save the new booking
        await newBooking.save();

        // Mark the slot as booked in the counsellor's availability
        slot.isBooked = true;
        await counsellor.save();

        // Optionally, update user's booking history
        user.bookedSessions.push({
            counsellorId,
            date: targetDate,
            time,
            meetingLink: newBooking.meetingLink,
        });
        await user.save();

        // Send confirmation email to the user
        // await sendConfirmationEmail(user, counsellor, newBooking);

        const data={user,newBooking,counsellor};
        // console.log(data);

        return res.status(200).json({ message: "Slot successfully booked", booking: data });
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        return res.status(500).json({ message: "Failed to book the slot", error: error.message });
    }
}


export async function CancelSlot(req, res) {
    const { counsellorId, day, time, userId } = req.body;

    if (!counsellorId || !day || !time || !userId) {
        return res.status(400).json({ message: "Counsellor ID, day, time, and user ID are required" });
    }

    try {
        // Find the counsellor by ID
        const counsellor = await CounsellorModel.findById(counsellorId);
        if (!counsellor) {
            return res.status(404).json({ message: "Counsellor not found" });
        }

        // Validate day of the week
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (!daysOfWeek.includes(day)) {
            return res.status(400).json({ message: "Invalid day of the week" });
        }

        // Find the booking
        const booking = await BookingModel.findOne({
            userId,
            counsellorId,
            sessionDate: { $eq: new Date(day) },
            sessionTime: time,
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Mark the slot as available in counsellor's availability
        const slot = counsellor.availability[day].find((s) => s.time === time);
        if (slot) {
            slot.isBooked = false;
            await counsellor.save();
        }

        // Delete the booking record
        await booking.remove();

        // Optionally, update user's booking history
        const user = await UserModel.findById(userId);
        if (user) {
            user.bookedSessions = user.bookedSessions.filter(
                (session) => session.sessionTime !== time || session.sessionDate.toString() !== booking.sessionDate.toString()
            );
            await user.save();
        }

        // Send cancellation email to the user (optional)
        // await sendCancellationEmail(user, counsellor, booking);

        return res.status(200).json({ message: "Booking successfully canceled" });
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
        return res.status(500).json({ message: "Failed to cancel the booking", error: error.message });
    }
}


// Function to reset past bookings
async function resetPastBookings() {
    try {
      const currentTime = new Date();
  
      // Fetch all counsellors from the database
      const counsellors = await CounsellorModel.find();
  
      for (const counsellor of counsellors) {
        // Loop through each day in counsellor's availability
        for (const day in counsellor.availability) {
          if (Array.isArray(counsellor.availability[day])) {
            // Process each slot
            counsellor.availability[day].forEach((slot) => {
              const slotDateTime = new Date(`${new Date().toLocaleDateString()} ${slot.time}`);
              if (slotDateTime < currentTime && slot.isBooked) {
                slot.isBooked = false; // Reset the booking
              }
            });
          }
        }
  
        // Save the updated availability back to the database
        await counsellor.save();
      }
  
      console.log("Successfully reset past bookings!");
    } catch (error) {
      console.error("Error resetting past bookings:", error);
    }
  }
cron.schedule('* * * * *', resetPastBookings);

async function sendMeetingLinksForUpcomingMeetings() {
    try {
        // Get the current time and the time one hour from now
        const currentTime = new Date();
        const nextHourTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add one hour

        // Query to find all bookings scheduled within the next hour
        const upcomingBookings = await BookingModel.find({
            sessionDate: { $gte: currentTime, $lt: nextHourTime },
            sessionTime: { $gte: currentTime.getHours() }
        });

        // Loop through all upcoming bookings
        for (let booking of upcomingBookings) {
            const user = await UserModel.findById(booking.userId);
            if (user) {
                // Send email with the meeting link
                await sendMeetingLinkToUser(user, booking);
            }
        }

        console.log("Meeting links sent for upcoming meetings.");
    } catch (error) {
        console.error("Error sending meeting links:", error);
    }
}

// Function to send the meeting link to the user
async function sendMeetingLinkToUser(user, booking) {
    const emailSent = await sendEmail({
        sendTo: user.email, // Recipient email
        subject: "Link to Your Upcoming Meeting", // Subject of the email
        html: meetingLinkTemplate(user.name, booking.sessionDate.toLocaleString(), booking.meetingLink), // Email body with the generated HTML template
    });

    if (!emailSent) {
        console.error(`Failed to send meeting link to ${user.email}`);
    } else {
        console.log(`Meeting link sent to ${user.email}`);
    }
}

// Email template for meeting link
function meetingLinkTemplate(userName, sessionDateTime, meetingLink) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f7f6; color: #333; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #4a90e2; text-align: center;">Upcoming Meeting Reminder</h1>
            <p>Dear <strong>${userName}</strong>,</p>
            <p>We hope you're doing well! This is a reminder for your upcoming meeting with your counselor.</p>
            
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Session Date & Time:</strong> ${sessionDateTime}</p>
              <p><strong>Meeting Link:</strong> <a href="${meetingLink}" target="_blank" style="color: #007BFF;">Click here to join the session</a></p>
            </div>
            
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            
            <div style="margin-top: 30px; text-align: center; color: #aaa;">
              <p>Best regards,</p>
              <p>The Counseling Team</p>
              <p><em>If you did not book this appointment, please contact support immediately.</em></p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;">
              <p>You are receiving this email because you have a scheduled session. For further inquiries, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
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
        const user = await CounsellorModel.findOne({ email });
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
            role:"counsellor"
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



export async function getDetails(req, res) {
    const { _id, role } = req.body;

    // Handle the case if role is "User"
    if (role === "User") {
        try {
            // Retrieve the user from the database and populate the related fields
            const user = await UserModel.findById(_id)
                // .populate('previousChats.chatId')   // Populate the chatId in previousChats
                // .populate('bookedSessions.counsellorId'); // Populate the counsellorId in bookedSessions

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Send the populated user details in the response
            return res.status(200).json({ data:user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching user details" });
        }
    } 
    // Handle the case if role is "Counsellor"
    else if (role === "counsellor") {
        try {
            // Retrieve the counsellor from the database and populate the related fields
            const counsellor = await CounsellorModel.findById(_id)
                // .populate('reviews');  // Populate reviews correctly (array of ObjectIds)

            if (!counsellor) {
                return res.status(404).json({ message: "Counsellor not found" });
            }

            // Check if the counsellor has any reviews
            // if (!counsellor.reviews || counsellor.reviews.length === 0) {
            //     return res.status(200).json({ message: "No reviews available for this counsellor." });
            // }

            // If reviews are found, send the counsellor details including the reviews
            return res.status(200).json({ data:counsellor });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching counsellor details" });
        }
    } 
    // Handle invalid role
    else {
        return res.status(400).json({ message: "Invalid role" });
    }
}



