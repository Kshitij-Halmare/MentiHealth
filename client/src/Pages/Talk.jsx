import React, { useContext, useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Moon, Sun } from 'lucide-react';

function Talk() {
  // Simulated context and hooks for demo
  const user = { _id: 'demo-user' };
  const [messages, setMessages] = useState([
    { sender: 'chatgpt', text: 'Hi there! I\'m here to listen and support you. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. That sounds really challenging.",
        "Thank you for sharing that with me. Your feelings are completely valid.",
        "It takes courage to open up about these things. I'm proud of you.",
        "I'm here for you. Would you like to talk more about what's on your mind?",
        "That's a really thoughtful perspective. How are you processing all of this?"
      ];
      const botMessage = { 
        sender: 'chatgpt', 
        text: responses[Math.floor(Math.random() * responses.length)]
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setLoading(false);
    }, 1500);
  };

  const TypingIndicator = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-pink-500' : 'bg-purple-400'
        }`}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl backdrop-blur-xl border overflow-hidden transition-all duration-500 ${
          darkMode 
            ? 'bg-slate-800/80 border-slate-700/50' 
            : 'bg-white/90 border-white/20'
        }`}>
          
          {/* Header */}
          <div className={`relative p-6 border-b backdrop-blur-sm ${
            darkMode 
              ? 'bg-slate-800/90 border-slate-700/50' 
              : 'bg-white/80 border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`relative p-3 rounded-2xl ${
                  darkMode ? 'bg-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    OpenHeart
                  </h1>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your compassionate companion
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(85vh-140px)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`flex items-end space-x-3 max-w-[80%] ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                    msg.sender === 'user'
                      ? (darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-purple-600')
                      : (darkMode ? 'bg-slate-700' : 'bg-gray-100')
                  }`}>
                    {msg.sender === 'user' ? (
                      <span className="text-white font-bold text-sm">U</span>
                    ) : (
                      <Heart className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative px-6 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                    msg.sender === 'user'
                      ? (darkMode 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white')
                      : (darkMode 
                          ? 'bg-slate-700 text-gray-100 border border-slate-600' 
                          : 'bg-white text-gray-800 border border-gray-200')
                  } ${
                    msg.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                  }`}>
                    <div className={`text-xs font-medium mb-2 opacity-70 ${
                      msg.sender === 'user' ? 'text-white' : (darkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {msg.sender === 'user' ? 'You' : 'OpenHeart'}
                    </div>
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-end space-x-3 max-w-[80%]">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    darkMode ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    <Heart className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div className={`px-6 py-4 rounded-2xl rounded-bl-md shadow-lg ${
                    darkMode ? 'bg-slate-700 text-gray-400' : 'bg-white text-gray-500 border border-gray-200'
                  }`}>
                    <div className="text-xs font-medium mb-2 opacity-70">OpenHeart</div>
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-6 border-t backdrop-blur-sm ${
            darkMode 
              ? 'bg-slate-800/90 border-slate-700/50' 
              : 'bg-white/80 border-gray-200/50'
          }`}>
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Share what's on your mind..."
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 resize-none focus:outline-none focus:ring-0 ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-purple-400'
                  }`}
                  rows="1"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || input.trim() === ""}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white shadow-lg hover:shadow-xl`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Talk;