import React, { useState } from 'react';  
import toast from 'react-hot-toast';  // Import toast for notifications

function ForgetPassword() {
    const [input, setInput] = useState("");  // Define state for email input

    const handleClick = async () => {
        // Check if input (email) is provided
        if (input) {
            try {
                // Make API request to send OTP to the provided email
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/resendOtp`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: input }),  // Ensure to pass the key as 'email'
                });
                const resData = await response.json();
                if (resData.success) {
                    toast.success("OTP sent to your email!");
                } else {
                    toast.error(resData.message || "Something went wrong.");
                }
            } catch (error) {
                toast.error("Error sending OTP. Please try again.");
            }
        } else {
            toast.error("Please enter your email!");
        }
    };

    const handleChange = (e) => {
        setInput(e.target.value);  // Update state when input changes
    };

    return (
        <div className="bg-gradient-to-b from-purple-100 via-white to-purple-200  md:min-h-screen md:p-12 min-h-[600px] pt-10 px-5">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h2>
                <p className="text-center text-gray-500 mb-6">Enter your email to receive a password reset link</p>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={input}
                        onChange={handleChange}
                        placeholder="Enter your Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleClick}
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    >
                        Send Reset Link
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
