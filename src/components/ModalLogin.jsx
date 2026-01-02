import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Nhớ import hook useCart

const ModalLogin = () => {
  const navigate = useNavigate();
  // Lấy state từ Context
  const { showLoginModal, setShowLoginModal } = useCart();

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate('/signin');
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          
          {/* Lớp nền tối mờ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Hộp Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[30px] p-8 max-w-sm w-full shadow-2xl relative z-10 font-['Poppins'] text-center overflow-hidden"
          >
            {/* Nút đóng X góc phải */}
            <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>

            {/* Icon trang trí */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#9e1c20] relative">
               <ShoppingBag size={32} />
               <div className="absolute bottom-0 right-0 bg-[#9e1c20] text-white p-1.5 rounded-full border-2 border-white">
                    <LogIn size={12} />
               </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Please sign in to access your cart, save your favorite items, and checkout seamlessly.
            </p>

            {/* Các nút bấm */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#9e1c20] hover:bg-black transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn size={18} />
                Go to Sign In
              </button>
              
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Cancel, I'll browse first
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalLogin;