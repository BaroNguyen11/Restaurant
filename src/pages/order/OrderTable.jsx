import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../api';
import {toast} from 'react-toastify'

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
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({}); // <--- 1. State lưu lỗi

    // Xử lý thay đổi input (khi gõ thì xóa lỗi cũ đi)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Xóa lỗi của trường đang nhập
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };
    useEffect(() => {
        if (status === 'success') {
            toast.success('Your reservation has been sent!');
        }

        if (status === 'error') {
            toast.error('Something went wrong!');
        }
    }, [status]);
    // --- 2. HÀM VALIDATE ---
    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        // 1. Validate Phone (Số VN: 10 số, bắt đầu bằng 03, 05, 07, 08, 09)
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        if (!formData.phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
        }

        // 2. Validate Date & Time (Không được chọn quá khứ)
        if (!formData.date) {
            newErrors.date = "Vui lòng chọn ngày";
        }
        if (!formData.time) {
            newErrors.time = "Vui lòng chọn giờ";
        }

        if (formData.date && formData.time) {
            // Tạo đối tượng Date từ dữ liệu nhập vào
            const bookingDateTime = new Date(`${formData.date}T${formData.time}`);

            if (bookingDateTime < today) {
                newErrors.dateTime = "Thời gian đặt bàn không được ở quá khứ";
            }

            // (Tuỳ chọn) Kiểm tra giờ mở cửa: 9h sáng - 10h tối
            const hour = parseInt(formData.time.split(':')[0]);
            if (hour < 9 || hour > 22) {
                newErrors.dateTime = "Nhà hàng chỉ mở cửa từ 09:00 - 22:00";
            }
        }

        setErrors(newErrors);
        // Nếu không có key lỗi nào thì trả về true (hợp lệ)
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý gửi Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chạy validate trước khi gửi
        if (!validateForm()) {
            return; // Dừng lại nếu có lỗi
        }

        setLoading(true);
        setStatus(null);

        try {
            const { error } = await supabase
                .from('reservations')
                .insert([{
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    date: formData.date,
                    time: formData.time,
                    guests: formData.guests,
                    message: formData.message,
                    status: 'pending'
                }]);

            if (error) throw error;

            setStatus('success');
            setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: 2, message: '' });

        } catch (error) {
            console.error('Error booking:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white font-['Poppins'] pb-20">
            {/* ... (Phần Header Banner giữ nguyên) ... */}
            <section className="relative w-full h-75 bg-[#fff8f0] flex flex-col items-center justify-center overflow-hidden px-4 mb-16">
                <motion.img animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png" className="absolute top-10 left-10 w-24 opacity-20 grayscale" alt="pizza" />
                <div className="z-10 text-center">
                    <h4 className="text-[#F51E46] font-bold text-sm tracking-widest uppercase mb-2">Reservation</h4>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2">Book A Table</h1>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">

                    {/* FORM SECTION */}
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

                                {/* Phone - CÓ HIỂN THỊ LỖI */}
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Phone Number *</label>
                                    <div className="relative">
                                        <input
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="0912 345 678"
                                            className={`w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all`}
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                    {/* Dòng báo lỗi đỏ */}
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
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
                                            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                                                <option key={num} value={num}>{num} People</option>
                                            ))}
                                        </select>
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* Date - CÓ HIỂN THỊ LỖI */}
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Date *</label>
                                    <div className="relative">
                                        <input
                                            required
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            type="date"
                                            className={`w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border ${errors.dateTime || errors.date ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#9e1c20] transition-all cursor-pointer`}
                                        />
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* Time - CÓ HIỂN THỊ LỖI */}
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Time *</label>
                                    <div className="relative">
                                        <input
                                            required
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            type="time"
                                            className={`w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl border ${errors.dateTime || errors.time ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#9e1c20] transition-all cursor-pointer`}
                                        />
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Thông báo lỗi chung cho ngày giờ nếu chọn quá khứ */}
                            {errors.dateTime && <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100 text-center">{errors.dateTime}</p>}

                            {/* Message */}
                            <div className="relative">
                                <label className="text-sm font-bold text-gray-700 mb-1 block">Special Request</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Any special request? (e.g. Birthday, Anniversary)" className="w-full bg-gray-50 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20] transition-all resize-none"></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={loading}
                                className="w-full bg-[#9e1c20] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#b23c40] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? 'Processing...' : 'Book A Table Now'}
                            </button>

                           
                        </form>
                    </div>

                    {/* IMAGE SECTION */}
                    <div className="w-full lg:w-2/5 relative min-h-100 lg:min-h-full">
                        <img src="https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg" alt="Restaurant Interior" className="absolute inset-0 w-full h-full object-cover" />
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