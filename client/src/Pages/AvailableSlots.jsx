import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../Context/UserProvider';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

function AvailableSlots() {
  const [availability, setAvailability] = useState([]); // Store availability slots
  const [selectedSlot, setSelectedSlot] = useState(null); // Store selected slot
  const [error, setError] = useState(''); // Store error message
  const [loading, setLoading] = useState(false); // Store loading state for fetching availability
  const [bookingLoading, setBookingLoading] = useState(false); // Store loading state for booking slot
  const { id } = useParams(); // Get counsellorId from URL
  const { user, setBook } = useContext(UserContext); // Get user and setBook from context
  const navigate = useNavigate();

  // Get next day's date
  const getDateOfNextDay = (currentDate) => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    return nextDay;
  };

  const [isUserLoading, setIsUserLoading] = useState(true); // State to track user data loading

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

  useEffect(() => {
    // Load the booking from localStorage if available
    const savedBooking = localStorage.getItem('booking');
    if (savedBooking) {
      setBook(JSON.parse(savedBooking)); // Set the book state from localStorage
    }

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/availableSlots/${id}`, {
          method: 'GET',
        });
        const data = await response.json();

        if (response.ok && data.availableslots) {
          const { availability } = data.availableslots;

          if (availability && typeof availability === 'object') {
            const slotsArray = Object.entries(availability).flatMap(([day, slots]) =>
              slots.map((slot) => ({ day, slot })));
            setAvailability(slotsArray);
          } else {
            setError('No availability slots found.');
          }
        } else {
          setError(data.message || 'No availability slots found.');
        }
      } catch (err) {
        setError('Failed to fetch availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [id, user, setBook]); // Depend on both id and user to fetch data

  const handleSlotSelect = (slot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) {
      toast('Please select a slot to book.');
      return;
    }
    if (!user) {
      toast('You need to log in to book a slot.');
      return;
    }
    setBookingLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/bookSlot`, {
        method: 'POST',
        body: JSON.stringify({
          counsellorId: id,
          day: selectedSlot.day,
          time: selectedSlot.time,
          userId: user._id, // Use userId from context
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data.booking);
      if (response.ok) {
        // Save the booking to localStorage
        const bookingData = data.booking
        console.log(bookingData);
        localStorage.setItem('booking', JSON.stringify(bookingData)); // Save booking to localStorage

        // Optionally update context state with the booking details
        setBook(bookingData);

        setError('');
        handlePayment();
      } else {
        setSelectedSlot(null);
        toast.error(data.message || 'Booking failed.');
      }
    } catch (err) {
      setError('Failed to book the slot.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = async () => {
    const stripePromise = loadStripe(import.meta.env.VITE_SERVER_PUBLIC_KEY);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/checkout-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            counsellorId: id,
            day: selectedSlot.day,
            time: selectedSlot.time,
            userId: user._id, // Ensure you're sending userId from the context
          }
        }),
      });

      if (!res.ok) {
        toast.error("Failed to initiate payment.");
        return;
      }

      const resData = await res.json();
      toast.success("Redirecting to Payment Gateway...");
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId: resData.id });
    } catch (err) {
      console.error("Error during payment:", err);
      toast.error("Something went wrong during payment.");
    }
  };

  return (
    <div className="bg-pink-50 w-full">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Counsellor Availability</h1>

        {/* Display error if there's any */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* If user is not logged in */}
        {!user && !loading && (
          <div className="text-center text-gray-500 mb-4">
            Please log in to view and book available slots.
          </div>
        )}

        {/* Loading and availability check */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : availability.length === 0 ? (
          <p className="text-center text-lg text-slate-600">No availability found for this counselor.</p>
        ) : (
          Object.entries(
            availability.reduce((grouped, { day, slot }) => {
              grouped[day] = grouped[day] || [];
              grouped[day].push(slot);
              return grouped;
            }, {})
          ).map(([day, slots]) => (
            <div key={day} className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                {day} ({getDateOfNextDay(new Date()).toLocaleDateString()})
              </h3>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {slots.length === 0 ? (
                  <p className="text-center text-gray-500">No slots available</p>
                ) : (
                  slots.map((slot, index) => {
                    const slotTime = slot.time;
                    const isSelected = selectedSlot && selectedSlot._id === slot._id;
                    const isBooked = slot.isBooked;

                    return (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect({ ...slot, day })}
                        disabled={isBooked}
                        className={`p-3 rounded-md transition-all duration-200 text-sm font-medium  
                          ${isBooked ? 'bg-red-500 text-white' : isSelected ? 'bg-pink-600 text-white' : 'bg-pink-100 hover:bg-pink-200'} 
                          ${isSelected ? 'scale-105' : ''}`}
                      >
                        {slotTime}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}

        {/* Book Slot button */}
        <div className="mt-4 text-center">
          <button
            className={`p-2 bg-slate-700 hover:bg-slate-900 rounded-md hover:p-5 font-semibold text-white cursor-pointer transition-all duration-200 ${bookingLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={handleBookSlot}
            disabled={bookingLoading || !selectedSlot}
          >
            {bookingLoading ? 'Booking...' : 'Book Slot'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailableSlots;
