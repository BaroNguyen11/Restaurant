import React, { useState, useEffect } from 'react';
import { 
    Calendar, Clock, Users, Phone, Search, 
    CheckCircle, XCircle, MoreHorizontal, Filter, MessageSquare 
} from 'lucide-react';
import { supabase } from '../api';
import { toast } from 'react-toastify';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All'); // All, pending, confirmed, cancelled
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Fetch Reservations
    const fetchReservations = async () => {
        setLoading(true);
        // Lấy dữ liệu và sắp xếp theo ngày đặt (Mới nhất hoặc Sắp tới lên đầu)
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('date', { ascending: true }) // Ngày gần nhất lên đầu
            .order('time', { ascending: true });

        if (error) {
            toast.error("Lỗi tải lịch đặt bàn");
            console.error(error);
        } else {
            setReservations(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReservations();
        
        // Realtime subscription (Tùy chọn)
        const subscription = supabase
            .channel('reservations_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations)
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, []);

    // 2. Cập nhật trạng thái (Confirm / Cancel)
    const updateStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('reservations')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast.error("Lỗi cập nhật!");
        } else {
            toast.success(`Đã cập nhật: ${newStatus}`);
            // Update local state cho mượt
            setReservations(reservations.map(res => 
                res.id === id ? { ...res, status: newStatus } : res
            ));
        }
    };

    // Helper: Badge màu sắc
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    // Filter Logic
    const filteredList = reservations.filter(item => {
        const matchStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.phone?.includes(searchTerm);
        return matchStatus && matchSearch;
    });

    return (
        <div className="p-6 bg-[#f4f7fe] min-h-screen ml-64 font-['Poppins'] text-gray-800">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Reservations</h1>
                    <p className="text-gray-500 text-sm">Manage table bookings</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold shadow-sm border-none outline-none focus:ring-2 focus:ring-[#9e1c20]/20 cursor-pointer w-full"
                        >
                            <option value="All">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search name or phone..." 
                            className="pl-10 pr-4 py-2.5 bg-white border-none rounded-xl shadow-sm outline-none w-full sm:w-64 focus:ring-2 focus:ring-[#9e1c20]/20 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- RESERVATION CARDS GRID --- */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading reservations...</div>
            ) : filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                    <Calendar size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No reservations found</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredList.map((res,index) => (
                        <div key={res.id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:shadow-lg transition-all group relative overflow-hidden">
                            
                            {/* Status Stripe (Thanh màu bên trái) */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                res.status === 'confirmed' ? 'bg-green-500' : 
                                res.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>

                            {/* Header: Date & Time */}
                            <div className="flex justify-between items-start mb-4 pl-2">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl font-bold text-center min-w-15">
                                        <span className="block text-xs uppercase text-blue-400">
                                            {new Date(res.date).toLocaleString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-xl leading-none">
                                            {new Date(res.date).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                                            <Clock size={16} className="text-[#9e1c20]" />
                                            {res.time}
                                        </div>
                                        <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Party Size Badge */}
                                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600 font-bold text-sm">
                                    <Users size={16} /> {res.guests || res.party_size}
                                </div>
                            </div>

                            {/* Body: Customer Info */}
                            <div className="pl-2 space-y-3 mb-6">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{res.name}</h4>
                                    <a href={`tel:${res.phone}`} className="text-sm text-gray-500 hover:text-[#9e1c20] flex items-center gap-1 transition-colors">
                                        <Phone size={14} /> {res.phone}
                                    </a>
                                </div>
                                
                                {res.note && (
                                    <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 italic border border-gray-100 flex gap-2">
                                        <MessageSquare size={14} className="shrink-0 mt-0.5" />
                                        "{res.note}"
                                    </div>
                                )}
                            </div>

                            {/* Footer: Actions */}
                            <div className="pl-2 flex gap-3 pt-4 border-t border-gray-50">
                                {res.status === 'pending' && (
                                    <>
                                        <button 
                                            onClick={() => updateStatus(res.id, 'confirmed')}
                                            className="flex-1 bg-black text-white py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Confirm
                                        </button>
                                        <button 
                                            onClick={() => { if(window.confirm('Hủy lịch này?')) updateStatus(res.id, 'cancelled') }}
                                            className="px-3 py-2 border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </>
                                )}
                                
                                {res.status === 'confirmed' && (
                                    <button 
                                        className="flex-1 bg-gray-100 text-green-700 py-2 rounded-xl text-sm font-bold cursor-default flex items-center justify-center gap-2 opacity-70"
                                    >
                                        <CheckCircle size={16} /> Confirmed
                                    </button>
                                )}

                                {res.status === 'cancelled' && (
                                    <button 
                                        onClick={() => updateStatus(res.id, 'pending')}
                                        className="flex-1 text-gray-400 py-2 text-sm hover:text-gray-600 underline"
                                    >
                                        Re-open
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReservations;