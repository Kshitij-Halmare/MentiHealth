import React from 'react';
import { motion } from 'framer-motion';
import HeroImage from "../assets/premium_photo-1672292536199-7a4cf2b78318.jpg";
import { FaRobot, FaHandsHelping, FaUsers, FaBrain, FaStethoscope } from "react-icons/fa";

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", stiffness: 100 } },
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.3 } },
};

function About() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Hero Section */}
            <div className="relative py-24 h-[550px] rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${HeroImage})` }}>
                <div className="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.h1
                        className="text-white text-5xl underline underline-offset-8 md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-serif"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        About Open Heart
                    </motion.h1>
                    <motion.p
                        className="text-white text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        At Open Heart, we're dedicated to fostering mental well-being through innovative AI-powered support and professional guidance. We believe everyone deserves access to compassionate care and personalized resources to navigate their mental health journey.
                    </motion.p>
                </div>
            </div>

            {/* About Us Content Section */}
            <div className="bg-white py-16 px-6 md:px-12 lg:px-24">
                <div className="container mx-auto">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                    >
                        <motion.div variants={contentVariants}>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                            <p className="text-gray-700 leading-relaxed mb-8">
                                Our mission is to empower individuals to take control of their mental health by providing accessible, effective, and personalized support. We strive to break down the stigma surrounding mental health and create a safe and supportive community where everyone feels understood and valued.
                            </p>

                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We envision a world where mental well-being is prioritized and accessible to all. We aim to be at the forefront of mental health innovation, leveraging technology and human expertise to create a positive impact on individuals and communities worldwide.
                            </p>
                        </motion.div>

                        {/* Point Cards Section */}
                        <motion.div variants={contentVariants}>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Offer</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { icon: <FaRobot className="text-emerald-600 text-4xl mb-4" />, title: "AI Companion", description: "Engage in supportive conversations with our AI, available 24/7." },
                                    { icon: <FaStethoscope className="text-emerald-600 text-4xl mb-4" />, title: "Professional Counseling", description: "Connect with licensed therapists for personalized guidance." },
                                    { icon: <FaUsers className="text-emerald-600 text-4xl mb-4" />, title: "Community Forum", description: "Join a safe and understanding community to share experiences." },
                                    { icon: <FaBrain className="text-emerald-600 text-4xl mb-4" />, title: "Mental Health Resources", description: "Access curated articles, tools, and exercises for self-care." },
                                ].map((card, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300"
                                        variants={cardVariants}
                                    >
                                        {card.icon}
                                        <h3 className="text-xl font-semibold text-emerald-600 mb-2">{card.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

        </motion.div>
    );
}

export default About;
