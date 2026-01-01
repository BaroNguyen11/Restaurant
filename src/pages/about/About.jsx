import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Leaf, Truck, ChefHat } from 'lucide-react';

// --- DỮ LIỆU CHI TIẾT (Expanded Data) ---
const detailedFeatures = [
  {
    id: 1,
    title: "Fresh & Organic Ingredients",
    subtitle: "Farm to Table",
    description: "We believe that the best food comes from the best ingredients. That's why we partner directly with local farmers to source organic vegetables, free-range meats, and artisanal cheeses. Every morning, our kitchen receives fresh produce to ensure that your meal is packed with nutrients and natural flavors.",
    benefits: [
      "100% Organic Vegetables",
      "No Artificial Preservatives",
      "Locally Sourced Meats",
      "Daily Fresh Shipments"
    ],
    img: "https://img.freepik.com/free-photo/fresh-vegetables-wooden-table_1150-13783.jpg", // Ảnh rau củ tươi
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 2,
    title: "Express Hot Delivery",
    subtitle: "30 Minutes Promise",
    description: "Hunger doesn't wait, and neither should you. Our advanced logistics network ensures that your food is prepared and dispatched instantly. We use specialized thermal packaging to keep your burgers juicy and your fries crispy, just as if you were eating at the restaurant.",
    benefits: [
      "Real-time Tracking",
      "Thermal Insulation Bags",
      "Free Delivery for Orders > $50",
      "Contactless Delivery Options"
    ],
    img: "https://img.freepik.com/free-photo/delivery-man-riding-red-scooter-illustration_1150-5915.jpg", // Ảnh giao hàng (hoặc scooter 3D)
    icon: Truck,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 3,
    title: "World-Class Master Chefs",
    subtitle: "Culinary Excellence",
    description: "Our kitchen is led by Executive Chef Brain Adams, who brings over 20 years of culinary experience from 5-star hotels. Our team doesn't just cook; they create art. Each recipe is a result of months of experimentation to find the perfect balance of flavors, textures, and aromas.",
    benefits: [
      "Award-Winning Recipes",
      "Strict Hygiene Standards",
      "Passionate Culinary Team",
      "Open Kitchen Concept"
    ],
    img: "https://img.freepik.com/free-photo/chef-making-ok-sign-white-background_1368-2804.jpg", // Ảnh đầu bếp
    icon: ChefHat,
    color: "text-[#9e1c20]",
    bgColor: "bg-red-100"
  }
];

// --- MOCK DATA: CHEFS ---
const chefs = [
    { name: "Brain Adams", role: "Executive Chef", img: "https://img.freepik.com/free-photo/portrait-smiling-chef-uniform_329181-45.jpg" },
    { name: "Jullia Robertson", role: "Head Chef", img: "https://img.freepik.com/free-photo/pleased-young-female-cook-wearing-chef-uniform-holding-bowl-whisk_141793-123730.jpg" },
    { name: "Kevin Smith", role: "Grill Master", img: "https://img.freepik.com/free-photo/portrait-confident-male-chef-dressed-uniform_171337-5266.jpg" },
    { name: "Marta White", role: "Pastry Chef", img: "https://img.freepik.com/free-photo/positive-female-chef-showing-ok-sign_171337-3315.jpg" },
];

