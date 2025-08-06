import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { UserContext } from '../Context/UserProvider';

function Review() {
  // Corrected useState for review
  const [review, setReview] = useState(""); 
  const { user } = useContext(UserContext);
  console.log(user);
  const {reviews,setReviews}=useContext(UserContext);
  const addReview = async () => {
    if (!user) {
      toast.error("Please Login to Write Your Review");
      return;
    }
    if (review.length === 0) {
      toast.error("Write Something into Review");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/review/addReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, review }), // Sending review data
      });
  
      const resData = await response.json();
      if (resData.success) {
        toast.success("Review Added Successfully");
  
        // Create the new review object
        const newReview = {
          comment: review, // The text of the review
          userId: user._id, // ID of the user who added the review
          user: {
            name: user.email
          }, // Optional: Include user's name if available
          type: "Website", // Example type, adjust as needed
          createdAt: new Date().toISOString(), // Current timestamp
          _id: resData.reviewId, // Assuming your backend returns the new review ID
        };
  
        // Update the state with the new review
        setReviews((prev) => [ newReview,...prev]);
        setReview(""); // Clear the input field
      } else {
        toast.error(`Error Occurred: ${resData.message}`);
        console.log(resData.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.log(err);
    }
  };
  

  return (
    <div className="md:mx-24 mx-4 my-12 shadow-lg hover:drop-shadow-xl rounded-lg bg-white text-black p-6 md:p-8 ">
      <h1 className="md:text-3xl text-center font-semibold text-gray-800 mb-6">Give Your Review On Open Heart</h1>

      <div className="flex justify-center md:mx-32 mx-4 my-6">
        <textarea
          onChange={(e) => setReview(e.target.value)} // Handling review input
          value={review}
          className="w-full bg-pink-50 hover:bg-pink-100 focus:ring-2 focus:ring-pink-400 focus:outline-none drop-shadow-lg h-40 rounded-lg p-4 scroll-smooth overflow-hidden transition-all duration-200 hover:shadow-xl"
          placeholder="Please Give Your Review"
        ></textarea>
      </div>

      <div className="w-full flex justify-center">
        <button
          onClick={addReview} // Trigger the addReview function
          className="bg-slate-900 text-white px-6 py-2 rounded-md hover:scale-105 hover:bg-slate-700 transition-all duration-300 hover:shadow-lg"
        >
          Add Review
        </button>
      </div>
    </div>
  );
}

export default Review;
