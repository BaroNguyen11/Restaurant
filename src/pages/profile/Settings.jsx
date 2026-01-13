import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../api'; // Điều chỉnh đường dẫn import nếu cần
import { toast } from 'react-toastify';

const Settings = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [notifications, setNotifications] = useState({
        emailPromo: true,
        orderUpdates: true
    });

    useEffect(() => {
        if (user?.user_metadata?.settings) {
            setNotifications(user.user_metadata.settings);
        }
    }, [user]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword.length < 6) return toast.error("Password must be at least 6 characters");
        if (passwords.newPassword !== passwords.confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });

        if (error) toast.error(error.message);
        else {
            toast.success("Password changed successfully!");
            setPasswords({ newPassword: '', confirmPassword: '' });
        }
        setLoading(false);
    };

    const toggleNotification = async (key) => {
        const newSettings = { ...notifications, [key]: !notifications[key] };
        setNotifications(newSettings);
        await supabase.auth.updateUser({
            data: { settings: newSettings }
        });
        toast.info("Settings updated");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex-1 mt-4">
            
            {/* Change Password */}
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

            {/* Notifications */}
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

            {/* Danger Zone */}
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
    );
};

export default Settings;