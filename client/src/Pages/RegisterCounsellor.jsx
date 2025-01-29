import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUnlock,
    FaUserAlt,
    FaCamera,
    FaPhone,
    FaCertificate,
    FaRegClock,

} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
function RegisterCounsellor() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        phoneno: '',
        qualifications: '',
        experience: '',
        bio: '',
        image: '',
        price: " ",
        specializations: [],
        password: '',
        confirmpassword: '',
        liscenceNumber: "",
        agreeToTerms: false,
        availability: {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
        },
    });

    // Handle availability checkbox change
    const handleAvailabilityChange = (checked, day, hour) => {
        setData((prevState) => {
            const newAvailability = prevState.availability[day].includes(hour)
                ? prevState.availability[day].filter((h) => h !== hour)
                : [...prevState.availability[day], { time: hour, isBooked: false }];

            return {
                ...prevState,
                availability: {
                    ...prevState.availability,
                    [day]: newAvailability,
                },
            };
        });
    };

    const [eye, setEye] = useState(false); // Toggle for confirm password
    const [eye1, setEye1] = useState(false); // Toggle for password

    const handleCheckboxChange = (checked, specialization) => {
        if (checked) {
            setData({
                ...data,
                specializations: [...data.specializations, specialization],
            });
        } else {
            setData({
                ...data,
                specializations: data.specializations.filter(
                    (item) => item !== specialization
                ),
            });
        }
    };


    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleChange = (value, field) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setData((prev) => ({ ...prev, image: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // // Validate all fields
        // if (
        //     !data.name ||
        //     !data.email ||
        //     !data.password ||
        //     !data.confirmpassword ||
        //     !data.agreeToTerms ||
        //     !data.bio ||
        //     !data.experience ||
        //     !data.image ||

        //     !data.liscenceNumber ||
        //     !data.phoneno ||
        //     !data.qualifications ||
        //     !data.specializations.length ||
        //     Object.values(data.availability).every((day) => day.length === 0)
        // ) {
        //     toast.error("All fields are required, including the image and availability.");
        //     return;
        // }

        const errors = [];
        if (!data.name) errors.push("Name is required.");
        if (!data.email) {
            errors.push("Email is required.");
        } else if (!validateEmail(data.email)) {
            errors.push("Invalid email format.");
        }
        if (!data.password) errors.push("Password is required.");
        if (!data.confirmpassword) errors.push("Confirm Password is required.");
        if (data.password !== data.confirmpassword) {
            errors.push("Passwords do not match.");
        }
        if (!data.phoneno) errors.push("Phone number is required.");
        if (!data.qualifications) errors.push("Qualifications are required.");
        if (!data.experience) errors.push("Experience is required.");
        if (!data.bio) errors.push("Bio is required.");

        if (!data.image) errors.push("Profile image is required.");
        if (!data.price) errors.push("price is required.");
        if (!data.specializations.length) errors.push("At least one specialization is required.");
        if (!data.liscenceNumber) errors.push("License number is required.");
        if (Object.values(data.availability).every((day) => day.length === 0)) {
            errors.push("Availability must be set for at least one day.");
        }

        // Display errors
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return;
        }

        // Check password match
        if (data.password !== data.confirmpassword) {
            toast.error("Passwords do not match.");
            return;
        }

        // Validate email
        if (!validateEmail(data.email)) {
            toast.error("Invalid email format.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/registerCounsellor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phoneno: data.phoneno,
                    qualifications: data.qualifications,
                    experience: data.experience,
                    bio: data.bio,
                    image: data.image,
                    specializations: data.specializations,
                    password: data.password,
                    liscenceNumber: data.liscenceNumber,
                    availability: data.availability,
                    price: data.price
                }),
            });
            const result = await response.json();
            
            if (response.ok) {
                toast.success("Registration successful!");
                // Redirect or reset form logic here
            } else {
                toast.error(result.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred during registration. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-pink-200 via-purple-100 to-pink-200">
            <div className="w-96 bg-white rounded-lg shadow-xl shadow-white p-8 mt-10 mb-10">
                <div className="relative w-24 h-24 mx-auto mb-5">
                    <div className="bg-slate-300 rounded-full flex items-center justify-center shadow-lg text-slate-700 text-4xl h-full overflow-hidden">
                        {data.image ? (
                            <img
                                src={`data:image/jpeg;base64,${data.image}`}
                                alt="Profile Preview"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <FaUserAlt />
                        )}
                    </div>
                    <label
                        htmlFor="profileImage"
                        className="absolute bottom-1 right-1 w-8 h-8 flex justify-center items-center shadow-lg text-xl bg-white p-1 rounded-full cursor-pointer hover:bg-gray-200 transition duration-200"
                    >
                        <FaCamera />
                    </label>
                    <input
                        id="profileImage"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <h1 className="text-3xl font-semibold text-center text-gray-800">Welcome Counsellor</h1>
                <p className="text-sm text-center text-gray-500 mt-2">Please create your account</p>
                <div className="mt-6 flex flex-col gap-4">
                    <InputField
                        label="Name"
                        icon={<FaUser className="text-gray-500 mr-2" />}
                        type="text"
                        value={data.name}
                        placeholder="Enter your Name"
                        onChange={(e) => handleChange(e.target.value, "name")}
                    />
                    <InputField
                        label="Email"
                        icon={<FaEnvelope className="text-gray-500 mr-2" />}
                        type="email"
                        value={data.email}
                        placeholder="Enter your Email"
                        onChange={(e) => handleChange(e.target.value, "email")}
                    />
                    <InputField
                        label="Phone Number"
                        icon={<FaPhone className="text-gray-500 mr-2" />}
                        type="tel"
                        value={data.phoneno}
                        placeholder="Enter your Phone Number"
                        onChange={(e) => handleChange(e.target.value, "phoneno")}
                    />
                    <InputField
                        label="Qualifications / Certifications"
                        icon={<FaCertificate className="text-gray-500 mr-2" />}
                        type="text"
                        value={data.qualifications}
                        placeholder="Enter your qualifications"
                        onChange={(e) => handleChange(e.target.value, "qualifications")}
                    />
                    <InputField
                        label="Liscence Number"
                        // icon={< className="text-gray-500 mr-2" />}
                        type="text"
                        value={data.liscenceNumber}
                        placeholder="Enter your Liscence Number"
                        onChange={(e) => handleChange(e.target.value, "liscenceNumber")}
                    />
                    <InputField
                        label="Years of Experience"
                        icon={<FaRegClock className="text-gray-500 mr-2" />}
                        type="number"
                        value={data.experience}
                        placeholder="Enter your years of experience"
                        onChange={(e) => handleChange(e.target.value, "experience")}
                    />
                    <InputField
                        label="Bio"
                        icon={<FaUser className="text-gray-500 mr-2" />}
                        type="textarea"
                        value={data.bio}
                        placeholder="Tell us a little about yourself"
                        onChange={(e) => handleChange(e.target.value, "bio")}
                    />

                    <InputField
                        label="Fees"
                        // icon={<FaUser className="text-gray-500 mr-2" />}
                        type="number"
                        value={data.price}
                        placeholder="Price"
                        onChange={(e) => handleChange(e.target.value, "price")}
                    />

                    {/* <InputField
                        label="LinkedIn Profile"
                        icon={<FaLinkedin className="text-gray-500 mr-2" />}
                        type="url"
                        value={data.linkedin}
                        placeholder="Enter your LinkedIn profile link"
                        onChange={(e) => handleChange(e.target.value, "linkedin")}
                    /> */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Counseling Specialization
                        </label>
                        <div className="mt-2 space-y-2">
                            {["Mental Health", "Addiction", "Relationship", "Career", "Family", "Grief"].map((specialization) => (
                                <div key={specialization} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={specialization}
                                        checked={data.specializations.includes(specialization)}
                                        onChange={(e) => handleCheckboxChange(e.target.checked, specialization)}
                                        className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={specialization} className="ml-2 text-sm text-gray-600">
                                        {specialization}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Availability Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700">Availability</h3>
                        <p className="text-sm text-gray-600 mb-4">Select the days you're available and check the hours you are available (with a 2-hour gap).</p>

                        {Object.keys(data.availability).map((day) => (
                            <div key={day} className="mb-6">
                                <h4 className="font-medium text-sm text-gray-800">{day}</h4>
                                <div className="grid grid-cols-4 gap-4 mt-2">
                                    {[...Array(7).keys()].map((hour) => {
                                        const startTime = 9 + hour * 2;
                                        const displayTime = startTime < 12 ? `${startTime} AM` : `${startTime - 12} PM`;
                                        const isAvailable = data.availability[day].some((slot) => slot.time === displayTime);

                                        return (
                                            <label key={hour} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isAvailable}
                                                    onChange={(e) => handleAvailabilityChange(e.target.checked, day, displayTime)}
                                                    className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-600">{displayTime}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>



                    <InputField
                        label="Password"
                        icon={<FaLock className="text-gray-500 mr-2" />}
                        type={eye1 ? "text" : "password"}
                        value={data.password}
                        placeholder="Enter your Password"
                        toggleIcon={
                            <button
                                type="button"
                                onClick={() => setEye1(!eye1)}
                                aria-label="Toggle password visibility"
                                className="focus:outline-none ml-2"
                            >
                                {eye1 ? <AiFillEyeInvisible className="text-gray-500" /> : <AiFillEye className="text-gray-500" />}
                            </button>
                        }
                        onChange={(e) => handleChange(e.target.value, "password")}
                    />
                    <InputField
                        label="Confirm Password"
                        icon={<FaUnlock className="text-gray-500 mr-2" />}
                        type={eye ? "text" : "password"}
                        value={data.confirmpassword}
                        placeholder="Confirm your Password"
                        toggleIcon={
                            <button
                                type="button"
                                onClick={() => setEye(!eye)}
                                aria-label="Toggle confirm password visibility"
                                className="focus:outline-none ml-2"
                            >
                                {eye ? <AiFillEyeInvisible className="text-gray-500" /> : <AiFillEye className="text-gray-500" />}
                            </button>
                        }
                        onChange={(e) => handleChange(e.target.value, "confirmpassword")}
                    />
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            checked={data.agreeToTerms}
                            onChange={(e) => handleChange(e.target.checked, "agreeToTerms")}
                            className="mr-2"
                        />
                        <label className="text-sm text-gray-500">I agree to the <span className="text-blue-500 hover:text-blue-800 cursor-pointer hover:underline underline-offset-1" onClick={()=>navigate("/terms")}>terms and conditions</span></label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 bg-slate-500 text-white font-medium rounded-lg hover:bg-slate-600 transition duration-200"
                    >
                        Proceed
                    </button>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <span className="h-px w-1/5 bg-gray-300"></span>
                    <span className="text-sm text-gray-500 mx-2">OR</span>
                    <span className="h-px w-1/5 bg-gray-300"></span>
                </div>
                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/loginCounsellor")}
                        className="text-blue-500 hover:underline hover:cursor-pointer font-medium"
                    >
                        Login As Counsellor
                    </span>
                </p>
            </div>
        </div>

    )
}

const InputField = ({ label, icon, type, value, placeholder, onChange, toggleIcon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            {icon}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full outline-none"
            />
            {toggleIcon}
        </div>
    </div>
);

export default RegisterCounsellor