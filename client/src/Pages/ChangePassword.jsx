import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import the icons
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function ChangePassword() {
  const [password, setPassword] = useState("");  // Password state
  const [seePassword, setSeePassword] = useState(false);  // State for toggling password visibility
  const navigate = useNavigate();
  const { userId } = useParams();  // Access userId correctly from useParams

  // Handle input change
  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (password.length < 5) {
      toast("Password must be at least 5 characters long");
      return;
    }

    try {
      // Sending the request to change the password
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const resData = await response.json();

      if (resData.success) {
        toast("Password Changed Successfully");
        navigate("/login");
      } else {
        toast.error(resData.message || "An error occurred");
      }
    } catch (error) {
      toast.error("Failed to change the password. Please try again.");
      console.error('Error during password change:', error);
    }
  };

  return (
    <div className="bg-pink-100 w-full h-screen flex justify-center items-center">
      <div className="bg-white w-96 rounded-md shadow-lg p-6 h-auto mt-20">
        <h1 className="text-xl font-semibold mb-4">Enter Your New Password</h1>

        {/* Password Input */}
        <form onSubmit={handleSubmit}>
          <div className="mt-5 relative">
            {/* Password Input Field */}
            <input
              type={seePassword ? "text" : "password"}  // Toggle between text and password
              value={password}
              onChange={handleInputChange}
              placeholder="Enter Your New Password"
              maxLength="20"  // Password length limit
              className="px-4 p-3 pl-10 w-full font-semibold font-serif bg-slate-200 placeholder:text-slate-600 rounded-md outline-none hover:shadow-md duration-200"
            />

            {/* Toggle Password Visibility Icon */}
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setSeePassword(!seePassword)}  // Toggle visibility state
            >
              {seePassword ? (
                <FaEye className="text-gray-500 text-xl" />  // Show eye icon when password is visible
              ) : (
                <FaEyeSlash className="text-gray-500 text-xl" />  // Show eye-slash icon when password is hidden
              )}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md mt-4 transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
