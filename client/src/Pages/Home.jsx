import React, { useState } from "react";
import HeroImage from "../assets/66da1bb069f60f688362e6f3_Hero image.jpg";
import FeatureImage from "../assets/360_F_958179204_ocMkZvYl7JYeiF2ArGIVE6EBM9utXuub.jpg";
import FeatureImage2 from "../assets/360_F_537091655_jwSo40IblKORsgVABfmrXFNrSTVBLV94.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Review from "../Components/Review";
import ShowReviews from "../Components/ShowReviews";
import Score_graph from "../Components/Score_graph";

// Card Component
function Card({ index, isHovered, handleMouseEnter, handleMouseLeave, title, desc, icon }) {
  return (
    <motion.div
      key={index}
      className={`bg-pink-100 p-6 rounded-lg shadow-lg transition duration-200 cursor-pointer transform ${isHovered === index ? "scale-105 shadow-xl" : "hover:scale-105 hover:shadow-lg"
        }`}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
      layout
    >
      <motion.h3 className="text-2xl font-semibold text-emerald-700 flex items-center">
        <span className="mr-3 text-4xl">{icon}</span>
        {title}
      </motion.h3>
      <motion.p className="text-gray-600 mt-2">{desc}</motion.p>

      {isHovered === index && (
        <motion.div
          className="mt-4 bg-white p-4 rounded-lg shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p className="text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim. Nulla facilisi.
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}

function Home() {
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (index) => {
    setIsHovered(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-50 via-white to-pink-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <div className="relative py-20 bg-cover h-[580px] bg-center" style={{ backgroundImage: `url(${HeroImage})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Darker overlay for better text contrast */}
        <div className="container mx-auto px-6 text-center relative z-10"> {/* Added container for responsiveness */}
          <motion.h1
            className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ y: 100, opacity: 0 }}  // Starts 100px below with no opacity
            animate={{
              y: 0, // Moves to its original position
              opacity: 1, // Becomes fully visible
            }}
            transition={{
              duration: 1.2, // Smooth transition duration
              ease: "easeOut", // Smooth easing for a natural feel
            }}
          >
            Turning Struggles Into Strength, <br /> Thoughts Into Triumphs
          </motion.h1>

          <motion.p
            className="text-white text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            At <span className="font-semibold text-emerald-300">Open Heart</span>, we prioritize your mental well-being and strive to provide personalized support to nurture your emotional health.
          </motion.p>
          <motion.button
            onClick={() => navigate("/talk")}
            className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Let's Talk
          </motion.button>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-white py-16">
        <motion.h2 className="text-3xl text-gray-800 font-bold text-center">
          Why Choose Open Heart?
        </motion.h2>
        <motion.p className="text-lg text-gray-600 text-center mt-4 max-w-3xl mx-auto">
          Discover what makes <span className="font-semibold text-emerald-700">Open Heart</span> the right choice for your mental well-being.
        </motion.p>
        <div className="flex flex-col lg:flex-row items-center justify-center mt-12 gap-12 px-6 sm:px-12 lg:px-24">
          <div className="lg:w-1/2">
            <motion.img
              src={FeatureImage}
              alt="Features"
              className="rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 gap-8">
            {[
              { title: "AI-Powered Conversations", desc: "Talk with our AI-driven companion, designed to listen and offer compassionate support whenever you need it.", icon: "🤖" },
              { title: "Professional Counsellors", desc: "Connect with certified mental health professionals for personalized guidance and therapy sessions.", icon: "🩺" },
              { title: "Safe Community Space", desc: "Join a community of individuals sharing their experiences and uplifting each other in a judgment-free environment.", icon: "🌍" }
            ].map((card, index) => (
              <Card
                key={index}
                index={index}
                isHovered={isHovered}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                title={card.title}
                desc={card.desc}
                icon={card.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mental Health Insights Section */}
      <div className="bg-gradient-to-b from-white to-pink-100 py-16">
        <motion.h2 className="text-3xl text-gray-800 font-bold text-center">
          Revolutionary Mental Health Insights
        </motion.h2>
        <motion.p className="text-lg text-gray-600 text-center mt-4 max-w-3xl mx-auto">
          Our AI doesn’t just listen; it learns. Open Heart’s AI-powered companion analyzes your conversations to track your mental state and provide tailored recommendations.
        </motion.p>
        <div className="flex flex-col lg:flex-row items-center justify-center mt-12 gap-12 px-6 sm:px-12 lg:px-24">
          <div className="lg:w-1/2">
            <motion.img
              src={FeatureImage2}
              alt="AI Insights"
              className="rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="lg:w-1/2">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 className="text-2xl font-semibold text-emerald-700 mb-4">
                Real-Time Emotional Tracking
              </motion.h3>
              <motion.p className="text-gray-600">
                Our AI companion provides real-time emotional tracking to offer insights and suggestions that evolve with your mental state.
              </motion.p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg mt-8 transform hover:scale-105 transition duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 className="text-2xl font-semibold text-emerald-700 mb-4">
                Data-Driven Support
              </motion.h3>
              <motion.p className="text-gray-600">
                Open Heart leverages AI to analyze your mood patterns and provides personalized recommendations to improve your emotional well-being.
              </motion.p>
            </motion.div>
          </div>
        </div>
        <Review/>
        <ShowReviews/>
        <Score_graph/>
      </div>

      {/* Call to Action Section */}
      <div className="bg-emerald-600 py-16 text-white">
        <div className="text-center">
          <motion.h2 className="text-3xl font-semibold leading-tight">
            Ready to Start Your Journey to Emotional Wellness?
          </motion.h2>
          <motion.p className="text-lg mt-4 mb-8 max-w-3xl mx-auto">
            Whether you're looking for AI-powered support or professional counseling, Open Heart is here to help you navigate your mental health journey.
          </motion.p>
          <motion.button
            onClick={() => navigate("/login")}
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg shadow-lg hover:bg-emerald-700 hover:text-white transform hover:scale-105 duration-200"
          >
            Log in
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
