import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

// --- MOCK DATA ---
const features = [
    {
        id: 1,
        title: "Fresh Healthy Food",
        description: "We use only the freshest ingredients, organic vegetables, and premium meats to ensure the best taste and health for you.",
        icon: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png", // Icon Rau củ
        color: "bg-green-50"
    },
    {
        id: 2,
        title: "Fast Home Delivery",
        description: "Hungry? Don't worry! Our express delivery team ensures your food arrives hot and fresh within 30 minutes.",
        icon: "https://cdn-icons-png.flaticon.com/512/9561/9561688.png", // Icon Shipper
        color: "bg-orange-50"
    },
    {
        id: 3,
        title: "Professional Chefs",
        description: "Our dishes are prepared by experienced chefs who are passionate about creating the perfect flavor for every meal.",
        icon: "https://cdn-icons-png.flaticon.com/512/1830/1830839.png", // Icon Chef
        color: "bg-blue-50"
    }
];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const StatItem = ({ stat, index }) => {
    // 1. Tách số và đuôi (Ví dụ: "10k+" => num: 10, suffix: "k+")
    const num = parseInt(stat.value); // Lấy phần số (50, 10, 20...)
    const suffix = stat.value.replace(num, ""); // Lấy phần đuôi (+, k+)

    // 2. Khởi tạo giá trị motion bắt đầu từ 0
    const count = useMotionValue(0);

    // 3. Biến đổi số thực (1.23) thành số nguyên (1) để hiển thị
    const rounded = useTransform(count, (latest) => Math.round(latest));

    // 4. Kiểm tra xem phần tử có nằm trong màn hình không
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true }); // once: true để chỉ chạy 1 lần

    useEffect(() => {
        if (isInView) {
            // Chạy animation từ 0 đến num trong 2 giây
            const controls = animate(count, num, {
                duration: 2,
                delay: 0.5 + (index * 0.1), // Giữ lại delay so le như cũ
                ease: "easeOut"
            });
            return controls.stop;
        }
    }, [isInView, num, count, index]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
        >
            <h3 className="text-3xl md:text-4xl font-black text-[#9e1c20] mb-1 flex justify-center">
                {/* Render số đang chạy */}
                <motion.span>{rounded}</motion.span>
                {/* Render đuôi tĩnh (k+, +) */}
                <span>{suffix}</span>
            </h3>
            <p className="text-gray-500 font-medium text-xs md:text-sm uppercase tracking-wider">
                {stat.label}
            </p>
        </motion.div>
    );
};
const WhyChooseUs = () => {
    return (
        <section className="w-full py-24 bg-white font-['Poppins'] overflow-hidden">
            <div className="container mx-auto px-4">

                {/* --- HEADER --- */}
                <div className="text-center mb-16">
                    <h4 className="text-[#FFA500] font-bold text-sm tracking-widest uppercase mb-2">Why Choose Us</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
                        Our Strength & <span className="text-[#9e1c20]">Benefits</span>
                    </h2>
                    <div className="w-16 h-1.5 bg-[#FFA500] mx-auto mt-4 rounded-full"></div>
                </div>

                {/* --- FEATURES GRID --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            variants={itemVariants}
                            className={`group relative p-8 rounded-[30px] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden`}
                        >
                            {/* Background Circle trang trí khi hover */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${feature.color} group-hover:scale-[10] transition-transform duration-500 -z-10`}></div>

                            {/* Icon */}
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                <img src={feature.icon} alt={feature.title} className="w-12 h-12 object-contain" />
                            </div>

                            {/* Nội dung */}
                            <div className="text-center relative z-10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#9e1c20] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 mb-6 leading-relaxed text-sm md:text-base group-hover:text-gray-700">
                                    {feature.description}
                                </p>

                                {/* Nút Read More */}
                                <Link to='/about'>
                                    <button className="inline-flex items-center gap-2 font-bold text-[#9e1c20] group-hover:text-black transition-colors uppercase text-sm tracking-wide cursor-pointer">
                                        Read More <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- THỐNG KÊ NHANH (FUN FACTS) --- */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-200">
                    {[
                        { label: "Food Items", value: "50+" },
                        { label: "Satisfied Clients", value: "10k+" },
                        { label: "Expert Chefs", value: "20+" },
                        { label: "Years Experience", value: "12+" },
                    ].map((stat, index) => (
                        <StatItem key={index} stat={stat} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;