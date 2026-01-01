import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Facebook, Instagram, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#f8f9fa] pt-20 font-['Poppins'] overflow-hidden">
      
      {/* --- BACKGROUND DECORATIONS (SKETCHES) --- */}
      {/* Bạn cần thay thế src bằng các file ảnh sketch trong suốt (transparent PNG) của bạn */}
      <img 
        src="https://cdn-icons-png.flaticon.com/512/706/706164.png" // Ví dụ: Nấm
        className="absolute bottom-0 left-10 w-24 opacity-10 rotate-12 pointer-events-none grayscale"
        alt="decor"
      />
      <img 
        src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png" // Ví dụ: Pizza
        className="absolute top-20 left-0 w-32 opacity-10 -rotate-12 pointer-events-none grayscale"
        alt="decor"
      />
      <img 
        src="https://cdn-icons-png.flaticon.com/512/765/765618.png" // Ví dụ: Rau củ
        className="absolute bottom-20 right-0 w-40 opacity-10 rotate-45 pointer-events-none grayscale"
        alt="decor"
      />
       <img 
        src="https://cdn-icons-png.flaticon.com/512/2619/2619560.png" // Ví dụ: Cà chua
        className="absolute top-10 right-20 w-20 opacity-10 rotate-12 pointer-events-none grayscale"
        alt="decor"
      />


      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* --- CỘT 1: THẺ ĐỎ THÔNG TIN (Chiếm 4/12 cột) --- */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F51E46] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden"
            >
                {/* Logo trong thẻ đỏ */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                        <img src="/src/assets/logo.png" alt="TasteNest" className="w-24 brightness-200 contrast-200" />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="font-bold">Tuesday – Saturday: 12:00pm – 23:00pm</p>
                    <p className="font-bold underline decoration-2 underline-offset-4 decoration-white/50">Closed on Sunday</p>
                    
                    <div className="pt-6">
                        <p className="text-sm font-medium opacity-90">5 star rated on TripAdvisor</p>
                    </div>
                </div>

                {/* Họa tiết mờ bên trong thẻ đỏ */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>

          {/* --- CỘT 2: ABOUT LINKS (Chiếm 2/12 cột) --- */}
          <div className="lg:col-span-2 lg:pl-8">
            <h3 className="text-xl font-black text-gray-900 mb-6 relative inline-block">
                About
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFC107] -z-10 opacity-60 rounded-sm"></span>
            </h3>
            <ul className="space-y-3">
                {['Fredoka One', 'Special Dish', 'Reservation', 'Contact'].map((item, idx) => (
                    <li key={idx}>
                        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-[#F51E46] transition-colors font-medium group">
                            <ChevronRight size={16} className="text-[#F51E46] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            <span className="-translate-x-4 group-hover:translate-x-0 transition-transform duration-300">{item}</span>
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* --- CỘT 3: MENU LINKS (Chiếm 2/12 cột) --- */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-black text-gray-900 mb-6 relative inline-block">
                Menu
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFC107] -z-10 opacity-60 rounded-sm"></span>
            </h3>
            <ul className="space-y-3">
                {['Steaks', 'Burgers', 'Cocktails', 'Bar B Q', 'Desserts'].map((item, idx) => (
                    <li key={idx}>
                         <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-[#F51E46] transition-colors font-medium group">
                            <ChevronRight size={16} className="text-[#F51E46] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            <span className="-translate-x-4 group-hover:translate-x-0 transition-transform duration-300">{item}</span>
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* --- CỘT 4: NEWSLETTER (Chiếm 4/12 cột) --- */}
          <div className="lg:col-span-4">
            <h3 className="text-xl font-black text-gray-900 mb-6 relative inline-block">
                Newsletter
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFC107] -z-10 opacity-60 rounded-sm"></span>
            </h3>
            <p className="text-gray-500 mb-6 text-sm">Get recent news and updates.</p>
            
            <form className="flex flex-col gap-4">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F51E46] focus:ring-1 focus:ring-[#F51E46] transition-all shadow-sm"
                />
                <button className="w-fit bg-[#F51E46] text-white font-bold px-8 py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all border-2 border-[#F51E46] flex items-center gap-2">
                    Subscribe <Send size={18} />
                </button>
            </form>
          </div>

        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="mt-20 relative z-10">
        {/* Đường kẻ vàng đậm */}
        <div className="w-full h-2 bg-[#FFC107]"></div>
        
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-sm font-bold">
                    <span className="text-[#F51E46]">© 2025 TasteNest</span> | All rights reserved
                </p>
                
                <div className="flex items-center gap-6">
                    <a href="#" className="flex items-center gap-2 font-bold text-gray-900 hover:text-[#F51E46] transition-colors">
                        Facebook <Facebook size={18} />
                    </a>
                    <a href="#" className="flex items-center gap-2 font-bold text-gray-900 hover:text-[#F51E46] transition-colors">
                        Instagram <Instagram size={18} />
                    </a>
                </div>
            </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;