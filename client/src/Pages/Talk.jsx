import React, { useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../Context/UserProvider.jsx';

function Talk() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true); // State to track user data loading
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

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      toast("Enter Something to talk");
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (!user || !user._id) {
        toast.error("User ID is missing");
        navigate("/login");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/talk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: input, userId: user._id }),
      });

      const resData = await response.json();

      if (resData.message) {
        const botMessage = { sender: 'chatgpt', text: resData.message };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        toast('Failed to get a response from the bot');
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      toast('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-gray-800 shadow-lg rounded-lg p-8 space-y-8">
        <div className="text-center text-white text-3xl font-semibold mb-6">
          <h1>Chat with Your Best Friend</h1>
        </div>

        {/* Messages Area */}
        <div className="h-[60vh] overflow-y-auto space-y-6 mb-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs p-4 rounded-xl text-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white shadow-xl' : 'bg-gray-600 text-gray-200 shadow-md'}`}
              >
                <span className="font-semibold text-lg">{msg.sender === 'user' ? 'You' : 'Best Friend'}:</span>
                <p className="mt-2">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="p-4 bg-gray-600 text-gray-200 max-w-xs rounded-lg text-lg">
                <span className="font-semibold text-lg">Best Friend:</span>
                <p>...typing</p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-6">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-4 text-lg bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-4 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition duration-300 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Talk;
