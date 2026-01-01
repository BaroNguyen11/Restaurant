import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../api'; // Import Supabase Client

const ProductDetails = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  // --- FETCH DATA TỪ SUPABASE ---
  useEffect(() => {
    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            // 1. Lấy thông tin sản phẩm hiện tại
            const { data: currentProduct, error: prodError } = await supabase
                .from('Products') // Nhớ check lại tên bảng (Hoa/thường)
                .select('*')
                .eq('id', id)
                .single();

            if (prodError) throw prodError;
            setProduct(currentProduct);
            setQuantity(1); // Reset số lượng

            // 2. Lấy sản phẩm liên quan (Cùng category, trừ món hiện tại)
            if (currentProduct) {
                const { data: related, error: relatedError } = await supabase
                    .from('Products')
                    .select('*')
                    .eq('category', currentProduct.category)
                    .neq('id', currentProduct.id) // Loại trừ chính nó
                    .limit(4); // Lấy 4 món
                
                if (!relatedError) setRelatedProducts(related);
            }

        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
            window.scrollTo(0, 0); // Cuộn lên đầu trang
        }
    };

    fetchProductDetails();
  }, [id]); // Chạy lại khi ID thay đổi

  const handleAddToCart = () => {
    if (product) {
        addToCart(product, quantity);
        // Có thể thêm Toast thông báo "Đã thêm vào giỏ" ở đây
    }
  };

  if (loading) return (
      <div className="flex justify-center items-center h-screen bg-[#fff8f0]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#9e1c20]"></div>
      </div>
  );

  if (!product) return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/order" className="text-[#9e1c20] hover:underline">Back to Menu</Link>
      </div>
  );

  return (
    <div className="w-full bg-white font-['Poppins'] pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* --- BREADCRUMB --- */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
            <Link to="/" className="hover:text-[#9e1c20] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/order/order_food" className="hover:text-[#9e1c20] transition-colors">Menu</Link>
            <ChevronRight size={14} />
            <span className="text-[#9e1c20] font-bold line-clamp-1">{product.name}</span>
        </div>

        {/* --- MAIN PRODUCT SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
            
            {/* Cột Trái: Hình Ảnh */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#fff8f0] rounded-[40px] flex items-center justify-center p-10 h-100 lg:h-125 relative group overflow-hidden"
            >
                {/* Hình nền mờ trang trí */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <motion.img 
                    key={product.image} 
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain drop-shadow-2xl z-10 group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
            </motion.div>

            {/* Cột Phải: Thông Tin */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col justify-center"
            >
                {/* Giá tiền */}
                <div className="flex items-end gap-4 mb-2">
                    <h2 className="text-3xl md:text-4xl font-black text-[#9e1c20]">${product.price.toFixed(2)}</h2>
                    {/* Giá gốc giả định (tăng 20%) */}
                    <span className="text-xl text-gray-400 line-through mb-1">${(product.price * 1.2).toFixed(2)}</span>
                </div>

                {/* Tên món */}
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex text-[#FFA500]">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < Math.floor(product.rating || 5) ? "fill-current" : "text-gray-300"} />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">({product.reviews || 10} Customer Reviews)</span>
                </div>

                {/* Mô tả ngắn */}
                <p className="text-gray-500 leading-relaxed mb-8 border-b border-gray-100 pb-8 text-lg">
                    {product.description || "A delicious meal prepared with fresh ingredients and our secret family recipe. Perfect for lunch or dinner."}
                </p>

                {/* Hành động (Số lượng + Thêm giỏ) */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    {/* Bộ chọn số lượng */}
                    <div className="flex items-center bg-gray-100 rounded-full h-14 px-2 w-fit shadow-inner">
                        <button 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-[#9e1c20] transition-colors"
                        >
                            <Minus size={18} strokeWidth={2.5} />
                        </button>
                        <span className="w-14 text-center font-bold text-xl text-gray-800">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(q => q + 1)} 
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-[#9e1c20] transition-colors"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Nút Add to Cart */}
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-[#F51E46] text-white font-bold rounded-full h-14 px-8 shadow-lg shadow-red-200 hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                    >
                        Add To Cart <ShoppingCart size={22} />
                    </button>
                </div>

                {/* Meta info */}
                <div className="space-y-3 text-sm text-gray-600 font-medium">
                    <p className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 min-w-20">SKU:</span> 
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">FOOD-{product.id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 min-w-20">Category:</span> 
                        <Link to="/order" className="text-[#9e1c20] hover:underline uppercase tracking-wide text-xs">{product.category}</Link>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 min-w-20">Tags:</span> 
                        <span className="text-gray-500">Fast Food, Healthy, Lunch</span>
                    </p>
                    <p className="flex items-center gap-2 mt-4">
                        <span className="font-bold text-gray-900 min-w-20">Stock:</span> 
                        <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-xs border border-green-200">
                            <Check size={14} strokeWidth={3}/> Available
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>

        {/* --- TABS SECTION --- */}
        <div className="mb-24">
            {/* Tab Headers */}
            <div className="flex gap-8 border-b-2 border-gray-100 mb-8">
                {['Description', 'Reviews'].map((tab) => {
                    const key = tab.toLowerCase().slice(0, 4); // 'desc' or 'revi'
                    const isActive = activeTab === key;
                    return (
                        <button 
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`pb-4 text-lg font-bold transition-all relative px-2 ${isActive ? 'text-[#9e1c20]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab} {key === 'revi' && `(${product.reviews || 0})`}
                            {isActive && (
                                <motion.div layoutId="underline" className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-[#9e1c20]" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 p-8 md:p-12 rounded-[30px] min-h-50 shadow-inner">
                {activeTab === 'desc' ? (
                    <div className="flex flex-col md:flex-row gap-12 items-center animate-fadeIn">
                        <div className="flex-1 space-y-4 text-gray-600 leading-relaxed">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delicious & Healthy Choice</h3>
                            <p>
                                Welcome to TasteNest, where culinary excellence meets exceptional service. Our restaurant is a haven for food enthusiasts seeking an elevated dining experience. Immerse yourself in a sophisticated and inviting ambiance.
                            </p>
                            <p>
                                Each dish is meticulously crafted by our expert chefs, ensuring a perfect balance of flavors and nutrition. We source our ingredients from trusted local farmers to guarantee freshness and quality in every bite.
                            </p>
                            <ul className="grid grid-cols-2 gap-2 mt-4 text-sm font-bold text-gray-800">
                                <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Fresh Ingredients</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Best Recipe</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Vegan Options</li>
                                <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> 24/7 Support</li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3 flex justify-center">
                             <img src={product.image} className="w-48 opacity-80 mix-blend-multiply filter contrast-125" alt="small preview" />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 animate-fadeIn">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                            <Star size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h4>
                        <p className="text-gray-500 mb-6">Be the first to review "{product.name}"</p>
                        <button className="text-[#9e1c20] font-bold border-b-2 border-[#9e1c20] pb-1 hover:text-black hover:border-black transition-all">Write a Review</button>
                    </div>
                )}
            </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        {relatedProducts.length > 0 && (
            <div>
                <div className="text-center mb-12">
                    <h4 className="text-[#F51E46] font-bold text-sm tracking-widest uppercase mb-2">You May Also Like</h4>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase">
                        Related <span className="text-[#9e1c20]">Products</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#FFA500] mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {relatedProducts.map((item) => (
                        <Link to={`/product/${item.id}`} key={item.id} className="group h-full">
                            <div className="bg-white rounded-[30px] p-6 text-center hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100 hover:border-[#ffe0b2] h-full flex flex-col relative overflow-hidden">
                                 
                                 {/* Badge SALE (Giả lập) */}
                                 {Math.random() > 0.5 && (
                                     <span className="absolute top-4 left-4 bg-[#F51E46] text-white text-[10px] font-bold px-2 py-1 rounded z-10">SALE</span>
                                 )}

                                 <div className="h-40 flex items-center justify-center mb-6 bg-[#fff8f0] rounded-2xl group-hover:bg-[#fff5eb] transition-colors relative">
                                    <img src={item.image} alt={item.name} className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                                 </div>
                                 
                                 <div className="flex justify-center mb-3">
                                     {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className="text-[#FFA500] fill-[#FFA500]" />
                                     ))}
                                 </div>
                                 
                                 <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg group-hover:text-[#9e1c20] transition-colors">{item.name}</h3>
                                 
                                 <div className="mt-auto flex items-center justify-between">
                                     <p className="text-[#9e1c20] font-black text-xl">${item.price.toFixed(2)}</p>
                                     <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                         <ShoppingCart size={14} />
                                     </div>
                                 </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;