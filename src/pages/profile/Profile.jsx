import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, Bell, Lock, Trash2, LogOut, Save, Loader2, Eye, EyeOff, Phone, Mail, MapPin, Calendar } from 'lucide-react'; // Thêm icon
import { supabase } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Thêm tab 'settings'
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    // State cho Profile
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    // 👇 State cho Password Change
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);

    // 👇 State cho Notification (Lấy từ user_metadata hoặc mặc định true)
    const [notifications, setNotifications] = useState({
        emailPromo: true,
        orderUpdates: true
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.user_metadata?.full_name || '',
                phone: user.user_metadata?.phone || '',
                address: user.user_metadata?.address || ''
            });
            // Load setting cũ nếu có
            if (user.user_metadata?.settings) {
                setNotifications(user.user_metadata.settings);
            }
            fetchOrders();
        } else {
            navigate('/login');
        }
        if (location.state && location.state.activeTab){
            setActiveTab(location.state.activeTab);
        }
    }, [user, navigate,location]);

    const fetchOrders = async () => {
        // ... (Code cũ giữ nguyên)
        const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (!error) setOrders(data);
    };

    const handleUpdateProfile = async (e) => {
        // ... (Code cũ giữ nguyên)
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: formData.fullName, phone: formData.phone, address: formData.address }
        });
        if (error) toast.error(error.message);
        else toast.success("Profile updated!");
        setLoading(false);
    };

    // 👇 1. XỬ LÝ ĐỔI MẬT KHẨU
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword.length < 6) return toast.error("Mật khẩu phải trên 6 ký tự");
        if (passwords.newPassword !== passwords.confirmPassword) return toast.error("Mật khẩu xác nhận không khớp");

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });

        if (error) toast.error(error.message);
        else {
            toast.success("Đổi mật khẩu thành công!");
            setPasswords({ newPassword: '', confirmPassword: '' });
        }
        setLoading(false);
    };

    // 👇 2. XỬ LÝ LƯU CÀI ĐẶT THÔNG BÁO
    const toggleNotification = async (key) => {
        const newSettings = { ...notifications, [key]: !notifications[key] };
        setNotifications(newSettings);

        // Lưu setting vào metadata của user để lần sau vào vẫn nhớ
        await supabase.auth.updateUser({
            data: { settings: newSettings }
        });
        toast.info("Đã cập nhật cài đặt");
    };
const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    return (
        <div className="min-h-screen bg-[#f9f9f9] font-['Poppins'] py-10 ">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-black text-gray-900 mb-8">My Account</h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR MENU --- */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            {/* Avatar Info (Giữ nguyên) */}
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                                <img src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[#9e1c20] p-0.5 object-cover" />
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-gray-900 truncate">{user?.user_metadata?.full_name}</h3>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'profile' ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <User size={18} /> Personal Info
                                </button>
                                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Package size={18} /> My Orders
                                </button>
                                {/* 👇 Nút Settings Mới */}
                                <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'settings' ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Settings size={18} /> Settings
                                </button>


                            </nav>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="w-full lg:w-3/4">

                        {/* Tab Profile & Orders (Giữ nguyên code cũ, mình ẩn đi cho gọn để tập trung vào Settings) */}
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <User className="text-[#9e1c20]" /> Edit Profile
                                </h2>

                                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="Add your phone"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <div className="relative opacity-60">
                                            <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                value={user?.email}
                                                disabled
                                                className="w-full pl-11 pr-4 py-3 bg-gray-100 text-gray-500 rounded-xl border-none cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 pl-1">* Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Default Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                            <textarea
                                                rows="3"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Enter your delivery address"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20] outline-none transition-all resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#9e1c20] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-red-100 flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 bg-white p-6 rounded-t-3xl border-b border-gray-100">
                                    <Package className="text-[#9e1c20]" /> Order History
                                </h2>

                                {orders.length === 0 ? (
                                    <div className="bg-white p-12 rounded-b-3xl text-center border border-gray-100 border-t-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Package size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                                        <button onClick={() => navigate('/menu')} className="text-[#9e1c20] font-bold underline">Start Ordering</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group">
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
                                                    <div className="text-right">
                                                        <span className="block text-sm text-gray-500">Total Amount</span>
                                                        <span className="block text-xl font-black text-[#9e1c20]">${Number(order.total_amount).toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                {/* Danh sách món ăn trong đơn */}
                                                <div className="space-y-2">
                                                    {order.items && order.items.map((item, idx) => (
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* 👇 3. TAB SETTINGS MỚI */}
                        {activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                                {/* Section: Change Password */}
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Lock className="text-[#9e1c20]" /> Security
                                    </h2>
                                    <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPass ? "text" : "password"}
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20] outline-none"
                                                    placeholder="••••••••"
                                                />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#9e1c20] outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <button disabled={loading} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#9e1c20] transition-colors disabled:opacity-50">
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                </div>

                                {/* Section: Notifications */}
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Bell className="text-[#9e1c20]" /> Notifications
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-bold text-gray-900">Email Promotions</h4>
                                                <p className="text-xs text-gray-500">Receive coupons and special offers.</p>
                                            </div>
                                            {/* Custom Toggle Switch */}
                                            <button
                                                onClick={() => toggleNotification('emailPromo')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications.emailPromo ? 'bg-[#9e1c20]' : 'bg-gray-300'}`}
                                            >
                                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications.emailPromo ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-bold text-gray-900">Order Updates</h4>
                                                <p className="text-xs text-gray-500">Get notified when order status changes.</p>
                                            </div>
                                            <button
                                                onClick={() => toggleNotification('orderUpdates')}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications.orderUpdates ? 'bg-[#9e1c20]' : 'bg-gray-300'}`}
                                            >
                                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications.orderUpdates ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Danger Zone */}
                                <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-700">
                                        <Trash2 size={20} /> Danger Zone
                                    </h2>
                                    <p className="text-sm text-red-600 mb-6">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <button
                                        onClick={() => { if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) alert('Feature coming soon!') }}
                                        className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>

                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;