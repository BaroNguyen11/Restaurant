import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Star,  ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ReactPaginate from 'react-paginate';
import { animateFlyToCart } from '../../lib/cartAnimation';
import { supabase } from '../../api';
import { Link } from 'react-router-dom';

// --- CATEGORIES ---
const categories = ["All", "Burger", "Pizza", "Pasta", "Chicken", "Fries", "Drinks"];

const OrderFood = () => {
    const { addToCart } = useCart();
    
    // State
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 8;

    // --- 1. FETCH DATA FROM SUPABASE ---
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) throw error;
                if (data) setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // --- 2. LOGIC FILTER & SEARCH ---
    const filteredProducts = products.filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // --- 3. PAGINATION LOGIC ---
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredProducts.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    // Reset về trang 1 khi đổi bộ lọc
    useEffect(() => {
        setItemOffset(0);
    }, [activeCategory, searchTerm]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    return (
        <div className="w-full bg-[#f9f9f9] font-['Poppins'] min-h-screen">
            
            {/* --- HEADER BANNER --- */}
            <section className="relative w-full h-62.5 md:h-75 bg-[#fff8f0] flex flex-col items-center justify-center overflow-hidden px-4">
                <div className="z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2">Order Now</h1>
                    <p className="text-gray-500">Delicious food delivered to you.</p>
                </div>
            </section>

            {/* --- FILTER & SEARCH SECTION --- */}
            <section className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
                <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Categories Buttons */}
                    <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? 'bg-[#9e1c20] text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    {/* Search Input */}
                    <div className="relative w-full lg:w-87.5">
                        <input 
                            type="text" 
                            placeholder="Search food..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full bg-[#f4f1ea] py-3 pl-12 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9e1c20]/50 transition-all" 
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
            </section>

            {/* --- PRODUCT GRID --- */}
            <section className="container mx-auto px-4 pb-20">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9e1c20]"></div>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-100">
                        <AnimatePresence mode='wait'>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id} 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white p-4 rounded-[30px] shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#fff0e0] group flex flex-col justify-between h-full"
                                    >
                                        {/* Top: Image & Wishlist */}
                                        <div className="relative bg-[#fff8f0] rounded-2xl p-4 mb-4 flex items-center justify-center h-48 group-hover:bg-[#fff5eb] transition-colors">
                                            
                                            {/* Link bao quanh ảnh */}
                                            <Link to={`/product/${item.id}`} className="flex w-full h-full items-center justify-center">
                                                <img 
                                                    id={`prod-img-${item.id}`}
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-36 h-36 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md cursor-pointer flex items-center justify-center" 
                                                />
                                            </Link>
                                        </div>

                                        {/* Middle: Info */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-1 mb-2">
                                                <Star size={14} className="text-[#FFA500] fill-[#FFA500]" />
                                                <span className="text-xs font-bold text-gray-600">4.5</span>
                                                <span className="text-xs text-gray-400">• {item.category}</span>
                                            </div>

                                            {/* Link bao quanh tên món */}
                                            <Link to={`/product/${item.id}`}>
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#9e1c20] transition-colors cursor-pointer hover:underline">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-500 text-xs line-clamp-2 min-h-[2.5em]">Tasty & Delicious food for you.</p>
                                        </div>

                                        {/* Bottom: Price & Add Button */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xl font-black text-[#9e1c20]">${item.price.toFixed(2)}</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn click lan ra ngoài link
                                                    const imgEl = document.getElementById(`prod-img-${item.id}`);
                                                    animateFlyToCart(imgEl, item.image);
                                                    addToCart(item);
                                                }} 
                                                className="hover:bg-[#c32a2f] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-[#9e1c20] transition-colors active:scale-90 cursor-pointer"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                // Empty State
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search size={40} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No Food Found</h3>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* --- PAGINATION UI --- */}
                {!loading && filteredProducts.length > itemsPerPage && (
                    <div className="mt-12 flex justify-center">
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel={<span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:bg-[#9e1c20] hover:text-white transition-colors"><ChevronRight size={20} /></span>}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            pageCount={pageCount}
                            previousLabel={<span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:bg-[#9e1c20] hover:text-white transition-colors"><ChevronLeft size={20} /></span>}
                            renderOnZeroPageCount={null}
                            containerClassName="flex items-center gap-2"
                            pageClassName="block"
                            pageLinkClassName="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            activeLinkClassName="!bg-[#9e1c20] !text-white shadow-lg border border-[#9e1c20]"
                            disabledClassName="opacity-50 cursor-not-allowed"
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrderFood;