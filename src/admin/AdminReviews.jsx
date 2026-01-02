import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Star, 
    Trash2, 
    MessageSquare, 
    Filter, 
    Quote,
    ThumbsUp,
    Calendar
} from 'lucide-react';
import { supabase } from '../api';
import { toast } from 'react-toastify';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStar, setFilterStar] = useState('All'); // 'All', 5, 4, 3, 2, 1

    // 1. Fetch Reviews kèm thông tin Món ăn
    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Join với bảng products để biết khách review món gì
            // Lưu ý: bảng 'products' cần quan hệ Foreign Key với 'reviews'
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    products (
                        name,
                        image
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error(error);
            // Nếu chưa link bảng products, fallback về lấy reviews thường
            toast.error("Không tải được danh sách review");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // 2. Xóa Review
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.')) {
            try {
                const { error } = await supabase.from('reviews').delete().eq('id', id);
                if (error) throw error;
                
                toast.success('Đã xóa đánh giá.');
                // Cập nhật lại list ngay lập tức
                setReviews(reviews.filter(r => r.id !== id));
            } catch (error) {
                toast.error('Lỗi khi xóa: ' + error.message);
            }
        }
    };

    // Helper: Render ngôi sao vàng
    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star} 
                        size={14} 
                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                ))}
            </div>
        );
    };

    // Filter Logic
    const filteredReviews = reviews.filter(review => {
        const matchSearch = review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStar = filterStar === 'All' || review.rating === parseInt(filterStar);
        
        return matchSearch && matchStar;
    });

    return (
        <div className="p-6 bg-[#f4f7fe] min-h-screen ml-64 font-['Poppins'] text-gray-800">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Customer Reviews</h1>
                    <p className="text-gray-500 text-sm">Manage feedback and ratings</p>
                </div>

                <div className="flex gap-3">
                    {/* Filter Stars */}
                    <div className="relative group">
                        <select 
                            className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium shadow-sm outline-none border border-transparent focus:border-[#9e1c20] cursor-pointer"
                            value={filterStar}
                            onChange={(e) => setFilterStar(e.target.value)}
                        >
                            <option value="All">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search keywords..." 
                            className="pl-10 pr-4 py-2.5 bg-white border-none rounded-xl shadow-sm outline-none w-64 focus:ring-2 focus:ring-[#9e1c20]/20 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- REVIEWS GRID --- */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                    <MessageSquare size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">No reviews found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:shadow-lg transition-all flex flex-col h-full group">
                            
                            {/* User & Rating */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar giả lập từ tên */}
                                    <div className="w-10 h-10 rounded-full bg-[#fff0f0] text-[#9e1c20] flex items-center justify-center font-bold text-sm">
                                        {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{review.user_name || 'Anonymous'}</h4>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar size={10} />
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>

                            {/* Product Tag (Nếu có join bảng) */}
                            {review.products && (
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-xs font-medium text-gray-600 border border-gray-100">
                                        Review for: <span className="font-bold text-gray-800">{review.products.name}</span>
                                    </span>
                                </div>
                            )}

                            {/* Comment Content */}
                            <div className="relative bg-gray-50 p-4 rounded-xl mb-4 flex-1">
                                <Quote size={16} className="text-gray-300 absolute top-2 left-2 transform -scale-x-100" />
                                <p className="text-gray-600 text-sm italic pl-4 relative z-10">
                                    "{review.comment}"
                                </p>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                                <button className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-blue-600 transition-colors">
                                    <ThumbsUp size={14} /> Helpful ({Math.floor(Math.random() * 10)})
                                </button>
                                
                                <button 
                                    onClick={() => handleDelete(review.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Review"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;