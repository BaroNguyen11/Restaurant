import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

// --- MOCK DATA ---
const reviews = [
  {
    id: 1,
    name: "Adam Michel",
    role: "Regular Customer",
    review: "Every pizza starts with our hand-tossed dough, made fresh daily and topped with our signature sauce crafted from ripe tomatoes and secret herbs. Whether you love classic pepperoni or bold gourmet creations, we've got something to satisfy every craving.",
    rating: 5,
    personImg: "https://www.pngplay.com/wp-content/uploads/2/Happy-Man-Transparent-Background.png", 
    foodImg: "https://static.vecteezy.com/system/resources/previews/057/171/539/non_2x/delicious-pizza-topped-with-olives-tomatoes-and-fresh-basil-presented-on-a-wooden-platter-against-a-transparent-background-delicious-pizza-isolated-free-png.png" 
  },
  {
    id: 2,
    name: "Sarah Jessica",
    role: "Food Blogger",
    review: "I have visited many fast food restaurants, but this one is special. The burgers are juicy, the buns are soft, and the fries are perfectly crispy. The atmosphere is cozy and the staff is incredibly friendly. Highly recommended!",
    rating: 5,
    personImg: "https://png.pngtree.com/png-clipart/20240211/original/pngtree-portrait-of-a-person-png-image_14289687.png",
    foodImg: "https://qatar.pizzahut.me/_next/image?url=https%3A%2F%2Fqatar.pizzahut.me%2Fimages%2F9c8f1520-b601-11ef-a94f-a529441f62dc-GRILLEDCHEEKYCHICKEN512PX512PX(6)_mobile_image_2-2024-12-07185606.png&w=1080&q=75"
  },
  {
    id: 3,
    name: "David Smith",
    role: "Local Guide",
    review: "The crispy chicken here is out of this world! It's perfectly seasoned and cooked to perfection. I also love their combo deals, very affordable for students. Will definitely come back with my friends.",
    rating: 4,
    personImg: "https://www.pngplay.com/wp-content/uploads/2/Happy-Man-Transparent-PNG.png",
    foodImg: "https://burgerking.com.cy/sites/default/files/Double%20Cheeseburger-01_1.png"
  }
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển slide sau 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative w-full py-20 bg-[#fff8f0] font-['Poppins'] overflow-hidden">
      
      {/* --- CÁC HỌA TIẾT TRANG TRÍ BAY LƠ LỬNG (FLOATING ELEMENTS) --- */}
      {/* Góc trái trên: Lá Basil */}
      <motion.img 
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        src="https://cdn-icons-png.flaticon.com/512/3432/3432397.png"
        className="absolute top-10 left-0 w-24 md:w-32 opacity-80"
        alt="basil"
      />
      
      {/* Góc phải trên: Tacos */}
      <motion.img 
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        src="https://static.vecteezy.com/system/resources/previews/027/764/486/non_2x/tacos-icon-design-free-png.png"
        className="absolute top-5 right-5 w-32 md:w-48 z-10"
        alt="tacos"
      />

      {/* Góc phải dưới: Lá rơi */}
      <motion.img 
         animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
         src="https://cdn-icons-png.flaticon.com/512/8290/8290412.png"
         className="absolute bottom-10 right-10 w-20 opacity-60 blur-[1px]"
         alt="leaf"
      />

      <div className="container mx-auto px-4 relative z-20">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
            <h4 className="text-[#FFA500] font-bold text-sm tracking-widest uppercase mb-2">Testimonials</h4>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
                Customer Feedback <span className="text-[#9e1c20]">& Reviews</span>
            </h2>
            <div className="w-24 h-1 bg-gray-200 mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm">
                The concept of "quick food" actually dates back to ancient civilizations, where street vendors and food stalls offered simple meals.
            </p>
        </div>

        {/* --- MAIN CONTENT (2 CỘT) --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* 1. CỘT TRÁI: HÌNH ẢNH (Image Composition) */}
            <div className="w-full lg:w-1/2 relative min-h-100 flex items-center justify-center">
                 <AnimatePresence mode='wait'>
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full max-w-md h-100"
                    >
                        {/* Ảnh nền (Pizza/Burger) */}
                        <div className="bg-[#9e1c20] rounded-tl-[100px] rounded-br-[100px] p-2 absolute top-0 left-0 w-3/4 h-64 -z-10 transform -rotate-6 opacity-20"></div>
                        <div className="absolute top-0 left-0 w-3/4 z-0">
                            <img 
                                src={reviews[currentIndex].foodImg} 
                                alt="Food" 
                                className="w-full h-auto drop-shadow-2xl animate-[spin_60s_linear_infinite]"
                            />
                        </div>

                        {/* Ảnh người (Overlapping Image) */}
                        <div className="absolute top-20 right-0 w-64 h-72 bg-yellow-400 p-2 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 z-10 border-4 border-white">
                            <img 
                                src={reviews[currentIndex].personImg} 
                                alt="Person" 
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>

                        {/* Icon Quote Trôi Nổi */}
                        <div className="absolute top-10 right-10 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-20 border-2 border-[#9e1c20]">
                            <Quote size={32} className="text-[#9e1c20] fill-[#9e1c20]" />
                        </div>
                    </motion.div>
                 </AnimatePresence>
            </div>

            {/* 2. CỘT PHẢI: NỘI DUNG REVIEW */}
            <div className="w-full lg:w-1/2">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={20} 
                                    className={i < reviews[currentIndex].rating ? "fill-[#FFA500] text-[#FFA500]" : "text-gray-300"} 
                                />
                            ))}
                        </div>

                        {/* Nội dung Review */}
                        <blockquote className="text-lg md:text-xl text-gray-600 italic leading-relaxed mb-8">
                            "{reviews[currentIndex].review}"
                        </blockquote>

                        {/* Tác giả */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-[#9e1c20] font-['Oleo_Script'] transform -rotate-1 inline-block">
                                {reviews[currentIndex].name}
                            </h3>
                            <p className="text-[#FFA500] font-bold text-sm uppercase tracking-wide">
                                {reviews[currentIndex].role}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Controls (01/04) */}
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-gray-900">
                        0{currentIndex + 1}
                    </span>
                    <span className="text-xl font-bold text-gray-300">
                        / 0{reviews.length}
                    </span>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-2 ml-4">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-3 rounded-full transition-all duration-300 ${
                                    currentIndex === index 
                                    ? "w-8 bg-[#9e1c20]" 
                                    : "w-3 bg-gray-300 hover:bg-[#FFA500]"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;