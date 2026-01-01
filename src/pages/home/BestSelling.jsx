import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const category = ["Pizza", "Burger", "Pasta", "Chicken", "Fries", "Drinks"];
const categories = [
    { id: 1, name: "Grill Chicken", count: "22 Items", img: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png", menuTab: "main" },
    { id: 2, name: "Delicious Burger", count: "15 Items", img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", menuTab: "pizza"},
    { id: 3, name: "Drinks", count: "12 Items", img: "https://cdn-icons-png.flaticon.com/512/4973/4973066.png", menuTab: "drinks" },
    { id: 4, name: "Desserts", count: "08 Items", img: "https://cdn-icons-png.flaticon.com/512/2488/2488456.png", menuTab: "dessert" },
    { id: 5, name: "Combo Foods", count: "25 Items", img: "https://cdn-icons-png.flaticon.com/512/1940/1940180.png", menuTab: "starters" },
    { id: 6, name: "Pizza", count: "18 Items", img: "https://cdn-icons-png.flaticon.com/512/4727/4727378.png", menuTab: "pizza" },
];
const foodItems = [
    // PIZZA ITEMS
    {
        id: 1,
        category: "Pizza",
        name: "Grill Chicken Pizza",
        description: "Candied Jerusalem artichokes, truffle",
        price: "30.99",
        image: "https://qatar.pizzahut.me/_next/image?url=https%3A%2F%2Fqatar.pizzahut.me%2Fimages%2F9c8f1520-b601-11ef-a94f-a529441f62dc-GRILLEDCHEEKYCHICKEN512PX512PX(6)_mobile_image_2-2024-12-07185606.png&w=1080&q=75"
    },
    {
        id: 2,
        category: "Pizza",
        name: "Bacon Italian Pizza",
        description: "Spicy Jalapeño, Creamy Ranch",
        price: "20.99",
        image: "https://pizzafactory.lk/wp-content/uploads/2020/12/5-600x400.png"
    },
    {
        id: 3,
        category: "Pizza",
        name: "Delicious Pizza",
        description: "Spicy Jalapeño, Creamy Ranch",
        price: "40.99",
        image: "https://static.vecteezy.com/system/resources/previews/057/171/539/non_2x/delicious-pizza-topped-with-olives-tomatoes-and-fresh-basil-presented-on-a-wooden-platter-against-a-transparent-background-delicious-pizza-isolated-free-png.png"
    },
    {
        id: 4,
        category: "Pizza",
        name: "Combo Classic",
        description: "2 Large Pizza + Garlic Bread",
        price: "40.00",
        image: "https://overlycheezy.com/storage/set-meals/set-meal-2.png"
    },

    // BURGER ITEMS (Ví dụ để test chuyển tab)
    {
        id: 5,
        category: "Burger",
        name: "Double Cheeseburger",
        description: "Double beef patty, cheddar cheese",
        price: "15.99",
        image: "https://burgerking.com.cy/sites/default/files/Double%20Cheeseburger-01_1.png"
    },
    {
        id: 6,
        category: "Burger",
        name: "Crispy Chicken Burger",
        description: "Fried chicken breast, lettuce, mayo",
        price: "12.50",
        image: "https://png.pngtree.com/png-clipart/20241025/original/pngtree-crispy-chicken-burger-with-french-fries-png-image_16498071.png"
    },

    // SUSHI ITEMS
    {
        id: 7,
        category: "Sushi",
        name: "Smoked Salmon Bagel", // Tên như trong ảnh mẫu của bạn
        description: "Smoky Pepperoni, Melting Cheese",
        price: "39.85",
        image: "https://www.bakedbyyael.com/cdn/shop/products/Untitleddesign_26_1200x1200.png?v=1612300682"
    },
];
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const BestSellingFood = () => {
    const [activeTab, setActiveTab] = useState("Pizza");

    // Lọc sản phẩm theo tab đang chọn
    const filteredItems = foodItems.filter(item => item.category === activeTab);
    const navigate = useNavigate();
    const handleChangePage = (targetTab) => {
        navigate(`/menu?tab=${targetTab}`);
    };
    return (
        <section className="w-full py-20 bg-white font-['Poppins']">
            <div className="container mx-auto px-4 mb-12">
                {/* Tiêu đề */}
                <div className="text-center mb-12">
                    <h3 className="text-[#FFA500] font-bold text-sm tracking-widest mb-2 uppercase">Food Category</h3>
                    <h2 className="text-4xl font-black text-[#9e1c20] uppercase tracking-tight">
                        Browse Fast Foods Category
                    </h2>
                    {/* Đường kẻ trang trí */}
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <span className="h-0.5 w-12 bg-gray-200"></span>
                        <span className="w-2 h-2 rounded-full bg-[#FFA500]"></span>
                        <span className="h-0.5 w-12 bg-gray-200"></span>
                    </div>
                </div>

                {/* Danh sách thẻ */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.id}
                            variants={fadeInUp}
                            className="group relative flex flex-col items-center pt-8 pb-4 bg-[#fff8f0] hover:bg-white rounded-t-full rounded-b-xl border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                            onClick={() => handleChangePage(cat.menuTab)}
                        >
                            {/* Vòng tròn ảnh */}
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                                <img src={cat.img} alt={cat.name} className="w-16 h-16 object-contain" />
                            </div>

                            <h4 className="font-bold text-gray-800 text-sm md:text-base text-center mb-1 group-hover:text-[#9e1c20] transition-colors">{cat.name}</h4>
                            <p className="text-xs text-gray-500">{cat.count} Available</p>

                            {/* Hiệu ứng viền dưới kiểu cọ vẽ (Optional CSS trick) */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#FFA500] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <div className="container mx-auto px-4">

                {/* --- FILTER TABS --- */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {category.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`relative px-8 py-3 rounded-full font-bold uppercase transition-all duration-300 clip-path-jagged cursor-pointer
                        ${activeTab === cat
                                    ? 'bg-[#9e1c20] text-white shadow-lg scale-105'
                                    : 'bg-[#fff8f0] text-gray-600 hover:bg-gray-100'}
                    `}
                        >
                            {cat}

                        </button>
                    ))}
                </div>

                {/* --- FOOD GRID --- */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-[#fff8f0] rounded-[40px] p-6 text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                {/* Hình ảnh */}
                                <div className="relative mb-6 flex justify-center items-center h-48">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-44 h-44 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                    />
                                </div>

                                {/* Giá tiền (Viên thuốc màu cam) */}
                                <div className="inline-block bg-[#FFA500] text-white font-bold text-lg px-6 py-1 rounded-full mb-4 shadow-md group-hover:bg-[#ff8c00] transition-colors">
                                    ${item.price}
                                </div>

                                {/* Thông tin */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Thông báo nếu không có sản phẩm */}
                {filteredItems.length === 0 && (
                    <div className="text-center text-gray-400 mt-10 italic">
                        Coming soon...
                    </div>
                )}

            </div>
        </section>
    );
};

export default BestSellingFood;