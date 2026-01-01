import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../api'; // Import Supabase Client
import { Link } from 'react-router-dom';

const OrderTable = () => {
  // State quản lý dữ liệu Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý gửi Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Gửi dữ liệu lên Supabase
      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            date: formData.date,
            time: formData.time,
            guests: formData.guests,
            message: formData.message,
            status: 'pending' // Mặc định là chờ xác nhận
          }
        ]);

      if (error) throw error;

      // Thành công
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: 2, message: '' }); // Reset form

    } catch (error) {
      console.error('Error booking:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white font-['Poppins'] pt-24 pb-20">
      
      {/* --- HEADER BANNER --- */}
      <section className="relative w-full h-75 bg-[#fff8f0] flex flex-col items-center justify-center overflow-hidden px-4 mb-16">
         {/* Họa tiết trang trí */}
         <motion.img animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png" className="absolute top-10 left-10 w-24 opacity-20 grayscale" alt="pizza" />
         
         <div className="z-10 text-center">
            <h4 className="text-[#F51E46] font-bold text-sm tracking-widest uppercase mb-2">Reservation</h4>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2">Book A Table</h1>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
            
            {/* 1. FORM SECTION (LEFT) */}
            <div className="w-full lg:w-3/5 p-8 md:p-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Book Your Table</h2>
                    <p className="text-gray-500">We offer a wide variety of delicious food. Book your table now to have the best experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Your Name *</label>
                            <div className="relative">
                                <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe" className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all" />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Phone Number *</label>
                            <div className="relative">
                                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+1 234 567 890" className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all" />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Email Address</label>
                            <div className="relative">
                                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="email@example.com" className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all" />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Person *</label>
                            <div className="relative">
                                <select name="guests" value={formData.guests} onChange={handleChange} className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all appearance-none cursor-pointer">
                                    {[1,2,3,4,5,6,8,10,12].map(num => (
                                        <option key={num} value={num}>{num} People</option>
                                    ))}
                                </select>
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Date *</label>
                            <div className="relative">
                                <input required name="date" value={formData.date} onChange={handleChange} type="date" className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all cursor-pointer" />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Time *</label>
                            <div className="relative">
                                <input required name="time" value={formData.time} onChange={handleChange} type="time" className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all cursor-pointer" />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="relative">
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Special Request</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Any special request? (e.g. Birthday, Anniversary, Window seat)" className="w-full bg-gray-50 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all resize-none"></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading}
                        className="w-full bg-[#9e1c20] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : 'Book A Table Now'}
                    </button>

                    {/* Feedback Message */}
                    {status === 'success' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 border border-green-200">
                            <CheckCircle size={20} />
                            <span><strong>Success!</strong> Your reservation has been sent. We will confirm shortly.</span>
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-200">
                            <AlertCircle size={20} />
                            <span><strong>Error!</strong> Something went wrong. Please try again later.</span>
                        </motion.div>
                    )}
                </form>
            </div>

            {/* 2. IMAGE SECTION (RIGHT) */}
            <div className="w-full lg:w-2/5 relative min-h-100 lg:min-h-full">
                <img 
                    src="https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg" 
                    alt="Restaurant Interior" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-8">
                    <h3 className="text-3xl font-black font-['Oleo_Script'] mb-4 text-[#FFA500]">Opening Hours</h3>
                    <div className="space-y-2 font-medium">
                        <p>Monday - Friday</p>
                        <p className="text-xl font-bold mb-4">09:00 AM - 10:00 PM</p>
                        <p>Saturday - Sunday</p>
                        <p className="text-xl font-bold">10:00 AM - 11:00 PM</p>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-white/30 w-full">
                        <p className="text-sm opacity-80 mb-2">Need Help?</p>
                        <p className="text-2xl font-black text-[#FFA500]">+123 456 7890</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTable;