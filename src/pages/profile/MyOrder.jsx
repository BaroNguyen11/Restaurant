
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, ChevronRight, ChevronLeft, Truck, CheckCircle, Clock, MapPin, XCircle, X, Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import ReactPaginate from 'react-paginate'
import { supabase } from '../../api';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderTrackingModal from './OrderTrackingModal';
import OrderDetailModal from './OrderDetailModal';



// --- 2. COMPONENT CHÍNH ---
const MyOrder = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;
    const [selectedOrder, setSelectedOrder] = useState(null);
    // State để mở modal tracking
    const [trackingOrder, setTrackingOrder] = useState(null);

    const endOffset = itemOffset + itemsPerPage;
    const currentOrders = orders.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(orders.length / itemsPerPage);

    const [loading, setLoading] = useState(true);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % orders.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };
    const handleBuyAgain = (order) => {
        const itemsToCheckout = order.items.map(item => ({
            id: item.product_id || item.id, // Lấy ID sản phẩm
            name: item.name || item.product_name, // Lấy tên
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image,
            // Tính lại tổng tiền của item đó (nếu cần)
            totalPrice: Number(item.price) * item.quantity
        }));

        navigate('/checkout', {
            state: {
                directCheckoutItems: itemsToCheckout,
                isBuyAgain: true // Cờ đánh dấu để biết đây là mua lại
            }
        });
    };
    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9e1c20]"></div>
            </div>
        )
    }

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 mt-4">
                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/menu')} className="text-[#9e1c20] font-bold underline">Start Ordering</button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {currentOrders.map((order) => (
                                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group relative">
                                    {/* Header Card */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-gray-50 pb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-gray-900">Order #{order.id}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{order.payment_method}</span>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="block text-sm text-gray-500">Total Amount</span>
                                            <span className="block text-xl font-black text-[#9e1c20]">${Number(order.total_amount).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-2 mb-4">
                                        {order.items && order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <span className="font-bold text-gray-400">{item.quantity}x</span>
                                                    <span>{item.name || item.product_name}</span>
                                                </div>
                                                <span className="text-gray-500 font-medium">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                        {order.items && order.items.length > 2 && (
                                            <div className="pt-2">
                                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                                                    + {order.items.length - 2} more items
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Card with Action Button */}
                                    <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                                        {/* Nút Xem Chi Tiết (Mới) */}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold cursor-pointer"
                                        >
                                            <Eye size={16} /> Details
                                        </button>

                                        {/* Nút Track Order */}
                                        <button
                                            onClick={() => setTrackingOrder(order)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-bold cursor-pointer"
                                        >
                                            <Truck size={16} /> Track
                                        </button>

                                        {/* Nút Mua lại */}
                                        {order.status === 'completed' ?
                                            <button
                                                className="px-4 py-2 bg-[#9e1c20] text-white rounded-lg hover:bg-[#bd2d32] transition-colors text-sm font-bold cursor-pointer"
                                                onClick={() => handleBuyAgain(order)}
                                            >
                                                Buy Again
                                            </button> : ''
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pageCount > 1 && (
                            <div className="mt-8 flex justify-center pb-8">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel={
                                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-[#9e1c20] hover:text-white hover:border-[#9e1c20] transition-all">
                                            <ChevronRight size={20} />
                                        </span>
                                    }
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    pageCount={pageCount}
                                    previousLabel={
                                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-[#9e1c20] hover:text-white hover:border-[#9e1c20] transition-all">
                                            <ChevronLeft size={20} />
                                        </span>
                                    }
                                    renderOnZeroPageCount={null}
                                    containerClassName="flex items-center gap-2"
                                    pageClassName="block"
                                    pageLinkClassName="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    activeLinkClassName="!bg-[#9e1c20] !text-white !border-[#9e1c20] shadow-md"
                                    disabledClassName="opacity-50 cursor-not-allowed"
                                />
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* --- RENDER MODAL KHI CÓ ORDER ĐƯỢC CHỌN --- */}
            <AnimatePresence>
                {trackingOrder && (
                    <OrderTrackingModal
                        order={trackingOrder}
                        onClose={() => setTrackingOrder(null)}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default MyOrder;
