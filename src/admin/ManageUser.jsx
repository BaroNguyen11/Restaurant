import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../api';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate'; // Nếu muốn phân trang

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users từ bảng profiles
    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')

        if (error) toast.error("Error fetching users: " + error.message);
        else setUsers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter tìm kiếm
    const filteredUsers = users.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || // Lưu ý: Bảng profiles cần có cột email hoặc join với auth.users
        user.phone?.includes(searchTerm)
    );

    // Xóa user (Lưu ý: Chỉ xóa profile, user vẫn còn trong auth nếu không dùng Trigger xóa ngược)
    // Để an toàn, thường ta chỉ "khóa" (ban) chứ không xóa.
    const handleDeleteUser = async (id) => {
        if(window.confirm("Are you sure you want to delete this user profile?")) {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) toast.error("Failed to delete: " + error.message);
            else {
                toast.success("User profile deleted.");
                fetchUsers();
            }
        }
    }

    return (
        <div className="p-8 bg-[#f4f7fe] min-h-screen ml-64 font-['Poppins']">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm">Manage customer accounts and roles</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-80">
                    <Search className="text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, phone..." 
                        className="flex-1 outline-none text-gray-700 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-5 font-bold">User</th>
                            <th className="p-5 font-bold">Contact Info</th>
                            <th className="p-5 font-bold">Role</th>
                            <th className="p-5 font-bold">Joined Date</th>
                            <th className="p-5 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={user.avatar_url || "https://github.com/shadcn.png"} 
                                                alt="Avatar" 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                            <div>
                                                <div className="font-bold text-gray-900">{user.full_name || "Unknown"}</div>
                                                <div className="text-xs text-gray-400">ID: {user.id.slice(0,8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                                            <Phone size={14} /> {user.phone || "N/A"}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs truncate max-w-[200px]" title={user.address}>
                                            <MapPin size={14} /> {user.address || "No address"}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                                            user.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                                            : 'bg-green-100 text-green-700 border-green-200'
                                        }`}>
                                            {user.role === 'admin' && <Shield size={12} />}
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-600">
                                        {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="p-5 text-right">
                                        {user.role !== 'admin' && ( // Không cho xóa Admin
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUser;