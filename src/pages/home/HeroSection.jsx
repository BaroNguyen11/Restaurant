import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
const HeroSection = () => {
  const slideInLeft = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const popIn = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.5, type: "spring", stiffness: 120 } }
  };
  const appearFromBottom = {
    hidden: { y: 150, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-165 overflow-hidden font-['Poppins'] ">

      {/* --- PHẦN TRÁI (MÀU ĐỎ) --- */}
      <div className="relative w-full md:w-[45%] bg-[#9e1c20] text-white p-8 md:p-16 flex flex-col justify-center text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInLeft}
          className="absolute top-22 left-0 w-50 h-10"
        >
          <svg width="100%" height="100%" viewBox="0 0 100 20">
            <polyline
              points="0,10 10,0 20,10 30,0 40,10 50,0 60,10 70,0 80,10 90,0 100,10"
              fill="none"
              stroke="#FFC107"
              strokeWidth="4"
            />
          </svg>
        </motion.div>

        {/* Họa tiết răng cưa màu vàng góc trái trên */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={popIn}

        >

          {/* Text nhỏ trên cùng */}
          <p className="text-lg mb-2 tracking-wide font-medium"> Tasty Delicious</p>
          {/* TIÊU ĐỀ CHÍNH */}
          <div className="leading-none mb-6">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
              BEST <br /> BURGER
            </h1>
            <h2 className="text-4xl md:text-6xl text-[#FFA500] font-['Oleo_Script'] -mt-2.5 ml-4 rotate-[-5deg]">
              In Town
            </h2>
          </div>
          {/* Text giảm giá */}
          <p className="text-2xl font-semibold mb-4">Get <span className="text-[#FFA500]">50% Off</span> Discount</p>

          {/* Mô tả */}
          <p className="text-sm opacity-80 mb-8 ">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod enim.
          </p>

          {/* Nút gọi & Số điện thoại */}
          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 bg-transparent text-white text-xl font-bold">
              <Phone fill="white" className="w-6 h-6" />
              Call Now:
            </button>
            <span className="bg-[#FFA500] text-[#9e1c20] font-bold px-6 py-3 rounded-full text-lg shadow-lg">
              +123 456 6890
            </span>
          </div>
        </motion.div>
      </div>

      {/* --- PHẦN PHẢI (MÀU KEM) --- */}
      <div className="relative w-full md:w-[55%] bg-[#fff8f0] flex items-center justify-center p-10 overflow-hidden">

        {/* Họa tiết trang trí nền (Icon mờ, hình học...) */}
        <div className="absolute top-10 right-10 text-[#FFA500]">✦</div>
        <div className="absolute bottom-20 left-20 text-[#FFA500] text-2xl">✦</div>

        {/* Tem Best Seller */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={popIn}
          className="absolute top-10 right-10 z-20"
        >
          <div className="relative bg-[#a91b1f] text-white font-bold px-6 py-8 rounded-full border-4 border-dashed border-white shadow-xl flex items-center justify-center rotate-12">
            <span className="text-center leading-tight">BEST <br /> SELLER</span>
            {/* Viền răng cưa cho tem (giả lập bằng css border-dashed ở trên hoặc dùng SVG riêng) */}
          </div>
        </motion.div>

        {/* ẢNH BURGER CHÍNH */}
        {/* Bạn cần thay src bằng ảnh burger đã tách nền của bạn */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={appearFromBottom}
          className="relative z-10 w-[80%] md:w-[70%]  drop-shadow-[0_60px_20px_rgba(0,0,0,0.4)] "
        >
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{
              duration: 4.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <img
              src="https://jdtxfefnikvizdpsyjni.supabase.co/storage/v1/object/public/image/burger.png"
              alt="Big Burger"
              className="w-full h-auto object-contain"
            />

          </motion.div>

        </motion.div>

        {/* CÁC NGUYÊN LIỆU BAY (Floating Elements) */}
        {/* Cà chua */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={popIn}
          className="absolute top-20 left-20 w-16 h-16 rotate-[-15deg] drop-shadow-lg"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1202/1202125.png" alt="tomato" />
        </motion.div>
        {/* Dưa leo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={popIn}
          className="absolute bottom-32 right-10 w-14 h-14 rotate-30 drop-shadow-lg"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/765/765618.png" alt="cucumber" />
        </motion.div>
        {/* Phô mai */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={popIn}
          className="absolute bottom-10 right-1/3 w-12 h-12 bg-yellow-400 rounded-lg rotate-12 opacity-80"
        >
        </motion.div>
      </div>



    </div>
  )
}
export default HeroSection;