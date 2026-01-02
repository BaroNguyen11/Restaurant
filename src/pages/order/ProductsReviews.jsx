import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, MessageSquare, Send, ThumbsUp } from 'lucide-react';
import { supabase } from '../../api'; 
import { useAuth } from '../../context/AuthContext'; 

const ProductReviews = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // State cho form review mới
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    // 1. Lấy danh sách review từ Supabase
    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return;
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (!error) setReviews(data);
            setLoading(false);
        };
        fetchReviews();
    }, [productId]);

    // 2. Xử lý gửi review
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Vui lòng đăng nhập để viết đánh giá!");
            return;
        }
        setSubmitting(true);

        const reviewData = {
            product_id: productId,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || 'Anonymous', // Lấy tên từ Auth
            rating: newReview.rating,
            comment: newReview.comment
        };

        const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();

        if (!error && data) {
            setReviews([data, ...reviews]); // Thêm review mới lên đầu
            setShowForm(false); // Đóng form
            setNewReview({ rating: 5, comment: '' }); // Reset form
        } else {
            alert("Lỗi khi gửi đánh giá. Thử lại sau!");
        }
        setSubmitting(false);
    };

    // Helper: Render ngôi sao (Vàng hoặc Xám)
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    return (
        <div className="font-['Poppins'] py-8">
            {/* --- HEADER: THỐNG KÊ --- */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {/* Tính điểm trung bình */}
                            {renderStars(reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 5)}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                            Based on {reviews.length} review{reviews.length !== 1 && 's'}
                        </span>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#9e1c20] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#c32d32] transition-all shadow-lg shadow-red-100 flex items-center gap-2 cursor-pointer"
                >
                    <MessageSquare size={18} />
                    {showForm ? 'Cancel Review' : 'Write a Review'}
                </button>
            </div>

            {/* --- FORM VIẾT REVIEW (MỞ/ĐÓNG) --- */}
            <AnimatePresence>
                {showForm && (
                    <motion.form 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-gray-50 p-6 rounded-2xl mb-8 overflow-hidden border border-gray-200"
                    >
                        <h4 className="font-bold text-gray-900 mb-4">Share your experience</h4>
                        
                        {/* Chọn sao */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        type="button" 
                                        key={star}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star 
                                            size={28} 
                                            className={`${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Nhập nội dung */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Review</label>
                            <textarea 
                                required
                                rows="3"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="How was the food? Tell us more..."
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
                            ></textarea>
                        </div>

                        <button disabled={submitting} className="hover:bg-[#c32d32] text-white px-6 py-3 rounded-xl font-bold bg-[#9e1c20] transition-colors flex items-center gap-2 cursor-pointer">
                            {submitting ? 'Submitting...' : <><Send size={18} /> Submit Review</>}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* --- DANH SÁCH REVIEW --- */}
            <div className="space-y-6">
                {reviews.length === 0 && !loading ? (
                    // UI KHI CHƯA CÓ REVIEW (Như bạn đã có)
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-gray-300 shadow-sm">
                            <Star size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h4>
                        <p className="text-gray-500 mb-6">Be the first to review this delicious dish!</p>
                        <button onClick={() => setShowForm(true)} className="text-[#9e1c20] font-bold border-b-2 border-[#9e1c20] pb-1 hover:text-black hover:border-black transition-all">
                            Write a Review
                        </button>
                    </div>
                ) : (
                    // LOOP REVIEW ITEMS
                    reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            {/* Avatar Giả */}
                            <div className="w-12 h-12 bg-[#fff8f0] rounded-full flex items-center justify-center text-[#9e1c20] font-bold text-lg shrink-0">
                                {review.user_name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h5 className="font-bold text-gray-900">{review.user_name}</h5>
                                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {review.comment}
                                </p>
                                {/* Nút Like giả cho vui */}
                                <button className="flex items-center gap-1 text-gray-400 text-xs mt-3 hover:text-[#9e1c20] transition-colors">
                                    <ThumbsUp size={14} /> Helpful
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;