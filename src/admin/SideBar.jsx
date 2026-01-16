import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Thêm icon Users
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, CalendarDays, MessageSquare, Settings, LogOut, Users, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import context để logout

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth(); // Lấy hàm signOut từ context

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: UtensilsCrossed, label: 'Menu Items', path: '/admin/products' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        // 👇 THÊM MỤC USERS MỚI Ở ĐÂY
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: CalendarDays, label: 'Reservations', path: '/admin/reservations' },
        { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };
    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col font-['Poppins'] z-50">
            {/* Logo */}
            <div className="p-8 flex items-center gap-2 group cursor-pointer" onClick={() => { navigate('/') }}>
                <div className="w-8 h-8 bg-[#9e1c20] rounded-full flex items-center justify-center text-white font-bold">T</div>
                <span className="text-2xl font-black text-gray-900 tracking-tighter">TasteNest<span className="text-[#9e1c20]">.</span></span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Kiểm tra active chính xác hơn (để tránh /admin active khi vào /admin/users)
                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-[#9e1c20] text-white shadow-lg shadow-red-100 font-bold'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;