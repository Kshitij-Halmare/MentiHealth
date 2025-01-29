import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserProvider';
import { FaHeart, FaRegComment, FaStar, FaCalendarAlt } from 'react-icons/fa'; // Importing icons
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

function ScoreCard() {
  const { user } = useContext(UserContext);
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      const getScore = async () => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getScore`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        });

        const resData = await response.json();
        console.log("Received Data:", resData);

        if (resData && resData.data && resData.data.length > 0) {
          // Setting the received data for display
          setScoreData(resData.data);
        } else {
          console.error("No data available for rendering.");
        }
      };
      getScore();
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Your Mental Health Insights</h2>

      {scoreData && scoreData.length > 0 ? (
        scoreData.map((item, index) => {
          // Determine the score level and apply conditional styling
          const score = item.mentalHealthScore;
          let scoreStyle = "bg-white"; // Default style
          let scoreMessage = "";
          let actionMessage = "";
          let actionLink = "";

          if (score < 30) {
            scoreStyle = "bg-red-100 border-red-500"; // Red background for low scores
            scoreMessage = "Warning: Your mental health score is low.";
            actionMessage = "It's important to seek support right away.";
            actionLink = "/counseling"; // Link to book a counseling session
          } else if (score < 60) {
            scoreStyle = "bg-yellow-100 border-yellow-500"; // Yellow background for average scores
            scoreMessage = "Your mental health is average. Keep monitoring.";
            actionMessage = "Consider talking to a professional if needed.";
            actionLink = "/counseling"; // Link to book a counseling session
          } else {
            scoreStyle = "bg-green-100 border-green-500"; // Green background for high scores
            scoreMessage = "Great job! Your mental health score is good.";
            actionMessage = "Keep up the great work!";
            actionLink = ""; // No action link needed for high scores
          }

          return (
            <div key={index} className={`shadow-lg rounded-lg p-8 my-8 transform hover:scale-105 transition duration-300 ${scoreStyle} border-l-4`}>
              {/* Card Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </h3>
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-2" />
                  <span className="text-xl font-semibold text-green-600">
                    {item.mentalHealthScore}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">(Out of 100)</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Mental Health History:</h4>
                <p className="text-gray-600 text-lg leading-relaxed">{item.mentalHealthInsights}</p>
              </div>

              {/* Display Score Message */}
              {scoreMessage && (
                <div className="bg-yellow-100 p-4 rounded-lg text-center text-gray-700 font-semibold mb-6">
                  {scoreMessage}
                </div>
              )}

              {/* Action Message */}
              {actionMessage && (
                <div className="bg-blue-100 p-4 rounded-lg text-center text-gray-700 font-semibold mb-6">
                  {actionMessage}
                </div>
              )}

              {/* Action Link - Book a session if low or average score */}
              {actionLink && (
                <div className="text-center mt-4">
                  <Link
                    to={actionLink}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Book a Counseling Session
                  </Link>
                </div>
              )}

              {/* Card Footer: Cumulative Score & Interaction Count */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FaHeart className="mr-2 text-red-500" />
                  <strong>Cumulative Score:</strong> {item.cumulativeScore}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaRegComment className="mr-2 text-blue-500" />
                  <strong>Interactions:</strong> {item.interactionCount}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No data available.</p>
      )}
    </div>
  );
}

export default ScoreCard;
