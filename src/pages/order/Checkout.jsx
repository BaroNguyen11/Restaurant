import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, CreditCard, Banknote, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'banking'

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    // Nếu user đã đăng nhập, tự điền thông tin
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.user_metadata?.full_name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    // Nếu giỏ hàng trống, đá về trang menu
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/order/order_food');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Tạo đơn hàng trong bảng 'orders'
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: user ? user.id : null,
                        full_name: formData.fullName,
                        phone: formData.phone,
                        address: formData.address,
                        payment_method: paymentMethod,
                        total_amount: cartTotal + 5, // +5$ ship
                        status: 'pending'
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Lưu chi tiết từng món vào 'order_items'
            if (orderData) {
                const itemsToInsert = cartItems.map(item => ({
                    order_id: orderData.id,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.salePrice || item.price
                }));

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(itemsToInsert);

                if (itemsError) throw itemsError;

                // 3. Thành công: Xóa giỏ hàng & Chuyển trang thông báo
                clearCart();
                alert("Order placed successfully! We will contact you soon.");
               navigate('/order/order_food');
            }

        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-['Poppins'] pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button onClick={() => navigate('/order')} className="p-2 bg-white rounded-full shadow hover:text-[#9e1c20]">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- CỘT TRÁI: FORM THÔNG TIN --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-6"
                    >
                        {/* 1. Shipping Address */}
                        <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MapPin className="text-[#9e1c20]" /> Shipping Address
                            </h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+1 234 567 890" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20]" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                                    <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="2" placeholder="123 Street, City, Country" className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20] resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Note (Optional)</label>
                                    <input name="note" value={formData.note} onChange={handleInputChange} type="text" placeholder="Note for chef or driver..." className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20]" />
                                </div>
                            </form>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="text-[#9e1c20]" /> Payment Method
                            </h3>
                            <div className="space-y-3">
                                {/* Option 1: COD */}
                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#9e1c20] bg-red-50' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#9e1c20]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#9e1c20] rounded-full" />}
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-gray-800">
                                            <Banknote size={20} /> Cash On Delivery
                                        </div>
                                    </div>
                                    <CheckCircle size={20} className={paymentMethod === 'cod' ? 'text-[#9e1c20]' : 'text-gray-200'} />
                                </label>

                                {/* Option 2: Banking */}
                                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-[#9e1c20] bg-red-50' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'banking' ? 'border-[#9e1c20]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'banking' && <div className="w-2.5 h-2.5 bg-[#9e1c20] rounded-full" />}
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-gray-800">
                                            <CreditCard size={20} /> Credit Card / Banking
                                        </div>
                                    </div>
                                    <CheckCircle size={20} className={paymentMethod === 'banking' ? 'text-[#9e1c20]' : 'text-gray-200'} />
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- CỘT PHẢI: ORDER SUMMARY --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-100"
                    >
                        <div className="bg-white p-6 rounded-[30px] shadow-xl sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            {/* List Items */}
                            <div className="max-h-75 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-[#fff8f0] rounded-lg p-1 flex items-center justify-center shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.quantity} x ${item.salePrice || item.price}</p>
                                        </div>
                                        <span className="font-bold text-gray-900">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Calculations */}
                            <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold text-gray-900">$5.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                    <span className="text-lg font-bold text-gray-800">Total</span>
                                    <span className="text-2xl font-black text-[#9e1c20]">${(cartTotal + 5).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !formData.phone || !formData.address}
                                className="w-full bg-[#9e1c20] text-white font-bold py-4 rounded-xl mt-6 hover:bg-black transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Place Order'}
                            </button>

                            {!formData.address && <p className="text-xs text-red-500 text-center mt-2">Please enter address to checkout</p>}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;