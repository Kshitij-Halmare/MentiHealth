import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserProvider';
import toast from 'react-hot-toast';

function Profile() {
    const { user } = useContext(UserContext); // Get user from context
    const navigate = useNavigate();

    const [data, setData] = useState(null); // Store the fetched data
    const [isUserLoading, setIsUserLoading] = useState(true); // Track if user data is loading
    const [error, setError] = useState(''); // Track any errors that occur during the fetch

    // Check if user data is available and redirect to login if not
    useEffect(() => {
        if (!isUserLoading) {
            if (!user) {
                toast.error("Please Login to Continue");
                navigate("/login");
            }
        }
    }, [user, isUserLoading, navigate]);

    useEffect(() => {
        if (user) {
            setIsUserLoading(false); // User data is loaded, stop the loading state
        }
    }, [user]);

    // Fetch the counsellor's details
    useEffect(() => {
        const fetchDetails = async () => {
            setError(''); // Clear previous errors
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/getDetails/`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ _id: user._id, role: user.role })
                });
                const result = await response.json();
                if (response.ok) {
                    console.log(result.data);
                    setData(result.data); // Store the counsellor data
                } else {
                    setError('Failed to fetch counsellor details.');
                }
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
            }
        };

        if (user) {
            fetchDetails(); // Call fetchDetails when user is available
        }
    }, [user]);

    // Show loading state if user or data is still loading
    if (isUserLoading || !data) {
        return (
            <div className="flex justify-center items-center h-screen flex-col">
                <p className="mt-4 text-xl">Loading your profile...</p>
            </div>
        );
    }

    // Show error if something went wrong
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        );
    }
    const role = user.role;
    console.log(role);
    return (
        role == "User" ? (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-semibold text-center">Your Profile</h1>
                <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                    <div className="text-center">
                        {/* Avatar Section */}
                        <div className="mb-6">
                            <img
                                src={data.avatar || "https://via.placeholder.com/150"} // Placeholder if no avatar
                                alt="Avatar"
                                className="w-32 h-32 rounded-full mx-auto object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-bold">{data.name}</h2>
                        <p className="text-lg text-gray-500">{data.role}</p>
                    </div>
                    <div className="mt-6">
                        <p className="text-lg text-gray-700">Email: {data.email}</p>
                        <p className="text-lg text-gray-700">Account Verified: {data.isEmailVerified ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="mt-6">
                        <p className="text-lg text-gray-700">
                            Booked Sessions: {data.bookedSessions.length > 0 ? (
                                <ul className="list-disc pl-6">
                                    {data.bookedSessions.map((session, index) => (
                                        <div className="mt-4 bg-blue-100">
                                            <li key={index} className="text-gray-700">
                                                {session.date} {/* Display session details (modify based on the structure of sessions) */}
                                            </li>
                                            <li key={index} className="text-gray-700">
                                                {session.time} {/* Display session details (modify based on the structure of sessions) */}
                                            </li>
                                        </div>
                                    ))}
                                </ul>
                            ) : (
                                'No booked sessions'
                            )}
                        </p>
                    </div>
                    <div className="bg-white  shadow-md rounded-md my-6 p-4">
                        <h1 className="text-xl font-semibold underline underline-offset-4 text-center my-4">Blogs</h1>
                        {   
                            data.blogs.map((blog,i)=>{
                                return (
                                <>
                                <div className="flex bg-slate-50 p-2  items-start m-2 hover:shadow-md hover:scale-105">
                                    <img src={blog.banner} className="h-20 w-32"/>
                                    <h1 className="ml-4 text-lg font-semibold">{blog.title}</h1>
                                </div>
                                </>)
                            })
                        }
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-gradient-to-tr from-pink-100 via-white to-pink-100 h-full p-10">
                <div className="profile-container max-w-4xl mx-auto p-6 mb-6  bg-white shadow-lg rounded-lg">
                    <div className="profile-content py-6 flex flex-col lg:flex-row items-center gap-6">
                        {/* Profile Image and Info */}
                        <div className="basic-info flex flex-col items-center lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
                            {/* Profile Image */}
                            <img
                                src={data.image ? `data:image/jpeg;base64,${data.image}` : "/default-avatar.png"} // Fallback to default image if base64 is missing
                                alt="Counsellor"
                                className="profile-image w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary"
                            />
                            {/* Profile Name */}
                            <h2 className="text-3xl font-semibold text-gray-800 mb-2">{data.name}</h2>
                            {/* Profile Details */}
                            <p className="text-gray-600 mb-1"><strong>Email:</strong> {data.email}</p>
                            <p className="text-gray-600 mb-1"><strong>Phone:</strong> {data.phoneno}</p>
                            <p className="text-gray-600 mb-1"><strong>Bio:</strong> {data.bio}</p>
                            <p className="text-gray-600 mb-1"><strong>Experience:</strong> {data.experience} years</p>
                            <p className="text-gray-600 mb-1"><strong>Qualifications:</strong> {data.qualifications}</p>
                            <p className="text-gray-600 mb-1"><strong>License Number:</strong> {data.liscenceNumber}</p>
                            <p className="text-gray-600 mb-1"><strong>Price per session:</strong> ${data.price}</p>
                            <p className="text-gray-600 mb-4"><strong>Rating:</strong> {data.rating}</p>
                        </div>

                        {/* Specializations & Availability */}
                        <div className="details-info flex flex-col lg:w-2/3">
                            {/* Specializations */}
                            <div className="specializations mb-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Specializations</h3>
                                <ul className="list-disc pl-5 text-gray-600">
                                    {data.specializations.map((specialization, index) => (
                                        <li key={index} className="mb-2">{specialization}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Availability */}
                            <div className="availability mb-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Availability</h3>
                                {Object.keys(data.availability).map((day) => (
                                    <div key={day} className="availability-day mb-4">
                                        <h4 className="text-xl font-semibold text-gray-700 mb-2">{day}</h4>
                                        {data.availability[day].length > 0 ? (
                                            <ul className="list-disc pl-5 text-gray-600">
                                                {data.availability[day].map((slot, index) => (
                                                    <li key={index} className="mb-2">{slot.time} - {slot.isBooked ? "Booked" : "Available"}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No available slots for {day}.</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Reviews */}
                            <div className="reviews">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Reviews</h3>
                                {data.reviews.length > 0 ? (
                                    <ul className="list-disc pl-5 text-gray-600">
                                        {data.reviews.map((review, index) => (
                                            <li key={index} className="mb-4">
                                                <p><strong>{review.userId.name}</strong>: {review.comment}</p>
                                                <p>Rating: {review.rating}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No reviews available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white  shadow-md rounded-md my-6 p-4">
                        <h1 className="text-xl font-semibold underline underline-offset-4 text-center my-4">Blogs</h1>
                        {   
                            data.blogs.map((blog,i)=>{
                                return (
                                <>
                                <div className="flex bg-slate-50 p-2  items-start m-2 hover:shadow-md hover:scale-105">
                                    <img src={blog.banner} className="h-20 w-32"/>
                                    <h1 className="ml-4 text-lg font-semibold">{blog.title}</h1>
                                </div>
                                </>)
                            })
                        }
                    </div>
                </div>
            </div>
        )

    );
}

export default Profile;
