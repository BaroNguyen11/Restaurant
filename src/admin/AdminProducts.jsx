import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../api';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State cho Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // Nếu null là Thêm mới, có data là Sửa
    
    const [formData, setFormData] = useState({
        name: '',
        category: 'Burger', // Default
        price: '',
        description: '',
        image: null, // File ảnh upload
        imageUrl: '' // Link ảnh hiện tại (dùng khi edit)
    });

    const [imagePreview, setImagePreview] = useState(null);

    // 1. Fetch danh sách món ăn
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products') // ⚠️ Kiểm tra kỹ tên bảng trong DB (Products hay products)
            .select('*')
            .order('id', { ascending: true });
        
        if (error) toast.error("Lỗi tải dữ liệu: " + error.message);
        else setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. Xử lý mở Modal
    const openModal = (product = null) => {
        if (product) {
            // Chế độ Edit
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                description: product.description,
                image: null,
                imageUrl: product.image
            });
            setImagePreview(product.image);
        } else {
            // Chế độ Add New
            setEditingProduct(null);
            setFormData({ name: '', category: 'Burger', price: '', description: '', image: null, imageUrl: '' });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    // 3. Xử lý Upload ảnh lên Supabase Storage
    const handleImageUpload = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images') // Tên Bucket bạn đã tạo
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Lấy public URL
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    // 4. Lưu dữ liệu (Thêm hoặc Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalImageUrl = formData.imageUrl;

            // Nếu có chọn ảnh mới thì upload
            if (formData.image) {
                finalImageUrl = await handleImageUpload(formData.image);
            }

            const productData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                description: formData.description,
                image: finalImageUrl,
                // rating: 5.0 (Mặc định)
            };

            if (editingProduct) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
                toast.success('Cập nhật món thành công!');
            } else {
                // Insert
                const { error } = await supabase
                    .from('products')
                    .insert([{ ...productData, rating: 5.0, reviews: 0 }]); // Set rating mặc định
                if (error) throw error;
                toast.success('Thêm món mới thành công!');
            }

            setIsModalOpen(false);
            fetchProducts(); // Refresh list

        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Xóa món ăn
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa món này không?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) toast.error("Lỗi xóa: " + error.message);
            else {
                toast.success("Đã xóa thành công!");
                fetchProducts();
            }
        }
    };

    // Filter tìm kiếm
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen ml-64 font-['Poppins']">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Menu Management</h1>
                    <p className="text-gray-500 text-sm">Manage your dishes and categories</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-[#9e1c20] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-800 transition-colors shadow-lg shadow-red-100"
                >
                    <Plus size={20} /> Add New Dish
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by name or category..." 
                    className="flex-1 outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600 text-sm">Image</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Name</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Category</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Price</th>
                            <th className="p-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading data...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found.</td></tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">{product.name}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                            ${product.category === 'Burger' ? 'bg-orange-100 text-orange-600' : 
                                              product.category === 'Pizza' ? 'bg-yellow-100 text-yellow-600' : 
                                              'bg-blue-100 text-blue-600'}`}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-[#9e1c20]">${product.price}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(product)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Image Upload Area */}
                            <div className="flex flex-col items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData({ ...formData, image: file });
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }} 
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Dish Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#9e1c20] outline-none" placeholder="e.g. Spicy Burger" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#9e1c20] outline-none" placeholder="15.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#9e1c20] outline-none">
                                    <option value="Burger">Burger</option>
                                    <option value="Pizza">Pizza</option>
                                    <option value="Chicken">Chicken</option>
                                    <option value="Pasta">Pasta</option>
                                    <option value="Drinks">Drinks</option>
                                    <option value="Fries">Sides & Fries</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#9e1c20] outline-none resize-none" placeholder="Describe the ingredients..."></textarea>
                            </div>

                            <button disabled={isSubmitting} className="w-full bg-[#9e1c20] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-black transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : (editingProduct ? 'Save Changes' : 'Create Product')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;