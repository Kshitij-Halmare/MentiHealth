import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserProvider';
import { toast } from 'react-hot-toast'; // Assuming you're using react-toastify for notifications

function CancelPage() {
  const { book, setBook } = useContext(UserContext); // Assuming book and setBook are provided by context
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const cancelBooking = async () => {
      if (!book) {
        setStatus("error");
        setErrorMessage("No booking data found.");
        return;
      }

      setStatus("loading"); // Start loading state

      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/cancelSlot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book: book.newBooking }), // Send the newBooking data from localStorage
        });

        const resData = await response.json();

        if (resData.success) {
          setStatus("success");
          setBook(null); // Optionally clear the booking data from context or localStorage
          toast("Booking Cancelled", { type: "success" });
        } else {
          setStatus("error");
          setErrorMessage(resData.message || "Something went wrong.");
          toast(resData.message, { type: "error" });
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage("Error canceling booking: " + error.message);
        toast("Error canceling booking", { type: "error" });
      }
    };

    cancelBooking();
  }, [book, setBook]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {status === "loading" && (
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-gray-700">
          <h1 className="text-2xl font-semibold">Canceling your booking...</h1>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-100 p-6 rounded-lg shadow-lg text-green-700">
          <h1 className="text-2xl font-semibold mb-2">Your booking has been successfully cancelled.</h1>
          <p className="text-lg">We’ve canceled your slot. You will receive a confirmation shortly.</p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-100 p-6 rounded-lg shadow-lg text-red-700">
          <h1 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h1>
          <p className="text-lg">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

export default CancelPage;
