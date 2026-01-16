
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { supabase } from '@/api';
const Info = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: ''
    });
    useEffect(() => {
        const getProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('profiles') // 👇 Nhớ dùng số nhiều
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setFormData({
                        fullName: data.full_name || '',
                        phone: data.phone || '',
                        address: data.address || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        getProfile();
    }, [user]);
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles') // 👇 Update thẳng vào bảng này
                .update({
                    full_name: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    // updated_at: new Date() // Nếu bảng có cột này thì thêm vào
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success("Profile updated successfully!");

        } catch (error) {
            toast.error("Error updating profile: " + error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1 mt-4">
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
        </>
    )
}
export default Info;