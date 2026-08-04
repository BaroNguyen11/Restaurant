import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useLocation
import { MapPin, Phone, User, CreditCard, Banknote, CheckCircle, ArrowLeft, Trash, Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../api';
import { toast } from 'react-toastify';
import PaymentModal from '@/components/PaymentModal';
import useAddresses from '../../hooks/useAddresses';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access state passed from "Buy Again"
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); 
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    const {
        addresses,
        selectedAddressId,
        selectedAddress,
        selectAddress,
        addAddress,
        deleteAddress
    } = useAddresses(user?.id, user?.user_metadata);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: 'Home',
        fullName: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (selectedAddress) {
            setFormData({
                fullName: selectedAddress.fullName || '',
                phone: selectedAddress.phone || '',
                address: selectedAddress.address || ''
            });
        } else {
            setFormData({
                fullName: user?.user_metadata?.full_name || '',
                phone: '',
                address: ''
            });
        }
    }, [selectedAddress, user]);

    const handleAddAddressSubmit = (e) => {
        e.preventDefault();
        if (!newAddress.fullName || !newAddress.phone || !newAddress.address) {
            toast.warning("Please fill in all address details.");
            return;
        }
        addAddress(newAddress);
        setIsAddressModalOpen(false);
        setNewAddress({
            label: 'Home',
            fullName: '',
            phone: '',
            address: ''
        });
    };

    const handleDeleteAddress = (e, addrId) => {
        e.stopPropagation(); // Prevent card selection when clicking delete
        if (window.confirm("Are you sure you want to delete this address?")) {
            deleteAddress(addrId);
        }
    };

    // --- LOGIC: DETERMINE ITEMS TO CHECKOUT ---
    // Check if there is data from "Buy Again"
    const isDirectBuy = location.state?.isBuyAgain;
    const directItems = location.state?.directCheckoutItems || [];

    // If direct buy, use those items; otherwise, use cart
    const finalCheckoutItems = isDirectBuy ? directItems : cartItems;

    // Calculate total based on the selected items
    const calculateSubtotal = () => {
        if (isDirectBuy) {
            return directItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
        }
        return cartTotal;
    };

    const finalSubtotal = calculateSubtotal();
    const deliveryFee = 0.0; 
    const finalTotal = finalSubtotal + deliveryFee;
    // ------------------------------------------

    // Redirect if NO items to checkout (neither in cart nor direct buy)
    useEffect(() => {
        if (finalCheckoutItems.length === 0) {
            navigate('/order/order_food');
        }
    }, [finalCheckoutItems, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveOrderToDatabase = async (method) => {
        setLoading(true);
        try {
            const { error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: user ? user.id : null,
                    full_name: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    payment_method: method,
                    total_amount: finalTotal, // Use calculated total
                    status: method === 'VietQR' ? 'paid' : 'pending',
                    items: finalCheckoutItems // Use correct item list
                }])
                .single();

            if (orderError) throw orderError;

            // Only clear cart if it was a regular checkout
            if (!isDirectBuy) {
                clearCart();
            }

            if (method === 'cod') {
                toast.success('Order placed successfully!');
            }
            
            navigate('/my_order'); // Redirect to order history

        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
            setIsPaymentOpen(false);
        }
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.address) {
            toast.warning("Please fill in all shipping details.");
            return;
        }

        if (paymentMethod === 'cod') {
            saveOrderToDatabase('cod');
        } else {
            setIsPaymentOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-['Poppins'] pt-4 pb-20 ">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow hover:text-[#9e1c20]">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-black text-gray-900">
                        {isDirectBuy ? 'Checkout (Buy Again)' : 'Checkout'}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- LEFT COLUMN: INFO FORM --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-6"
                    >
                        {/* 1. Shipping Address */}
                        <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <MapPin className="text-[#9e1c20]" /> Shipping Address
                                </h3>
                                {user && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="flex items-center gap-1.5 text-xs font-bold text-[#9e1c20] hover:text-black transition-colors px-3 py-1.5 bg-[#fff8f0] rounded-xl cursor-pointer"
                                    >
                                        <Plus size={14} /> Add New Address
                                    </button>
                                )}
                            </div>

                            {!user ? (
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
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    {addresses.length === 0 ? (
                                        <div className="text-center py-6 text-gray-500 text-sm">
                                            No saved addresses found. Please add a new address to continue.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => selectAddress(addr.id)}
                                                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                                                        selectedAddressId === addr.id
                                                            ? 'border-[#9e1c20] bg-red-50/10 shadow-sm'
                                                            : 'border-gray-100 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="bg-black text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                            {addr.label}
                                                        </span>
                                                        {addr.isDefault && (
                                                            <span className="border border-gray-200 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                                Default
                                                            </span>
                                                        )}
                                                        {selectedAddressId === addr.id && (
                                                            <Check className="text-[#9e1c20] ml-auto" size={16} />
                                                        )}
                                                    </div>

                                                    <div className="font-bold text-sm text-gray-800 mb-1">{addr.fullName}</div>
                                                    <div className="text-xs text-gray-500 font-medium mb-2">{addr.phone}</div>
                                                    <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">{addr.address}</div>

                                                    {/* Delete Button */}
                                                    {addr.id !== 'addr_default' && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-1"
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedAddressId && (
                                        <div className="mt-6 bg-[#fff8f0] p-4.5 rounded-2xl border border-orange-100 text-xs text-gray-600 space-y-1">
                                            <div className="font-bold text-gray-800 text-sm">Giao tới địa chỉ đã chọn:</div>
                                            <div><span className="font-semibold text-gray-700">Khách hàng:</span> {formData.fullName} ({formData.phone})</div>
                                            <div><span className="font-semibold text-gray-700">Địa chỉ:</span> {formData.address}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. Payment Method (Same as before) */}
                        <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="text-[#9e1c20]" /> Payment Method
                            </h3>
                            <div className="space-y-3">
                                <label onClick={() => setPaymentMethod('cod')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#9e1c20] bg-red-50' : 'border-gray-100'}`}>
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

                                <label onClick={() => setPaymentMethod('banking')} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-[#9e1c20] bg-red-50' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'banking' ? 'border-[#9e1c20]' : 'border-gray-300'}`}>
                                            {paymentMethod === 'banking' && <div className="w-2.5 h-2.5 bg-[#9e1c20] rounded-full" />}
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-gray-800">
                                            <CreditCard size={20} /> Credit Card / Banking (VietQR)
                                        </div>
                                    </div>
                                    <CheckCircle size={20} className={paymentMethod === 'banking' ? 'text-[#9e1c20]' : 'text-gray-200'} />
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-100"
                    >
                        <div className="bg-white p-6 rounded-[30px] shadow-xl sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            {/* List Items (Dynamic Rendering) */}
                            <div className="max-h-75 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {finalCheckoutItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="w-16 h-16 bg-[#fff8f0] rounded-lg p-1 flex items-center justify-center shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-xs text-gray-400 font-bold">IMG</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                                        </div>
                                        <span className="font-bold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Calculations */}
                            <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">${finalSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                    <span className="text-lg font-bold text-gray-800">Total</span>
                                    <span className="text-2xl font-black text-[#9e1c20]">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !formData.phone || !formData.address}
                                className="w-full bg-[#9e1c20] text-white font-bold py-4 rounded-xl mt-6 hover:bg-[#be282d] transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Place Order'}
                            </button>

                            {!formData.address && <p className="text-xs text-red-500 text-center mt-2">Please enter address to checkout</p>}
                        </div>
                    </motion.div>

                </div>
            </div>
            
            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                totalAmount={finalTotal * 25000} // VND Conversion
                shippingInfo={formData}
                // Important: Pass the correct success callback
                onPaymentSuccess={() => saveOrderToDatabase('VietQR')}
            />
          
            {/* Modal thêm địa chỉ mới */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)}></div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 relative z-10"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Shipping Address</h3>
                        <form onSubmit={handleAddAddressSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address Label</label>
                                <div className="flex gap-2">
                                    {['Home', 'Office', 'Other'].map((lbl) => (
                                        <button
                                            type="button"
                                            key={lbl}
                                            onClick={() => setNewAddress({ ...newAddress, label: lbl })}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                                newAddress.label === lbl
                                                    ? 'bg-black text-white border-black shadow'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {lbl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recipient Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={newAddress.fullName}
                                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#9e1c20] text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="0386561120"
                                    value={newAddress.phone}
                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#9e1c20] text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detailed Address</label>
                                <textarea
                                    required
                                    rows="2"
                                    placeholder="House number, Street name, Ward, District, City..."
                                    value={newAddress.address}
                                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#9e1c20] text-sm resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#9e1c20] hover:bg-[#be282d] text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors text-sm cursor-pointer"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Checkout;