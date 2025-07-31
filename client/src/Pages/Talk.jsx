import React, { useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../Context/UserProvider.jsx';

function Talk() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // theme toggle
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    <div className={
      darkMode
        ? "bg-gradient-to-br from-red-900 via-red-800 to-black min-h-screen flex items-center justify-center py-8 px-2"
        : "bg-gradient-to-br from-pink-100 via-orange-50 to-pink-200 min-h-screen flex items-center justify-center py-8 px-2"
    }>
      <div className={
        "w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border " +
        (darkMode ? "bg-red-950 border-red-900" : "bg-white border-pink-200")
      }>
        {/* Chat Header */}
        <div className={
          "flex items-center gap-3 px-6 py-4 sticky top-0 z-10 shadow-md " +
          (darkMode
            ? "bg-gradient-to-r from-red-900 via-red-800 to-black text-white"
            : "bg-gradient-to-r from-pink-400 via-pink-500 to-orange-300 text-white")
        }>
          <div className={
            "w-10 h-10 rounded-full flex items-center justify-center text-2xl " +
            (darkMode ? "bg-white/20" : "bg-white/30")
          }>💬</div>
          <h1 className="text-xl font-bold tracking-wide drop-shadow flex-1">Open Heart Chat</h1>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={
              "rounded-full px-3 py-1 text-xs font-semibold border transition " +
              (darkMode
                ? "bg-red-900 border-red-700 text-white hover:bg-red-800"
                : "bg-white border-pink-300 text-pink-600 hover:bg-pink-100")
            }
            title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        {/* Messages Area */}
        <div className={
          "flex-1 overflow-y-auto px-4 py-6 space-y-4 " +
          (darkMode ? "bg-gradient-to-b from-red-950 to-black" : "bg-gradient-to-b from-white to-pink-50")
        }>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-[80%]`}>
                {msg.sender !== 'user' && (
                  <div className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-lg shadow " +
                    (darkMode ? "bg-red-800 text-white" : "bg-pink-200")
                  }>
                    🤖
                  </div>
                )}
                <div
                  className={
                    "p-4 rounded-2xl text-base shadow transition-all " +
                    (msg.sender === 'user'
                      ? (darkMode
                        ? "bg-gradient-to-br from-red-700 to-red-900 text-white rounded-br-none"
                        : "bg-gradient-to-br from-pink-400 to-orange-300 text-white rounded-br-none")
                      : (darkMode
                        ? "bg-red-900 text-white rounded-bl-none border border-red-800"
                        : "bg-pink-100 text-pink-900 rounded-bl-none border border-pink-200")
                    )
                  }
                >
                  <span className="block font-semibold text-xs mb-1 opacity-70">
                    {msg.sender === 'user' ? 'You' : 'Best Friend'}
                  </span>
                  <span>{msg.text}</span>
                </div>
                {msg.sender === 'user' && (
                  <div className={
                    "w-8 h-8 rounded-full flex items-center justify-center text-lg shadow " +
                    (darkMode ? "bg-red-800 text-white" : "bg-orange-200")
                  }>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill={darkMode ? "#991b1b" : "#fb7185"} />
                      <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff" fontFamily="Arial" dy="0">U</text>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className={
                  "w-8 h-8 rounded-full flex items-center justify-center text-lg shadow " +
                  (darkMode ? "bg-red-800 text-white" : "bg-pink-200")
                }>
                  🤖
                </div>
                <div className={
                  "p-4 rounded-2xl rounded-bl-none shadow " +
                  (darkMode
                    ? "bg-red-900 text-white border border-red-800"
                    : "bg-pink-100 text-pink-900 border border-pink-200")
                }>
                  <span className="block font-semibold text-xs mb-1 opacity-70">Best Friend</span>
                  <span className="italic opacity-70">...typing</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSubmit}
          className={
            "flex items-center gap-3 px-4 py-4 border-t sticky bottom-0 " +
            (darkMode
              ? "bg-red-950 border-red-900"
              : "bg-white border-pink-200")
          }
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className={
              "flex-1 p-3 rounded-xl border transition " +
              (darkMode
                ? "border-red-800 bg-red-900 text-white focus:ring-2 focus:ring-red-400"
                : "border-pink-200 bg-pink-50 text-pink-900 focus:ring-2 focus:ring-pink-300")
            }
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            className={
              "px-6 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed " +
              (darkMode
                ? "bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950"
                : "bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400")
            }
            disabled={loading || input.trim() === ""}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Talk;
