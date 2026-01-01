import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';



// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

const About = () => {
  return (
    <section className="w-full bg-[#f9f3e2] py-20 overflow-hidden font-['Poppins']">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Cột trái: Hình ảnh tổng hợp */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
             {/* Ảnh nền chính (Pizza) */}
             <div className="relative z-10 w-full max-w-lg mx-auto">
                <img 
                    src="https://png.pngtree.com/png-clipart/20230913/original/pngtree-pizza-free-vector-png-image_11075017.png" 
                    alt="Pizza" 
                    className="w-full h-auto drop-shadow-2xl animate-[spin_60s_linear_infinite]" 
                />
             </div>

             {/* Ảnh phụ bay lơ lửng (Dumplings) */}
             <motion.img 
                animate={floatAnimation}
                src="https://cdn-icons-png.flaticon.com/512/6252/6252562.png"
                className="absolute -bottom-10 right-10 w-20 h-20 object-contain z-20 "
                alt="Dumplings"
             />

             {/* Các nguyên liệu trang trí (Basil, Chili) */}
             <motion.img animate={floatAnimation} src="https://cdn-icons-png.flaticon.com/512/8290/8290412.png" className="absolute top-0 left-0 w-20 z-0 opacity-80 -rotate-45" alt="leaf"/>
             <motion.img animate={floatAnimation} src="https://uxwing.com/wp-content/themes/uxwing/download/fruits-vegetables/chili-icon.png" className="absolute top-10 right-10 w-16 rotate-45 z-0" alt="chili"/>
          </motion.div>

          {/* Cột phải: Nội dung chữ */}
          <motion.div 
            className="w-full lg:w-1/2 text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
             <h4 className="text-[#FFA500] font-bold text-sm tracking-wider uppercase mb-2">About Our Restaurant</h4>
             <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 uppercase">
                We Invite you to visit our fast food <span className="text-[#9e1c20]">Restaurant</span>
             </h2>

             <p className="text-gray-500 mb-6 leading-relaxed">
                At the heart of our kitchen are bold flavors, high-quality ingredients, and a commitment to consistency. From juicy burgers, crispy fries, and cheesy pizzas to spicy wraps and refreshing drinks, every item on our menu is made to order and packed with taste.
             </p>

             <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-12 bg-[#9e1c20]"></div>
                <div>
                    <h5 className="font-bold text-xl text-gray-900">Parvez Hossain Imon</h5>
                    <p className="text-sm text-gray-500">Restaurant Owner</p>
                </div>
             </div>

           <Link to='/menu?tab=starters'>
             <button className="relative overflow-hidden cursor-pointer bg-[#9e1c20] text-white font-bold py-4 px-10 rounded-full shadow-lg group">
                 <span className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                 <span className="relative flex items-center gap-2 uppercase tracking-wide">
                    Visit Our Restaurant <ArrowRight className="w-5 h-5" />
                 </span>
             </button>
           </Link>

          
          </motion.div>

        </div>
      </div>

    </section>
  );
}

export default About;