import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../api';
import { useAuth } from '../context/AuthContext'; // Giả sử bạn có AuthContext
import { ToastContainer, toast } from 'react-toastify';
// 👇 Nhận thêm prop shippingInfo (chứa tên, sđt, địa chỉ từ form cha)
const PaymentModal = ({ isOpen, onClose, totalAmount, shippingInfo }) => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth(); // Lấy user đang đăng nhập (nếu có)
    const [loading, setLoading] = useState(false);

    // Cấu hình VietQR
    const BANK_ID = "TCB"; // Ngân hàng Quân Đội
    const ACCOUNT_NO = "7902112005";
    const ACCOUNT_NAME = "NGUYEN VAN BAO";

    // Tạo nội dung chuyển khoản ngắn gọn: TASTENEST + Mã ngẫu nhiên
    const [orderContent] = useState(`TASTENEST ${Math.floor(1000 + Math.random() * 9000)}`);

    // Link QR
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${totalAmount}&addInfo=${orderContent}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const handleConfirmPayment = async () => {
        setLoading(true);
        try {
            // 👇 INSERT KHỚP VỚI BẢNG ORDERS CỦA BẠN
            const { error } = await supabase
                .from('orders')
                .insert([{
                    user_id: user ? user.id : null, // Nếu khách vãng lai thì null
                    full_name: shippingInfo.fullName,   // Lấy từ form nhập
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    payment_method: 'VietQR',       // Ghi chú là thanh toán QR
                    total_amount: totalAmount,      // Khớp cột total_amount
                    status: 'paid',                 // Đánh dấu đã thanh toán
                    items: cartItems                // Lưu danh sách món ăn (JSON)
                }]);

            if (error) throw error;

            toast.success('Payment successfully!')
            clearCart(); // Xóa giỏ hàng
            onClose();   // Đóng modal và có thể chuyển hướng về trang chủ

        } catch (err) {
            console.error("Lỗi thanh toán:", err);
            alert("Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl flex flex-col items-center font-['Poppins']"
                        >
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>

                            <h3 className="text-2xl font-black text-[#9e1c20] mb-2">Thanh toán QR</h3>
                            <p className="text-gray-500 text-sm mb-6 text-center">Quét mã để thanh toán đơn hàng</p>

                            {/* Ảnh QR */}
                            <div className="bg-[#fff8f0] p-4 rounded-2xl border-2 border-[#9e1c20] border-dashed mb-6 w-full flex justify-center">
                                <img src={qrUrl} alt="VietQR" className="w-full h-auto rounded-lg mix-blend-multiply max-w-75" />
                            </div>

                            <div className="w-full space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Khách hàng:</span>
                                    <span className="font-medium text-gray-900">{shippingInfo.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Số tiền:</span>
                                    <span className="font-bold text-xl text-[#9e1c20]">{totalAmount.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-sm items-center pt-2 border-t border-gray-200 mt-2">
                                    <span className="text-gray-500">Nội dung CK:</span>
                                    <div className="flex gap-2 items-center font-mono font-bold text-black bg-white px-2 py-1 rounded border border-gray-200">
                                        {orderContent}
                                        <Copy size={14} className="cursor-pointer text-gray-400 hover:text-[#9e1c20]" onClick={() => navigator.clipboard.writeText(orderContent)} />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmPayment}
                                disabled={loading}
                                className="w-full bg-[#9e1c20] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
                                {loading ? 'Đang xử lý...' : 'Xác nhận đã chuyển khoản'}
                            </button>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PaymentModal;