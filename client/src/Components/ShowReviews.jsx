import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserProvider';

function ShowReviews() {
  const { reviews, setReviews } = useContext(UserContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/review/getWebsiteReview`, {
          method: 'GET',
        });
        const resData = await response.json();
        if (resData.success) {
          console.log(resData.data);
          setReviews(resData.data); // Set reviews data in the state
        } else {
          console.error('Error fetching reviews:', resData.message);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();

    // Auto-slide reviews every 3 seconds
    let autoSlide;
    if (reviews && reviews.length > 0) {
      autoSlide = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 3000);
    }

    return () => clearInterval(autoSlide); // Clean up interval on unmount
  }, [ setReviews]); // Depend on reviews

  const nextReview = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }
  };

  const prevReview = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    }
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-center text-gray-500">No reviews available.</p>;
  }

  const review = reviews[currentIndex];

  return (
    <div className="md:mx-24 mx-4 my-16">
      <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">Customer Reviews</h1>

      <div className="flex justify-center items-center space-x-4 mb-6">
        {/* Previous button */}
        <button
          onClick={prevReview}
          className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
        >
          &#8592;
        </button>

        {/* Single review card */}
        <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-full">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-800">{review?.userId?.name || 'Anonymous'}</span>
          </div>

          <p className="mt-4 text-gray-600">{review?.comment || 'No comment provided.'}</p>

          <div className="mt-4 text-sm text-gray-500">
            <span>{review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}</span>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={nextReview}
          className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}

export default ShowReviews;
