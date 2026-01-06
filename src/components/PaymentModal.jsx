import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, totalAmount, shippingInfo }) => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const [orderId, setOrderId] = useState(null);
    const [qrUrl, setQrUrl] = useState('');

    // --- CẤU HÌNH NGÂN HÀNG ---
    const BANK_ID = "MB";
    const ACCOUNT_NO = "0386561120";
    const ACCOUNT_NAME = "NGUYEN VAN BAO";
    const TEMPLATE = "compact2"; // Mẫu QR gọn

    // 1. Khi mở Modal -> Tạo đơn hàng PENDING
    useEffect(() => {
        if (isOpen && !orderId) {
            createPendingOrder();
        }
    }, [isOpen]);

    const createPendingOrder = async () => {
        try {
            // Tạo đơn hàng trạng thái 'pending'
            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    user_id: user ? user.id : null,
                    full_name: shippingInfo.fullName,
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    payment_method: 'VietQR',
                    total_amount: totalAmount,
                    status: 'pending',
                    items: cartItems
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setOrderId(data.id);
                // Tạo nội dung CK: TASTENEST + ID đơn hàng
                const content = `TASTENEST ${data.id}`;

                // Tạo link ảnh QR trực tiếp (Không bao giờ lỗi)
                const link = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${totalAmount}&addInfo=${content}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
                setQrUrl(link);
            }
        } catch (error) {
            console.error("Lỗi tạo đơn:", error);
            toast.error("Lỗi tạo đơn hàng, vui lòng thử lại!");
        }
    };

    // 2. Lắng nghe Realtime: Tiền về -> Tự động đóng Modal
    useEffect(() => {
        if (!orderId) return;

        const channel = supabase
            .channel(`order_check_${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    // Nếu trạng thái đổi sang 'paid'
                    if (payload.new.status === 'paid') {
                        toast.success("Thanh toán thành công! Cảm ơn bạn.");
                        clearCart(); 
                        setTimeout(() => {
                            onClose();
                        }, 2000);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl flex flex-col items-center font-['Poppins']"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>

                        <h3 className="text-2xl font-black text-[#9e1c20] mb-2">Thanh toán QR</h3>
                        <p className="text-gray-500 text-sm mb-6 text-center">Mở App ngân hàng để quét mã</p>

                        {/* Khu vực hiển thị QR */}
                        <div className="bg-[#fff8f0] p-4 rounded-2xl border-2 border-[#9e1c20] border-dashed mb-6 w-full flex justify-center min-h-[300px] items-center">
                            {qrUrl ? (
                                <img src={qrUrl} alt="VietQR" className="w-full h-auto rounded-lg mix-blend-multiply" />
                            ) : (
                                <Loader2 className="animate-spin text-[#9e1c20]" size={40} />
                            )}
                        </div>

                        <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tiền:</span>
                                <span className="font-bold text-[#9e1c20] text-lg">{totalAmount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Nội dung:</span>
                                <div className="flex gap-2 items-center font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                    {orderId ? `TASTENEST ${orderId}` : '...'}
                                    <Copy size={14} className="cursor-pointer hover:text-red-500" onClick={() => navigator.clipboard.writeText(`TASTENEST ${orderId}`)} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg w-full justify-center">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Hệ thống đang chờ tiền về...</span>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;