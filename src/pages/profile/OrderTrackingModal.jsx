import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, X, XCircle, CreditCard, FileText, ChefHat } from 'lucide-react';

const OrderTrackingModal = ({ order, onClose }) => {
    if (!order) return null;

    // 1. Kiểm tra COD
    const isCOD = order.payment_method?.toLowerCase() === 'cod';

    // 2. Định nghĩa các bước (STEPS)
    // Lưu ý: Mình đổi icon bước 2 thành ChefHat nếu là COD để hợp ngữ cảnh "Đang nấu"
    const STEPS = [
        { 
            id: 'step1', 
            label: 'Order Placed', 
            description: 'Order has been created', 
            icon: <Clock size={18} /> 
        },
        { 
            id: 'step2', 
            // Nếu COD -> Hiển thị "Preparing" (Đang nấu)
            // Nếu Online -> Hiển thị "Payment Confirmed"
            label: isCOD ? 'Preparing Order' : 'Payment Confirmed', 
            description: isCOD ? 'Kitchen is preparing your meal' : 'Seller has received payment', 
            icon: isCOD ? <ChefHat size={18} /> : <CheckCircle size={18} /> 
        },
        { 
            id: 'step3', 
            label: 'On Delivery', 
            description: 'Driver is on the way', 
            icon: <Truck size={18} /> 
        },
        { 
            id: 'step4', 
            label: 'Delivered', 
            description: 'Enjoy your meal!', 
            icon: <Package size={18} /> 
        },
    ];

    // 3. LOGIC ÁNH XẠ TRẠNG THÁI (QUAN TRỌNG)
    // Map từ status trong DB (Admin set) -> Index của Step
    let currentStepIndex = 0;
    const status = order.status; // pending, cooking, delivering, completed

    // --- LOGIC CHO COD ---
    if (isCOD) {
        if (status === 'pending') currentStepIndex = 0;      // Bước 1: Mới đặt
        if (status === 'cooking') currentStepIndex = 1;      // Bước 2: Đang nấu (Admin bấm Start Cooking)
        if (status === 'delivering') currentStepIndex = 2;   // Bước 3: Đang giao (Admin bấm Start Delivering)
        if (status === 'completed') currentStepIndex = 3;    // Bước 4: Hoàn thành (Admin bấm Mark Completed)
    } 
    // --- LOGIC CHO ONLINE PAYMENT ---
    else {
        // Với online, thường 'pending' là chưa thanh toán (Bước 0)
        // 'paid' là đã thanh toán -> Bước 1 (Payment Confirmed)
        // Nhưng nếu Admin chuyển sang 'cooking' -> Vẫn coi là đã qua bước thanh toán (Bước 1 hoặc 2 tùy logic)
        
        if (status === 'pending') currentStepIndex = 0; 
        if (status === 'paid') currentStepIndex = 1;
        
        // Nếu Admin đã chuyển sang cooking/delivering thì chắc chắn đã qua bước thanh toán
        if (status === 'cooking') currentStepIndex = 1; 
        if (status === 'delivering') currentStepIndex = 2;
        if (status === 'completed') currentStepIndex = 3;
    }

    const isCancelled = status === 'cancelled';

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-['Poppins']">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Header Modal */}
                <div className="bg-[#9e1c20] p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Tracking Details</h3>
                        <p className="text-white/80 text-sm">Order ID: #{order.id}</p>
                    </div>
                    <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    
                    {/* Delivery Info Block (Giữ nguyên) */}
                    <div className="mb-8 border-b border-gray-100 pb-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="bg-red-50 p-3 rounded-full text-[#9e1c20]">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Delivery Address</h4>
                                <p className="text-gray-500 text-sm mt-1">{order.address || "No address provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Payment Info</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-500 text-sm">Method:</span>
                                    <span className="font-bold text-gray-800 uppercase bg-gray-100 px-2 py-0.5 rounded text-xs">
                                        {order.payment_method}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">
                                    Current Status: <span className={`font-bold uppercase ${status === 'completed' ? 'text-green-600' : 'text-[#9e1c20]'}`}>{status}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Rendering (Giữ nguyên logic cũ) */}
                    {isCancelled ? (
                         <div className="flex flex-col items-center justify-center py-8 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                            <XCircle size={48} className="mb-2" />
                            <h4 className="text-xl font-bold">Order Cancelled</h4>
                            <p className="text-gray-500 text-sm text-center px-4">This order has been cancelled.</p>
                        </div>
                    ) : (
                        <div className="relative pl-4 border-l-2 border-gray-300 space-y-8">
                            {STEPS.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.id} className="relative pl-8">
                                        <div className={`absolute -left-9 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
                                            isCompleted 
                                                ? 'bg-[#9e1c20] border-white text-white shadow-lg scale-110' 
                                                : 'bg-gray-100 border-white text-gray-300'
                                        }`}>
                                            {step.icon}
                                        </div>

                                        <div className={`transition-all duration-300 ${isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                            <h4 className={`font-bold text-base ${isCurrent ? 'text-[#9e1c20] text-lg' : 'text-gray-900'}`}>
                                                {step.label}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                            
                                            {/* Hiển thị thời gian nếu là bước hiện tại */}
                                            {isCurrent && (
                                                <div className="mt-2 inline-flex items-center gap-1 bg-red-50 text-[#9e1c20] px-3 py-1 rounded-lg text-xs font-bold border border-red-100">
                                                    <Clock size={12} />
                                                    {new Date(order.updated_at || order.created_at).toLocaleTimeString()} - {new Date(order.updated_at || order.created_at).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                        Close Details
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default OrderTrackingModal;