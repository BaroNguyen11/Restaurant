import React from 'react';
import { motion } from 'framer-motion';
import { Phone, CalendarCheck } from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative w-full py-24 bg-[#fff8f0] overflow-hidden font-['Poppins']">
      
      {/* --- BACKGROUND DECORATION (Họa tiết trang trí) --- */}
      {/* Hình mờ background (Pattern) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://cdn-icons-png.flaticon.com/512/3595/3595455.png')] bg-repeat space-x-4"></div>

      {/* Các vật thể bay lơ lửng */}
      <motion.img 
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        src="https://cdn-icons-png.flaticon.com/512/8290/8290412.png"
        className="absolute top-10 left-10 w-20 md:w-32 opacity-60 blur-[1px]"
        alt="leaf"
      />
      <motion.img 
        animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        src="https://cdn-icons-png.flaticon.com/512/1147/1147829.png" // Icon Ớt
        className="absolute bottom-10 right-10 w-16 md:w-24 opacity-80"
        alt="chili"
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* Tiêu đề phụ */}
        <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F51E46] font-bold tracking-widest uppercase text-sm mb-4 block"
        >
            Book Your Table
        </motion.span>

        {/* Tiêu đề chính */}
        <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
        >
            Ready to Experience the <br/>
            <span className="text-[#FFA500] font-['Oleo_Script'] transform -rotate-2 inline-block mt-2 md:mt-0">Best Food</span> in Town?
        </motion.h2>

        {/* Đoạn văn mô tả */}
        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-10 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
        >
            Join us today and indulge in a culinary journey like no other. Delicious meals, great ambiance, and unforgettable memories await you!
        </motion.p>

        {/* Các nút hành động */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
            {/* Nút đặt bàn */}
            <button className="group relative bg-[#F51E46] text-white font-bold px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(245,30,70,0.4)] hover:shadow-[0_10px_20px_rgba(245,30,70,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer">
                <span className="relative z-10 flex items-center gap-2">
                    Book Your Table <CalendarCheck size={20} />
                </span>
                {/* Hiệu ứng lướt sáng qua nút */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
            </button>

            {/* Nút gọi điện (Phụ) */}
            <button className="flex items-center gap-2 text-gray-700 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 cursor-pointer">
                <Phone size={20} className="text-[#F51E46]" />
                +123 456 7890
            </button>
        </motion.div>

      </div>
    </section>
  );
}
export default CTA;