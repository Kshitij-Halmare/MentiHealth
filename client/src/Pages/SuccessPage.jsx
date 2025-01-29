import React, { useEffect, useState } from 'react';

function SuccessPage() {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const resetSetBook = async () => {
      // Retrieve the booking data from localStorage (if any)
      const book = localStorage.getItem("booking");

      // Check if the booking exists
      if (book) {
        // Parse the JSON data (if it's a valid JSON string)
        const bookingData = JSON.parse(book);

        console.log("Booking Data:", bookingData); // Log the parsed data before sending

        // Send the booking data to the backend for confirmation
        try {
          const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/counsellor/CallsendConfirmationEmail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ book: bookingData }), // Send the data as JSON
          });

          const resData = await response.json();
          if (resData.success) {
            setStatus("success");
            console.log("Confirmation Email Sent");
          } else {
            setStatus("error");
            setErrorMessage(resData.message || "Something went wrong.");
          }
        } catch (error) {
          setStatus("error");
          setErrorMessage("Error sending email: " + error.message);
        }

        // Optionally clear the booking data from localStorage after processing
        localStorage.removeItem("booking");
      } else {
        setStatus("error");
        setErrorMessage("No booking data found in localStorage.");
      }
    };

    resetSetBook();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {status === "loading" && (
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-gray-700">
          <h1 className="text-2xl font-semibold">Processing your booking...</h1>
        </div>
      )}
      
      {status === "success" && (
        <div className="bg-green-100 p-6 rounded-lg shadow-lg text-green-700">
          <h1 className="text-2xl font-semibold mb-2">Success! Your booking is confirmed.</h1>
          <p className="text-lg">A confirmation email has been sent to you.</p>
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

export default SuccessPage;
