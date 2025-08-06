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

  // Get formatted date for display
  const getFormattedDate = (dayName) => {
    const today = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayIndex = today.getDay();
    const targetIndex = days.findIndex(day => day.toLowerCase() === dayName.toLowerCase());
    
    let daysToAdd = targetIndex - todayIndex;
    if (daysToAdd <= 0) daysToAdd += 7; // If day has passed or is today, get next week
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    
    return targetDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please Login to Continue");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Fetch availability slots
  useEffect(() => {
    if (!user || !id) return;

    // Load existing booking from localStorage
    const savedBooking = localStorage.getItem('booking');
    if (savedBooking) {
      try {
        setBook(JSON.parse(savedBooking));
      } catch (err) {
        console.error('Error parsing saved booking:', err);
        localStorage.removeItem('booking'); // Remove corrupted data
      }
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/availableSlots/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && data.availableslots) {
          const { availability } = data.availableslots;

          if (availability && typeof availability === 'object') {
            // Convert object to array format with proper structure
            const slotsArray = Object.entries(availability).flatMap(([day, slots]) => {
              if (Array.isArray(slots)) {
                return slots.map((slot) => ({
                  ...slot,
                  day: day,
                  displayTime: slot.time || slot.slot, // Handle different time field names
                }));
              }
              return [];
            });
            
            console.log('Processed slots:', slotsArray);
            setAvailability(slotsArray);
          } else {
            setError('No availability slots found.');
            setAvailability([]);
          }
        } else {
          setError(data.message || 'Failed to fetch availability slots.');
          setAvailability([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch availability. Please try again.');
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [id, user, setBook]);

  const handleSlotSelect = (slot) => {
    console.log('Selected slot:', slot);
    if (!slot.isBooked) {
      setSelectedSlot(slot);
      setError(''); // Clear any previous errors
    } else {
      toast.error('This slot is already booked');
    }
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) {
      toast.error('Please select a slot to book.');
      return;
    }
    
    if (!user || !user._id) {
      toast.error('You need to log in to book a slot.');
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const bookingData = {
        counsellorId: id,
        day: selectedSlot.day,
        time: selectedSlot.displayTime || selectedSlot.time,
        userId: user._id,
        slotId: selectedSlot._id || selectedSlot.id, // Include slot ID if available
      };

      console.log('Booking data:', bookingData);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/bookSlot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();
      console.log('Booking response:', data);

      if (response.ok && data.success) {
        // Save booking to localStorage
        const bookingInfo = data.booking || data.data;
        localStorage.setItem('booking', JSON.stringify(bookingInfo));
        setBook(bookingInfo);

        toast.success('Slot booked successfully!');
        
        // Update the availability to reflect the booked slot
        setAvailability(prev => prev.map(slot => 
          slot._id === selectedSlot._id 
            ? { ...slot, isBooked: true }
            : slot
        ));
        
        setSelectedSlot(null);
        
        // Proceed to payment
        await handlePayment(bookingData);
      } else {
        toast.error(data.message || 'Booking failed. Please try again.');
        setError(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Failed to book the slot. Please try again.');
      setError('Network error. Please check your connection.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = async (bookingData = null) => {
    const paymentData = bookingData || {
      counsellorId: id,
      day: selectedSlot?.day,
      time: selectedSlot?.displayTime || selectedSlot?.time,
      userId: user._id,
    };

    try {
      toast.loading('Preparing payment...');
      
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/checkout-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: paymentData }),
        }
      );

      if (!response.ok) {
        throw new Error(`Payment preparation failed: ${response.status}`);
      }

      const resData = await response.json();
      
      if (!resData.id && !resData.sessionId) {
        throw new Error('Invalid payment session response');
      }

      toast.dismiss();
      toast.success("Redirecting to Payment Gateway...");
      
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_SERVER_PUBLIC_KEY);
      const stripe = await stripePromise;
      
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: resData.id || resData.sessionId 
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.dismiss();
      toast.error(err.message || "Payment failed. Please try again.");
    }
  };

  // Group slots by day for display
  const groupedSlots = availability.reduce((grouped, slot) => {
    const day = slot.day;
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(slot);
    return grouped;
  }, {});

  if (!user) {
    return (
      <div className="bg-pink-50 w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Please Login</h2>
          <p className="text-slate-600">You need to log in to view available slots.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pink-50 w-full min-h-screen">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">
          Counsellor Availability
        </h1>

        {/* Display error if there's any */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
            <p className="mt-2 text-slate-600">Loading available slots...</p>
          </div>
        ) : availability.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-slate-600">No availability found for this counselor.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Display selected slot info */}
            {selectedSlot && (
              <div className="bg-pink-100 border border-pink-300 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-800">Selected Slot:</h3>
                <p className="text-slate-700">
                  {selectedSlot.day} at {selectedSlot.displayTime || selectedSlot.time}
                </p>
              </div>
            )}

            {/* Display slots grouped by day */}
            {Object.entries(groupedSlots).map(([day, slots]) => (
              <div key={day} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                  {day.charAt(0).toUpperCase() + day.slice(1)} 
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    ({getFormattedDate(day)})
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {slots.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 py-4">
                      No slots available for this day
                    </p>
                  ) : (
                    slots.map((slot, index) => {
                      const slotTime = slot.displayTime || slot.time;
                      const isSelected = selectedSlot && (
                        (selectedSlot._id && selectedSlot._id === slot._id) ||
                        (selectedSlot.day === slot.day && selectedSlot.displayTime === slotTime)
                      );
                      const isBooked = slot.isBooked;

                      return (
                        <button
                          key={slot._id || `${day}-${index}`}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={isBooked}
                          className={`p-3 rounded-lg transition-all duration-200 text-sm font-medium border-2
                            ${isBooked 
                              ? 'bg-red-500 text-white border-red-500 cursor-not-allowed opacity-75' 
                              : isSelected 
                                ? 'bg-pink-600 text-white border-pink-600 scale-105 shadow-lg' 
                                : 'bg-white hover:bg-pink-50 border-pink-200 hover:border-pink-400 text-slate-700'
                            }`}
                        >
                          {slotTime}
                          {isBooked && (
                            <div className="text-xs mt-1">Booked</div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}

            {/* Book Slot button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleBookSlot}
                disabled={bookingLoading || !selectedSlot}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                  bookingLoading || !selectedSlot
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-800 hover:scale-105 shadow-lg'
                }`}
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </span>
                ) : (
                  'Book Selected Slot'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AvailableSlots;