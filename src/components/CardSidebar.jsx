import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Import context vừa tạo
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop mờ (Click ra ngoài để đóng) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/50 z-60 backdrop-blur-sm"
                    />

                    {/* Cart Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-112.5 bg-white z-70 shadow-2xl flex flex-col font-['Poppins']"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-[#fff8f0]">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                Your Cart <ShoppingBag className="text-[#9e1c20]" />
                            </h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-white rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Body: Danh sách món */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                                    <ShoppingBag size={64} className="mb-4 text-gray-300" />
                                    <p className="text-lg font-bold">Your cart is empty</p>
                                    <p className="text-sm">Go explore our delicious menu!</p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm"
                                    >
                                        {/* Ảnh */}
                                        <div className="w-20 h-20 bg-[#fff8f0] rounded-xl shrink-0 flex items-center justify-center">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                                        </div>

                                        {/* Thông tin */}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-[#9e1c20] font-bold text-sm">
                                                ${(item.salePrice || item.price).toFixed(2)}
                                            </p>

                                            {/* Bộ điều khiển số lượng nhỏ */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center bg-gray-100 rounded-full h-7 px-1">
                                                    <button onClick={() => updateQuantity(item.id, 'minus')} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-xs hover:text-[#9e1c20]"><Minus size={10} /></button>
                                                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 'plus')} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-xs hover:text-[#9e1c20]"><Plus size={10} /></button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nút xóa */}
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer: Tổng tiền & Checkout */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-2xl font-black text-[#9e1c20]">${cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        toggleCart(); // Đóng giỏ hàng nhỏ lại
                                        navigate('/checkout'); // Chuyển sang trang thanh toán
                                    }}
                                    className="w-full bg-[#9e1c20] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 hover:bg-black transition-all active:scale-95"
                                >
                                    Checkout Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;