import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Flame, Minus, Plus, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Đảm bảo đường dẫn đúng
import { supabase } from '../../api'; // Import supabase client

// --- 1. OfferCard Component (Giữ nguyên logic, chỉ nhận data thật) ---
const OfferCard = ({ item }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    // Dữ liệu từ DB có thể thiếu sold/total, ta set mặc định để không lỗi UI
    const total = item.total || 100;
    const sold = item.sold || 10;
    const stock = total - sold;
    const percentSold = (sold / total) * 100;

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        if (quantity < stock) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const productToAdd = {
            ...item,
            // Đảm bảo lấy đúng giá bán
            price: item.salePrice || item.price, 
        };
        addToCart(productToAdd, quantity);
        setQuantity(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex gap-4 items-center group border border-gray-100"
        >
            {/* Image Section */}
            <div className="relative w-1/3 h-32 shrink-0 bg-[#fff8f0] rounded-xl flex items-center justify-center p-2">
                <div className="absolute top-0 left-0 bg-[#9e1c20] text-white text-xs font-bold px-2 py-1 rounded-tl-xl rounded-br-lg z-10">
                    -{item.discount}%
                </div>
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Info Section */}
            <div className="flex-1 flex flex-col justify-between h-full py-1">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 group-hover:text-[#9e1c20] transition-colors line-clamp-1">
                        {item.name}
                    </h3>
                    <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
                        <span>Sold: {sold}</span>
                        <span className="text-[#FFA500]">Available: {stock}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentSold}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-linear-to-r from-[#FFA500] to-[#ff7b00] rounded-full"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs line-through">${item.originalPrice.toFixed(2)}</span>
                        <span className="text-[#9e1c20] font-black text-xl">${item.salePrice.toFixed(2)}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex items-center gap-3'>
                        <div className="flex items-center bg-gray-100 rounded-full h-8 px-1">
                            <button
                                onClick={handleDecrease}
                                className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm hover:text-[#9e1c20] disabled:opacity-50 cursor-pointer"
                                disabled={quantity <= 1}
                            >
                                <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-gray-800">{quantity}</span>
                            <button
                                onClick={handleIncrease}
                                className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm hover:text-[#9e1c20] disabled:opacity-50 cursor-pointer"
                                disabled={quantity >= stock}
                            >
                                <Plus size={12} strokeWidth={3} />
                            </button>
                        </div>

                        <button className="bg-[#9e1c20] hover:bg-[#7a1518] cursor-pointer text-white p-2.5 rounded-full transition-colors shadow-lg shadow-red-200" onClick={handleAddToCart}>
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- 2. Main Promotion Component ---
const Promotion = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [promotionItems, setPromotionItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data logic
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoading(true);
                // Lấy 6 sản phẩm từ bảng products
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .limit(6); // Giới hạn 6 cái

                if (error) throw error;

                if (data) {
                    // Vì DB có thể không có cột discount/originalPrice, ta tự tính toán giả lập để UI đẹp
                    const formattedData = data.map(item => {
                        // Giả sử giá trong DB (item.price) là giá ĐÃ GIẢM (Sale Price)
                        // Ta tự cộng thêm 20-30% để ra giá gốc (Original Price) giả định
                        const randomDiscountPercent = Math.floor(Math.random() * (30 - 10 + 1)) + 10; // Random 10-30%
                        const salePrice = item.price;
                        const originalPrice = salePrice * (1 + randomDiscountPercent / 100);
                        
                        return {
                            ...item,
                            salePrice: salePrice,
                            originalPrice: originalPrice,
                            discount: randomDiscountPercent,
                            sold: Math.floor(Math.random() * 50) + 10, // Random số lượng đã bán
                            total: 100 // Giả định tổng kho
                        };
                    });
                    setPromotionItems(formattedData);
                }
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    // 2. Timer Logic (Giữ nguyên)
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num) => String(num).padStart(2, '0');
    const timerComponents = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
    ];

    return (
        <section className="w-full py-20 bg-white font-['Poppins']">
            <div className="container mx-auto px-4">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#9e1c20] text-white p-1 rounded-full"><Flame size={18} fill="white" /></span>
                            <h4 className="text-[#9e1c20] font-bold text-sm tracking-widest uppercase">Limited Time Offer</h4>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
                            Special <span className="text-[#FFA500] font-['Oleo_Script'] text-5xl md:text-6xl capitalize transform -rotate-3 inline-block">Deals</span> of the Day
                        </h2>
                    </div>

                    <div className="flex gap-3 md:gap-4">
                        {timerComponents.map((item, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="bg-[#9e1c20] text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-colors duration-300">
                                    {formatNumber(item.value)}
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 mt-2 block uppercase tracking-wide">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- GRID CARDS --- */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9e1c20]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotionItems.map((item) => (
                            <OfferCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Promotion;