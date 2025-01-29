import React, { useState } from "react";
import { FaUser, FaCamera, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
function Register() {
    const [avatar, setAvatar] = useState("");
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, phoneNo, password, confirmPassword } = data;
        console.log({ name, email, password, confirmPassword, phoneNo });
    
        if (!name || !email || !password || !confirmPassword || !phoneNo) {
            toast("All fields are required");
            return;
        }
        if (data.password !== data.confirmPassword) {
            toast("Passwords do not match!");
            return;
        }
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("avatar", avatar); // Ensure `avatar` is a File object
    
        // FormData automatically sets the correct content type, so don't use JSON.stringify
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/register`, {
            method: "POST",
            body: formData, // Send the FormData object directly
        });
    
        const resData = await response.json();
        if (response.status === 200) {
            toast.success("User Signed in successfully");
            toast.success("Please verify Your Email ");
        } else {
            toast.error(resData.message);
        }
        console.log(resData);
    };    

    return (
        <>
            <div className="bg-gradient-to-b from-purple-100 via-white to-purple-200 py-6 md:min-h-screen md:p-12">
                <div className="bg-white p-4 w-96 rounded-md drop-shadow-md m-auto">
                    <h1 className="font-serif text-2xl mb-4 text-center">Register</h1>
                    <div className="flex justify-center items-center text-4xl mb-4">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="User Avatar"
                                className="h-24 w-24 rounded-full object-cover shadow-md"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full shadow-md bg-gray-300 border-10 border-black flex justify-center items-center">
                                <FaUser className="text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div className="p-2 text-xl bg-blue-400 rounded-full w-8 h-8 m-auto absolute top-32 left-52 hover:bg-blue-900">
                        <label htmlFor="upload-avatar" className="cursor-pointer w-full h-full flex justify-center items-center">
                            <FaCamera className="text-white " />
                        </label>
                        <input
                            type="file"
                            id="upload-avatar"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
                                    if (file.size > 2 * 1024 * 1024) { // Limit to 2 MB
                                        toast.error("Image size should be less than 2MB");
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = () => setAvatar(reader.result);
                                    reader.readAsDataURL(file);
                                } else {
                                    toast.error("Only JPEG or PNG images are allowed");
                                }
                            }}
                        />
                    </div>
                    <div className="mt-10 mb-5">
                        <div className="mt-3 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaUser className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleInputChange}
                                className="w-full p-2 pl-10 outline-none border border-gray-300 focus:border-blue-500 text-gray-700 placeholder-gray-400 rounded-md shadow-sm transition duration-200"
                                placeholder="Enter Your Name"
                                required
                            />
                        </div>
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
                        <div className="mt-5 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaPhone className="text-gray-400" />
                            </span>
                            <input
                                type="tel"  // Changed to "tel" for phone numbers
                                name="phoneNo"
                                value={data.phoneNo}
                                onChange={handleInputChange}
                                className="pl-10 p-2 w-full outline-none border border-gray-300 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 rounded-md shadow-sm transition duration-200"
                                placeholder="Enter Your Phone Number"
                                required
                            />
                        </div>
                        <div className="mt-5 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaLock className="text-gray-400" />
                            </span>
                            <input
                                type={seePassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={handleInputChange}
                                placeholder="Enter Your Password"
                                className="p-2 pl-10 w-full outline-none border border-gray-300 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 rounded-md shadow-sm transition duration-200"
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
                        <div className="mt-5 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaLock className="text-gray-400" />
                            </span>
                            <input
                                type={seeConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Enter Your Confirm Password"
                                className="p-2 pl-10 w-full outline-none border border-gray-300 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 rounded-md shadow-sm transition duration-200"
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setSeeConfirmPassword(!seeConfirmPassword)}
                            >
                                {seeConfirmPassword ? (
                                    <FaEye className="text-gray-500 text-xl" />
                                ) : (
                                    <FaEyeSlash className="text-gray-500 text-xl" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 m-auto mb-2">
                        <button onClick={handleSubmit} className="p-2 rounded-md font-serif w-full bg-blue-500 hover:bg-blue-700 text-white transition duration-200">
                            Register
                        </button>
                    </div>
                    <div className='mt-3'>
                        <p>Already Registered? <span className='text-blue-500 hover:text-blue-700 cursor-pointer' onClick={() => navigate("/Login")}>Login</span></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
