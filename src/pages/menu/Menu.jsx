import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ChefHat, Coffee, Utensils, Pizza, IceCream, Beer, Flame, Leaf, WheatOff } from 'lucide-react';

// --- MOCK DATA ---
const menuCategories = [
    { id: 'starters', label: 'Starters', icon: ChefHat },
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'main', label: 'Main Course', icon: Utensils },
    { id: 'pizza', label: 'Pizza & Burger', icon: Pizza },
    { id: 'dessert', label: 'Dessert', icon: IceCream },
    { id: 'drinks', label: 'Drinks', icon: Beer },
];

const menuItems = {
    starters: [
        { name: "Tomato Bruschetta", price: 8.50, desc: "Grilled foccacia, fresh tomatoes, garlic, basil, olive oil.", tags: ['veg'] },
        { name: "Avocado Shrimp Salad", price: 12.00, desc: "Fresh avocado, shrimps, corn, cucumber, red onion.", tags: ['gf'] },
        { name: "Crispy Calamari", price: 10.50, desc: "Fried squid rings served with spicy marinara sauce.", tags: ['spicy'] },
        { name: "Mushroom Soup", price: 7.00, desc: "Creamy mushroom soup with truffle oil and croutons.", tags: ['veg'] },
    ],
    breakfast: [
        { name: "Classic Pancakes", price: 9.00, desc: "Served with maple syrup, fresh berries and whipped cream.", tags: ['veg'] },
        { name: "Eggs Benedict", price: 11.50, desc: "Poached eggs, ham, english muffin, hollandaise sauce.", tags: [] },
        { name: "Avocado Toast", price: 10.00, desc: "Sourdough bread, mashed avocado, poached egg, chili flakes.", tags: ['spicy', 'veg'] },
    ],
    main: [
        { name: "Grilled Salmon", price: 22.00, desc: "Fresh salmon fillet, asparagus, lemon butter sauce.", tags: ['gf'] },
        { name: "Ribeye Steak", price: 28.50, desc: "10oz Ribeye, garlic mashed potatoes, grilled vegetables.", tags: [] },
        { name: "Chicken Parmesan", price: 19.00, desc: "Breaded chicken breast, marinara sauce, melted mozzarella.", tags: [] },
        { name: "Truffle Risotto", price: 18.00, desc: "Arborio rice, black truffle, parmesan cheese.", tags: ['veg', 'gf'] },
    ],
    pizza: [
        { name: "Margherita Pizza", price: 14.00, desc: "Tomato sauce, fresh mozzarella, basil.", tags: ['veg'] },
        { name: "Pepperoni Feast", price: 16.50, desc: "Tomato sauce, mozzarella, double pepperoni.", tags: ['spicy'] },
        { name: "BBQ Chicken Burger", price: 15.00, desc: "Grilled chicken, bbq sauce, coleslaw, brioche bun.", tags: [] },
    ],
    dessert: [
        { name: "Chocolate Lava Cake", price: 9.50, desc: "Warm chocolate cake with a liquid center, vanilla ice cream.", tags: ['veg'] },
        { name: "Tiramisu", price: 8.00, desc: "Classic Italian dessert with coffee, mascarpone, cocoa.", tags: ['veg'] },
        { name: "Cheesecake", price: 8.50, desc: "New York style cheesecake with strawberry topping.", tags: ['veg'] },
    ],
    drinks: [
        { name: "Fresh Mojito", price: 7.00, desc: "Rum, lime, mint, soda water.", tags: [] },
        { name: "Iced Latte", price: 5.00, desc: "Espresso, cold milk, ice, vanilla syrup.", tags: ['veg'] },
        { name: "Berry Smoothie", price: 6.50, desc: "Mixed berries, yogurt, honey.", tags: ['veg', 'gf'] },
    ]
};

// Helper để render icon tags
const TagIcon = ({ type }) => {
    if (type === 'spicy') return <span title="Spicy" className="text-red-500"><Flame size={14} /></span>;
    if (type === 'veg') return <span title="Vegetarian" className="text-green-500"><Leaf size={14} /></span>;
    if (type === 'gf') return <span title="Gluten Free" className="text-yellow-500"><WheatOff size={14} /></span>;
    return null;
};

