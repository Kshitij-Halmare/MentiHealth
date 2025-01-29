import React, { useContext, useState } from 'react';  
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';  // Icon imports
import { useNavigate } from 'react-router-dom';  // For navigation
import toast from "react-hot-toast";  // For showing notifications
import { UserContext } from "../Context/UserProvider.jsx"; // Correct import for UserContext

function Login() {
    const [data, setData] = useState({ email: "", password: "" });  // State for email and password
    const [seePassword, setSeePassword] = useState(false);  // State for password visibility
    const navigate = useNavigate();  // To navigate between pages
    const { Login } = useContext(UserContext);  // Get the Login function from context
    
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;  // Destructure the name and value from input
        setData((prev) => ({ ...prev, [name]: value }));  // Update state dynamically
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission
        const { email, password } = data;

        // Validate the inputs
        if (!password || !email) {
            toast.error("All fields are required.");
            return;
        }

        try {
            // Send login request to the backend
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",  // For sending cookies, if any
                body: JSON.stringify({ email, password }),
            });

            const resData = await response.json();  // Await the response and parse JSON
            console.log(resData);
            if (resData.success) {
                // Success: Navigate to another page (e.g., dashboard)
                toast.success("User logged in successfully.");
                localStorage.setItem("MentalHealth",resData.data.refreshToken);
                Login(resData.userData); // Store user data in global context
                navigate("/");  // Navigate to the dashboard after login
            } else {
                // Show error if login fails
                toast.error(resData.message || "An error occurred.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Login Error: ", error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-purple-100 via-white to-purple-200  md:min-h-screen md:p-12 min-h-[600px]">
            <div className="bg-white p-4 w-96 rounded-md drop-shadow-md m-auto">
                <h1 className="font-serif text-2xl mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mt-5 relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaEnvelope className="text-gray-400" />
                        </span>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                            className="p-2 pl-10 w-full outline-none border border-gray-300 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 rounded-md shadow-sm transition duration-200"
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mt-5 relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaLock className="text-gray-400" />
                        </span>
                        <input
                            type={seePassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            onChange={handleInputChange}
                            className="p-2 pl-10 w-full outline-none border border-gray-300 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 rounded-md shadow-sm transition duration-200"
                            placeholder="Enter Your Password"
                            required
                        />
                        <span
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setSeePassword(!seePassword)}
                        >
                            {seePassword ? (
                                <FaEye className="text-gray-500 text-xl" />
                            ) : (
                                <FaEyeSlash className="text-gray-500 text-xl" />
                            )}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-5">
                        <button
                            type="submit"
                            className="p-2 rounded-md font-serif bg-blue-500 hover:bg-blue-700 text-white transition duration-200 w-full"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Links */}
                <div className='mt-3'>
                    <p>Yet not registered? <span className='text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => navigate("/register")}>Register</span></p>
                    <p>Forgot Password? <span className='text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => navigate("/forgetPassword")}>Reset Password</span></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
