import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserProvider';

function Counsellors() {
    const [counsellors, setCounsellors] = useState([]); // State to store counsellor data
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const [isUserLoading, setIsUserLoading] = useState(true); // State to track user data loading
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Access the user context

    // Check if user is logged in and redirect if not
    useEffect(() => {
        // Wait until the user data is loaded before redirecting
        if (!isUserLoading) {
            if (!user) {
                toast.error("Please Login to Continue");
                navigate("/login");
            }
        }
    }, [user, isUserLoading, navigate]); // Add `isUserLoading` to prevent redirect before user data is ready

    // Fetch user data (simulating user context loading)
    useEffect(() => {
        if (user) {
            setIsUserLoading(false); // User data is loaded, stop the loading state
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setIsLoading(true); // Set loading state to true when fetching data
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/getCounsellor`, {
                method: "GET",
            });
            const data = await response.json();

            if (data.success) {
                setCounsellors(data.user); // Update state with fetched data
                toast.success(data.message || "Data fetched successfully");
            } else {
                toast.error(data.message || "Failed to fetch data");
            }
        } catch (error) {
            toast.error("An error occurred while fetching counsellors");
            console.error("Fetch Error:", error);
        } finally {
            setIsLoading(false); // Set loading state to false once the data is fetched
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means it runs once when the component mounts

    return (
        <div className="mx-auto p-3 pb-3 bg-gradient-to-t from-pink-100 via-slate-100 to-pink-100 min-h-screen">
            <h1 className="text-4xl font-serif font-bold mb-8 mt-8 text-center text-slate-800">Meet Our Counsellors</h1>
            {isLoading ? (
                // Loading spinner or placeholder
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-16 w-16 border-t-4 border-blue-600 rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-12">
                    {counsellors.length > 0 ? (
                        counsellors.map((counsellor) => (
                            <div
                                key={counsellor._id}
                                onClick={() => navigate(`/specificCounsellor/${counsellor._id}`)}
                                className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                            >
                                {counsellor.image ? (
                                    <img
                                        src={`data:image/png;base64,${counsellor.image}`}
                                        alt={counsellor.name}
                                        className="w-full h-56 object-cover rounded-t-lg"
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-slate-200 flex items-center justify-center rounded-t-lg">
                                        <span className="text-slate-400 text-xl">No Image</span>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold text-slate-800 text-center">{counsellor.name}</h2>
                                    {counsellor.specializations && counsellor.specializations.length > 0 && (
                                        <ul className="list-disc list-inside mt-2 text-slate-600">
                                            {counsellor.specializations.map((special, index) => (
                                                <li key={index} className="text-sm">{special}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <p className="text-slate-600 mt-4 line-clamp-3 text-sm">
                                        {counsellor.bio}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center col-span-full">No counsellors found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Counsellors;
