import React, { useState, useEffect } from 'react';
import { 
    Search, Eye, Filter, CheckCircle, Clock, 
    Truck, XCircle, ChefHat, Printer, X 
} from 'lucide-react';
import { supabase } from '../api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // State cho Modal chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Danh sách các Tab trạng thái
    const tabs = ['All', 'pending', 'cooking', 'delivering', 'completed', 'cancelled'];

    // 1. Fetch Orders
    const fetchOrders = async () => {
        setLoading(true);
        let query = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false }); // Đơn mới nhất lên đầu

        const { data, error } = await query;
        
        if (error) toast.error("Lỗi tải đơn hàng: " + error.message);
        else setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        
        // (Nâng cao) Bạn có thể thêm Supabase Realtime ở đây để đơn tự nhảy vào
        const subscription = supabase
            .channel('orders_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // 2. Xử lý cập nhật trạng thái đơn
    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(true);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            toast.error("Lỗi cập nhật: " + error.message);
        } else {
            toast.success(`Đơn hàng đã chuyển sang: ${newStatus}`);
            fetchOrders(); // Reload lại list
            
            // Cập nhật luôn state của modal đang mở
            if (selectedOrder) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        }
        setUpdating(false);
    };

    // Helper: Màu sắc cho Badge trạng thái
    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cooking': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'delivering': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Helper: Icon cho Badge
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'cooking': return <ChefHat size={14} />;
            case 'delivering': return <Truck size={14} />;
            case 'completed': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return null;
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchSearch = order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            order.id.toString().includes(searchTerm);
        return matchStatus && matchSearch;
    });

    return (
        <div className="p-6 bg-[#f4f7fe] min-h-screen ml-64 font-['Poppins'] text-gray-800">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Order Management</h1>
                    <p className="text-gray-500 text-sm">Track and manage customer orders</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search order ID or customer..." 
                        className="pl-10 pr-4 py-2.5 bg-white border-none rounded-xl shadow-sm outline-none w-64 focus:ring-2 focus:ring-[#9e1c20]/20 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABS TRẠNG THÁI --- */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilterStatus(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${
                            filterStatus === tab 
                            ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' 
                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- ORDERS TABLE --- */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase border-b border-gray-100">
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Payment</th>
                                <th className="p-4 font-bold">Total</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No orders found.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">#{order.id}</td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()} <br/>
                                            <span className="text-xs">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{order.full_name || 'Guest'}</div>
                                            <div className="text-xs text-gray-400">{order.phone}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 capitalize">{order.payment_method}</td>
                                        <td className="p-4 font-bold text-[#9e1c20]">${Number(order.total_amount).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)} capitalize`}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                                                className="p-2 bg-gray-100 hover:bg-[#9e1c20] hover:text-white rounded-lg text-gray-600 transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    Order #{selectedOrder.id}
                                    <span className={`text-xs px-2 py-0.5 rounded border capitalize ${getStatusStyle(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Cột Trái: Danh sách món */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Order Items</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                {/* Ảnh món (nếu có lưu trong items, ko thì dùng placeholder) */}
                                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-gray-300 font-bold border border-gray-200">
                                                    {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg"/> : 'IMG'}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{item.name || item.product_name}</h4>
                                                    <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
                                                </div>
                                                <div className="font-bold text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className="font-bold text-gray-500">Total Amount</span>
                                        <span className="text-2xl font-black text-[#9e1c20]">${Number(selectedOrder.total_amount).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Cột Phải: Thông tin khách & Hành động */}
                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            Customer Details
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="block text-gray-400 text-xs uppercase font-bold">Name</span>
                                                <span className="font-medium text-gray-800">{selectedOrder.full_name}</span>
                                            </div>
                                            <div>
                                                <span className="block text-gray-400 text-xs uppercase font-bold">Phone</span>
                                                <span className="font-medium text-gray-800">{selectedOrder.phone}</span>
                                            </div>
                                            <div>
                                                <span className="block text-gray-400 text-xs uppercase font-bold">Address</span>
                                                <span className="font-medium text-gray-800">{selectedOrder.address}</span>
                                            </div>
                                            {/* Nếu có ghi chú */}
                                            {selectedOrder.note && (
                                                <div className="pt-2 border-t border-gray-200 mt-2">
                                                    <span className="block text-gray-400 text-xs uppercase font-bold">Note</span>
                                                    <span className="italic text-gray-600">"{selectedOrder.note}"</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-gray-900">Update Status</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedOrder.status === 'pending' && (
                                                <button 
                                                    disabled={updating}
                                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cooking')}
                                                    className="col-span-2 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                                >
                                                    <ChefHat size={18} /> Start Cooking
                                                </button>
                                            )}
                                            
                                            {selectedOrder.status === 'cooking' && (
                                                <button 
                                                    disabled={updating}
                                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivering')}
                                                    className="col-span-2 bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                                >
                                                    <Truck size={18} /> Start Delivering
                                                </button>
                                            )}

                                            {selectedOrder.status === 'delivering' && (
                                                <button 
                                                    disabled={updating}
                                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                                                    className="col-span-2 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={18} /> Mark Completed
                                                </button>
                                            )}

                                            {/* Nút hủy lúc nào cũng hiện nếu chưa xong */}
                                            {['pending', 'cooking'].includes(selectedOrder.status) && (
                                                <button 
                                                    disabled={updating}
                                                    onClick={() => { if(window.confirm('Hủy đơn này?')) handleUpdateStatus(selectedOrder.id, 'cancelled') }}
                                                    className="col-span-2 border-2 border-red-100 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            
                                            <button className="col-span-2 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                                                <Printer size={18} /> Print Invoice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminOrders;