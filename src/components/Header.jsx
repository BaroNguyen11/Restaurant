import React, { useState } from 'react';
import Navbar from "./Navbar";
import CartSidebar from "./CardSidebar";
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
const Header = () => {
    const { toggleCart, cartCount, clearCart } = useCart();
    const { user, signOut } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleConfirmLogout = () => {
        signOut();
        clearCart();
        setShowLogoutModal(false);
        // Có thể thêm navigate('/') nếu cần
    };
    return (
        <>
            <header className="flex justify-around items-center fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50 px-4 md:px-8 ">
                <Link to='/'>
                    <div className="flex items-center gap-2">
                        <img src="https://jdtxfefnikvizdpsyjni.supabase.co/storage/v1/object/public/image/logo.png" alt="Logo" className="w-30" />
                    </div>
                </Link>
                <Navbar />
                <div className="flex items-center gap-3">
                    <button className="hover:text-[#9e1c20] transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* NÚT GIỎ HÀNG (Đã update logic) */}
                    <button
                        onClick={toggleCart} // 4. Sự kiện mở giỏ hàng
                        className="relative hover:text-[#9e1c20] transition-colors group cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                        </svg>

                        {/* 5. Badge số lượng (Chỉ hiện khi > 0) */}
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#9e1c20] text-white text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-white">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <div className="ml-4 flex items-center gap-4">
                        {user ? (
                            // Nếu ĐÃ Login -> Hiện Avatar & Nút Logout
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{user.user_metadata.full_name}</p>
                                    <p className="text-xs text-gray-500">Member</p>
                                </div>
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full border-2 border-[#9e1c20]"
                                />
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/signin">
                                <button

                                    className="flex items-center gap-2 bg-[#9e1c20] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#a2383c] transition-colors shadow-lg cursor-pointer"
                                >
                                    <User size={16} /> Sign in
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

            </header>
            <CartSidebar />
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">

                        {/* Lớp nền mờ màu đen */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutModal(false)} // Bấm ra ngoài thì đóng
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Hộp Modal chính */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[30px] p-8 max-w-sm w-full shadow-2xl relative z-10 font-['Poppins'] text-center overflow-hidden"
                        >
                            {/* Trang trí nền mờ (Optional) */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#9e1c20]"></div>

                            {/* Icon cảnh báo */}
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#9e1c20]">
                                <LogOut size={32} strokeWidth={2.5} className="ml-1" />
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2">Log Out?</h3>
                            <p className="text-gray-500 mb-8 text-sm">
                                Are you sure you want to log out? You will need to sign in again to access your account.
                            </p>

                            {/* Các nút bấm */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmLogout}
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-[#9e1c20] hover:bg-black transition-colors shadow-lg shadow-red-200"
                                >
                                    Yes, Logout
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
export default Header;