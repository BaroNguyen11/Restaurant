import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, User, PenTool, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { supabase } from '@/api';
const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: 'Personal Training',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm gửi dữ liệu lên Supabase
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([
                    {
                        full_name: formData.fullName,
                        email: formData.email,
                        subject: formData.subject,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            alert("Message sent successfully!");
            // Reset form về ban đầu
            setFormData({ fullName: '', email: '', subject: 'Personal Training', message: '' });

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send message.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full bg-white font-['Poppins'] overflow-hidden pt-20">

            {/* ==================== 1. HEADER BANNER (SKETCHES) ==================== */}
            <section className="relative w-full h-75 md:h-100 bg-[#fff8f0] flex items-center justify-center overflow-hidden">

                {/* Họa tiết trang trí (Sketch Gà & Trứng) */}
                <motion.img
                    initial={{ opacity: 0, x: -50, rotate: -10 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 1 }}
                    src="https://cdn-icons-png.flaticon.com/512/6978/6978255.png" // Đùi gà sketch
                    className="absolute top-10 left-10 md:left-1/4 w-24 md:w-32 opacity-80"
                    alt="chicken"
                />
                <motion.img
                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    src="https://cdn-icons-png.flaticon.com/512/5029/5029236.png" // Trứng ốp la sketch
                    className="absolute top-5 right-10 md:right-1/4 w-32 md:w-48 opacity-80"
                    alt="egg"
                />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -left-20 w-64 h-64 border-2 border-dashed border-[#FFA500] rounded-full opacity-20"
                ></motion.div>

                {/* Text Chính */}
                <div className="text-center z-10 relative">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-2">Contact</h1>

                    {/* Mũi tên vẽ tay (giả lập) */}
                    <svg className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 opacity-30 rotate-12" viewBox="0 0 100 100">
                        <path d="M10,50 Q50,10 90,50" fill="none" stroke="#9e1c20" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M80,40 L90,50 L80,60" fill="none" stroke="#9e1c20" strokeWidth="2" />
                    </svg>
                </div>
            </section>

            {/* ==================== 2. MAIN CONTENT (INFO & FORM) ==================== */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* --- CỘT TRÁI: THÔNG TIN LIÊN HỆ --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#f9f4e8] p-8 md:p-12 rounded-[40px] relative overflow-hidden"
                    >
                        {/* Lá trang trí */}
                        <img src="https://cdn-icons-png.flaticon.com/512/8290/8290412.png" className="absolute bottom-10 -right-5 w-24 rotate-45 opacity-60" alt="leaf" />

                        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase">
                            Contact <span className="text-[#9e1c20]">Information</span>
                        </h2>
                        <p className="text-gray-500 mb-10 text-sm">
                            Relax and enjoy your food in our cozy restaurant, or take it to-go. Great taste, great service — every visit is a flavorful experience worth coming back for.
                        </p>

                        <div className="space-y-6 relative z-10">
                            {/* Address */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-[#9e1c20] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Address</h4>
                                    <p className="text-gray-500 text-sm">8502 Preston Rd. Inglewood, Maine 98380</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-[#9e1c20] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Contact Info</h4>
                                    <p className="text-gray-500 text-sm">Mobile: +123 456 7890</p>
                                    <p className="text-gray-500 text-sm">Email: hello@tastenest.com</p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-[#9e1c20] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Opening Hours</h4>
                                    <p className="text-gray-500 text-sm">Monday - Saturday: 9:00am - 10:00pm</p>
                                    <p className="text-gray-500 text-sm">Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- CỘT PHẢI: FORM LIÊN HỆ --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-black text-gray-900 mb-8">Get In Touch!</h2>

                        <form className="space-y-6 " onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name='fullName'
                                        placeholder="Your Name"
                                        className="w-full bg-[#f4f1ea] py-4 pl-6 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9e1c20]"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                                {/* Email Input */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        name='email'
                                        placeholder="Your Email"
                                        className="w-full bg-[#f4f1ea] py-4 pl-6 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9e1c20]"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            {/* Subject Select */}
                            <div className="relative">
                                <select
                                    className="w-full bg-[#f4f1ea] py-4 pl-6 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9e1c20] text-gray-500 appearance-none cursor-pointer"
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                >
                                    <option>Personal Training</option>
                                    <option>General Inquiry</option>
                                    <option>Feedback</option>
                                    <option>Event Booking</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            {/* Message Area */}
                            <div className="relative">
                                <textarea
                                    rows="5"
                                    placeholder="Write Messages..."
                                    className="w-full bg-[#f4f1ea] py-4 pl-6 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9e1c20] resize-none"
                                    name='message'
                                    onChange={handleChange}
                                    value={formData.message}
                                ></textarea>
                                <PenTool className="absolute right-4 top-6 text-gray-400" size={18} />
                            </div>

                            {/* Submit Button */}
                            <button type="submit"
                                disabled={loading}
                                className="bg-[#9e1c20] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-[#a93a3e] cursor-pointer transition-colors duration-300 flex items-center gap-2 text-sm tracking-widest uppercase"
                            >
                                {loading ? 'Sending...' : 'Send Message Now'}
                                {!loading && <Send size={16} />}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </section>

            {/* ==================== 3. BOTTOM SECTION (MAP & INFO CARD) ==================== */}
            <section className="w-full pb-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-[40px] overflow-hidden shadow-2xl">

                        {/* --- CARD MÀU CAM (BÊN TRÁI) --- */}
                        <div className="lg:col-span-5 bg-[#ffe8d6] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
                            {/* Họa tiết nền mờ */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <img src="https://static.vecteezy.com/system/resources/previews/024/589/158/non_2x/olive-branch-black-sketch-isolated-on-white-background-hand-drawn-vector-illustration-retro-style-png.png" className="w-full h-full object-cover grayscale" />
                            </div>

                            <h4 className="text-[#F51E46] font-bold text-sm tracking-widest uppercase mb-2 relative z-10">Restaurant Location</h4>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 uppercase relative z-10">Visit Our Restaurant</h2>

                            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl w-full max-w-sm relative z-10 border border-white/60">
                                <p className="text-gray-600 font-medium mb-1">213 W Tomichi Ave, Gunnison, CO</p>
                                <p className="text-gray-500 text-sm mb-6">81230, United States</p>
                                <div className="w-10 h-1 bg-[#FFA500] mx-auto mb-6 rounded-full"></div>
                                <p className="text-gray-600 text-sm">Monday - Saturday: 9:00am - 10:00pm</p>
                                <p className="text-gray-600 text-sm">Sunday: Is the holiday</p>
                            </div>

                            <div className="flex gap-4 mt-8 relative z-10">
                                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#9e1c20] hover:text-white hover:border-[#9e1c20] transition-all duration-300">
                                        <Icon size={16} />
                                    </a>
                                ))}
                            </div>

                            {/* Hình Pizza trang trí góc phải dưới */}
                            <img src="https://png.pngtree.com/png-vector/20230321/ourmid/pngtree-modern-kitchen-food-boxed-pizza-png-image_6651523.png" className="absolute -bottom-10 -right-10 w-40 drop-shadow-xl" alt="pizza" />
                        </div>

                        {/* --- GOOGLE MAP (BÊN PHẢI) --- */}
                        <div className="lg:col-span-7 h-100 lg:h-auto bg-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69950787480477!3d10.77337428937517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b46163%3A0x142c653d97c09e90!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1709221834212!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale-20 contrast-125"
                            ></iframe>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;