const About = () => {
  return (
    <div className="w-full bg-white font-['Poppins'] overflow-hidden pt-20">
      
      {/* ==================== 1. HEADER BANNER ==================== */}
      <section className="relative w-full h-87.5 bg-[#fff8f0] flex items-center justify-center overflow-hidden">
         {/* Họa tiết trang trí */}
         <motion.img 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 0.8, x: 0 }} transition={{ duration: 1 }}
            src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
            className="absolute top-10 left-10 md:left-1/4 w-24 opacity-60 grayscale" alt="pizza"
        />
        <motion.img 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
            src="https://cdn-icons-png.flaticon.com/512/1147/1147829.png"
            className="absolute bottom-5 right-10 md:right-1/4 w-28 opacity-60 grayscale" alt="burger"
        />

        <div className="text-center z-10 relative">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-2">About Us</h1>
        </div>
      </section>

      {/* ==================== 2. OUR STORY (Giữ nguyên) ==================== */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative min-h-100">
                <div className="absolute top-0 left-0 w-4/5 h-full rounded-[40px] overflow-hidden shadow-2xl z-0">
                    <img src="https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg" className="w-full h-full object-cover" alt="Interior"/>
                </div>
                <div className="absolute bottom-10 right-0 w-3/5 h-3/5 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white z-10">
                     <img src="https://img.freepik.com/free-photo/chef-cooking-food-kitchen_1150-5936.jpg" className="w-full h-full object-cover" alt="Cooking"/>
                </div>
                <div className="absolute top-10 right-10 w-24 h-24 bg-[#FFA500] rounded-full flex flex-col items-center justify-center text-white shadow-xl z-20 animate-bounce-slow">
                    <span className="text-3xl font-black">15+</span>
                    <span className="text-xs font-bold uppercase">Years Exp</span>
                </div>
            </div>
            <div className="w-full lg:w-1/2">
                <h4 className="text-[#F51E46] font-bold text-sm tracking-widest uppercase mb-2">Our Story</h4>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    We Cook With <span className="text-[#FFA500] font-['Oleo_Script'] transform rotate-2 inline-block">Passion</span> & Love
                </h2>
                <p className="text-gray-500 mb-6 leading-relaxed">
                    Founded in 2010, TasteNest started as a small family kitchen with a big dream. Over the years, we've grown into a beloved gathering spot, but our core values remain the same.
                </p>
                <button className="bg-[#9e1c20] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-black transition-colors">
                    Explore Our Menu
                </button>
            </div>
        </div>
      </section>

      {/* ==================== 3. DETAILED FEATURES (THAY ĐỔI LỚN Ở ĐÂY) ==================== */}
      {/* Thay vì dùng Grid 3 cột, ta dùng Flex Column xen kẽ */}
      <section className="w-full py-20 bg-[#f9f9f9]">
        <div className="container mx-auto px-4">
             <div className="text-center mb-20">
                <h4 className="text-[#FFA500] font-bold text-sm tracking-widest uppercase mb-2">Why We Are The Best</h4>
                <h2 className="text-4xl font-black text-gray-900 uppercase">
                    Our Core <span className="text-[#9e1c20]">Values</span>
                </h2>
                <div className="w-16 h-1 bg-[#FFA500] mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="space-y-24">
                {detailedFeatures.map((item, index) => {
                    // Logic để đảo chiều ảnh: Chẵn -> Ảnh trái, Lẻ -> Ảnh phải
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                        >
                            {/* --- CỘT ẢNH --- */}
                            <div className="w-full lg:w-1/2 relative">
                                <div className="relative rounded-[40px] overflow-hidden shadow-2xl group">
                                    <img 
                                        src={item.img} 
                                        alt={item.title} 
                                        className="w-full h-100 object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay màu nhẹ khi hover */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                                </div>
                                {/* Icon trôi nổi trang trí */}
                                <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} w-24 h-24 ${item.bgColor} rounded-full flex items-center justify-center shadow-lg z-10 border-4 border-white`}>
                                    <item.icon size={40} className={item.color} />
                                </div>
                            </div>

                            {/* --- CỘT NỘI DUNG --- */}
                            <div className="w-full lg:w-1/2">
                                <div className={`inline-block px-4 py-2 ${item.bgColor} rounded-full mb-4`}>
                                    <span className={`${item.color} font-bold text-sm uppercase tracking-wide`}>{item.subtitle}</span>
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                                    {item.title}
                                </h3>
                                
                                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                    {item.description}
                                </p>

                                {/* List lợi ích chi tiết */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {item.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle size={20} className={item.color} />
                                            <span className="font-medium text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* ==================== 4. VIDEO SECTION ==================== */}
      <section className="relative w-full h-125 flex items-center justify-center bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/chef-sprinkling-spices-dish_23-2148293774.jpg')" }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="z-10 text-center">
              <h2 className="text-white text-4xl md:text-6xl font-black mb-8 font-['Oleo_Script']">Experience the Taste <br/> of Perfection</h2>
              <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#9e1c20] shadow-2xl hover:scale-110 transition-transform cursor-pointer animate-pulse">
                  <Play size={32} fill="#9e1c20" />
              </button>
          </motion.div>
      </section>

      {/* ==================== 5. MEET OUR CHEFS (Giữ nguyên) ==================== */}
      <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h4 className="text-[#FFA500] font-bold text-sm tracking-widest uppercase mb-2">Team Member</h4>
                <h2 className="text-4xl font-black text-gray-900 uppercase">Meet Our <span className="text-[#9e1c20]">Chefs</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {chefs.map((chef, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative overflow-hidden rounded-3xl">
                        <div className="h-100 w-full overflow-hidden">
                            <img src={chef.img} alt={chef.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl text-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-bold text-gray-900 text-lg">{chef.name}</h3>
                            <p className="text-[#9e1c20] text-sm font-medium uppercase">{chef.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
      </section>

    </div>
  );
};

export default About;