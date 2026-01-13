// import { User, Package, Settings } from 'lucide-react'
// import { useAuth } from '../../context/AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { useState } from 'react'
// const Sidebar = () => {

//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [activeTab, setActiveTab] = useState('profile');
//     return (
//         <>
//             <div className="w-100 lg:block hidden">
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
//                     <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
//                         <img src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[#9e1c20] p-0.5 object-cover" />
//                         <div className="overflow-hidden">
//                             <h3 className="font-bold text-gray-900 truncate">{user?.user_metadata?.full_name}</h3>
//                             <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//                         </div>
//                     </div>

//                     <nav className="space-y-2">
//                         <Link to='/infomation'>
//                             <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'profile' ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
//                                 <User size={18} /> Personal Info
//                             </button>
//                         </Link>
//                         <Link to='my_order'>
//                             <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
//                                 <Package size={18} /> My Orders
//                             </button>
//                         </Link>
//                         <Link to='settings'>
//                             <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'settings' ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
//                                 <Settings size={18} /> Settings
//                             </button>
//                         </Link>
//                     </nav>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default Sidebar;
import React from 'react';
import { User, Package, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Hàm kiểm tra xem đường dẫn hiện tại có khớp với menu không
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="w-100 lg:block hidden">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                {/* Avatar Info */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                    <img 
                        src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full border-2 border-[#9e1c20] p-0.5 object-cover" 
                    />
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-900 truncate">{user?.user_metadata?.full_name}</h3>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    <Link to="infomation">
                        <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-2 ${isActive('/infomation') || isActive('/profile') ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <User size={18} /> Personal Info
                        </div>
                    </Link>
                    
                    <Link to="my_order">
                        <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-2 ${isActive('/my_order') ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Package size={18} /> My Orders
                        </div>
                    </Link>
                    
                    <Link to="settings">
                        <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-2 ${isActive('/settings') ? 'bg-[#9e1c20] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Settings size={18} /> Settings
                        </div>
                    </Link>
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;