const Menu = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy giá trị 'tab' trên URL, nếu không có thì mặc định là 'main'
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'main');

    // 3. Lắng nghe sự thay đổi của URL
    // (Để khi đang ở trang Menu mà bấm Navbar sang tab khác thì nó tự đổi theo)
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    // Hàm xử lý khi bấm nút chuyển tab thủ công
    const handleTabChange = (id) => {
        setActiveTab(id);
        setSearchParams({ tab: id }); // Cập nhật luôn URL cho đồng bộ
    };
    return (
        <div className="w-full bg-white font-['Poppins'] pt-24 pb-20">

            {/* --- HERO SECTION --- */}
            <section className="text-center mb-16 px-4">
                <h4 className="text-[#FFA500] font-bold text-sm tracking-widest uppercase mb-2">Discover</h4>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 font-['Oleo_Script']">
                    Our Tasty <span className="text-[#9e1c20]">Menu</span>
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Explore our wide range of dishes, crafted with passion and the finest ingredients.
                    From quick bites to elaborate feasts, we have something for every craving.
                </p>
            </section>

            <div className="container mx-auto px-4">

                {/* --- CATEGORY TABS --- */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {menuCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleTabChange(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${activeTab === cat.id
                                ? 'bg-[#9e1c20] text-white border-[#9e1c20] shadow-lg scale-105'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-[#FFA500] hover:text-[#FFA500]'
                                }`}
                        >
                            <cat.icon size={18} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* --- MENU LIST LAYOUT --- */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
                        >
                            {menuItems[activeTab]?.map((item, index) => (
                                <div key={index} className="group">
                                    <div className="flex items-baseline justify-between border-b-2 border-dotted border-gray-200 pb-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#9e1c20] transition-colors flex items-center gap-2">
                                            {item.name}
                                            <div className="flex gap-1 opacity-70">
                                                {item.tags.map(tag => <TagIcon key={tag} type={tag} />)}
                                            </div>
                                        </h3>
                                        <span className="text-xl font-black text-[#9e1c20]">${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-gray-500 text-sm leading-relaxed w-3/4">
                                            {item.desc}
                                        </p>
                                        {/* Nút Order nhỏ dẫn sang trang Order */}
                                        <Link to="/order/order_food">
                                            <button className="text-xs font-bold uppercase tracking-wider text-[#FFA500] hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-300">
                                                Order +
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* --- LEGEND & CTA --- */}
                <div className="mt-20 text-center border-t border-gray-100 pt-10">
                    {/* Chú thích icon */}
                    <div className="flex justify-center gap-6 mb-10 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><Flame size={16} className="text-red-500" /> Spicy</span>
                        <span className="flex items-center gap-2"><Leaf size={16} className="text-green-500" /> Vegetarian</span>
                        <span className="flex items-center gap-2"><WheatOff size={16} className="text-yellow-500" /> Gluten Free</span>
                    </div>

                    <div className="bg-[#fff8f0] rounded-[30px] p-10 inline-block max-w-3xl w-full relative overflow-hidden">
                        <img src="https://static.vecteezy.com/system/resources/previews/027/214/956/non_2x/fresh-basil-leaf-isolated-on-transparent-background-png.png" className="absolute -top-5 -left-5 w-24 opacity-50 rotate-45" alt="leaf" />
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Fall in love with our taste?</h2>
                        <p className="text-gray-600 mb-8">Make a reservation to enjoy the atmosphere or order online to enjoy at home.</p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/order/order_table">
                                <button className="px-8 py-3 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors w-full sm:w-auto">
                                    Book A Table
                                </button>
                            </Link>
                            <Link to="/order/order_food">
                                <button className="px-8 py-3 rounded-full bg-[#9e1c20] text-white font-bold shadow-lg shadow-red-200 hover:shadow-none transition-all w-full sm:w-auto">
                                    Order Online
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Menu;