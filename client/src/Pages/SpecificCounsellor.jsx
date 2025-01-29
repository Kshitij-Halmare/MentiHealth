import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function SpecificCounsellor() {
    const { id } = useParams(); // Extract the counsellor ID from the URL
    const navigate = useNavigate();
    const [counsellor, setCounsellor] = useState(null); // State to store the specific counsellor's details
    const [loading, setLoading] = useState(true); // State for loading indicator

    const fetchCounsellorData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/specificCounsellor/${id}`,
                { method: 'GET' }
            );
            const data = await response.json();

            if (data.success) {
                setCounsellor(data.user); // Update state with fetched counsellor data
                toast.success(data.message || 'Counsellor data fetched successfully');
            } else {
                toast.error(data.message || 'Failed to fetch counsellor data');
                navigate('/'); // Redirect if counsellor not found
            }
        } catch (error) {
            toast.error('An error occurred while fetching counsellor details');
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    useEffect(() => {
        fetchCounsellorData();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-8">Loading counsellor details...</div>;
    }

    if (!counsellor) {
        return <div className="text-center mt-8 text-gray-500">Counsellor not found.</div>;
    }

    return (
        <div className="bg-gradient-to-t from-pink-100 via-slate-100 to-pink-100">
            <div className="container mx-auto p-4">
                <div className="bg-white drop-shadow-lg rounded-lg overflow-hidden relative border">
                    {counsellor.image && (
                        <div className="relative w-full h-72 overflow-hidden">
                            <img
                                src={`data:image/png;base64,${counsellor.image}`}
                                alt={counsellor.name}
                                className="absolute inset-0 w-full h-full object-cover blur-md"
                            />
                            <img
                                src={`data:image/png;base64,${counsellor.image}`}
                                alt={counsellor.name}
                                className="relative mx-auto h-64 object-cover rounded-lg shadow-md border-4 border-white"
                                style={{ maxWidth: "200px", marginTop: "20px" }}
                            />
                        </div>
                    )}
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
                            {counsellor.name}
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 mb-2">
                                    <span className="font-semibold text-gray-700">Email:</span> {counsellor.email}
                                </p>
                                <p className="text-gray-500 mb-2">
                                    <span className="font-semibold text-gray-700">Phone:</span> {counsellor.phoneno}
                                </p>
                                <p className="text-gray-500 mb-2">
                                    <span className="font-semibold text-gray-700">Qualifications:</span> {counsellor.qualifications}
                                </p>
                                <p className="text-gray-500 mb-2">
                                    <span className="font-semibold text-gray-700">License Number:</span> {counsellor.liscenceNumber}
                                </p>
                                <p className="text-gray-500 mb-2">
                                    <span className="font-semibold text-gray-700">Experience:</span> {counsellor.experience} years
                                </p>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Bio:</h2>
                                <p className="text-gray-600">{counsellor.bio}</p>
                            </div>
                        </div>
                        {counsellor.specializations && counsellor.specializations.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Specializations:</h2>
                                <ul className="list-disc list-inside text-gray-600">
                                    {counsellor.specializations.map((special, index) => (
                                        <li key={index}>{special}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {counsellor.availability && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Availability:</h2>
                                <ul className="text-gray-600">
                                    {Object.entries(counsellor.availability).map(([day, slots]) => (
                                        <li key={day} className="flex items-start">
                                            <span className="font-medium">{day}:</span>
                                            <span className="ml-2">
                                                {slots.map((slot, index) => (
                                                    <span key={index}>
                                                        {slot.time} {slot.isBooked ? '(Booked)' : '(Available)'}
                                                        {index < slots.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className='w-full text-center'>
                            <button onClick={() => navigate(`/availableSlots/${id}`)} className='m-auto bg-slate-600 text-xl hover:bg-slate-800 text-white p-2 text-center rounded-sm mt-5 font-serif'>Book Slot</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecificCounsellor;
