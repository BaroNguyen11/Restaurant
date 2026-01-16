import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, CreditCard, DollarSign, Calendar } from 'lucide-react';

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-['Poppins']">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                        <p className="text-sm text-gray-500">#{order.id} • {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* Danh sách món ăn (Full list) */}
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Items List ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-4 mb-8">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    {/* Ảnh món (Placeholder nếu không có) */}
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-gray-400 font-bold">IMG</span>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-sm">{item.name || item.product_name}</h5>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-[#9e1c20]">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Thông tin thanh toán */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-gray-100 bg-blue-50/50">
                            <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                                <CreditCard size={18} /> Payment Info
                            </div>
                            <p className="text-sm text-gray-600">Method: <span className="font-bold uppercase">{order.payment_method}</span></p>
                            <p className="text-sm text-gray-600">Status: <span className="font-bold uppercase">{order.status}</span></p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 bg-green-50/50">
                            <div className="flex items-center gap-2 mb-2 text-green-800 font-bold">
                                <DollarSign size={18} /> Total Summary
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${Number(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-[#9e1c20] mt-2 pt-2 border-t border-green-100">
                                <span>Total</span>
                                <span>${Number(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetailModal;