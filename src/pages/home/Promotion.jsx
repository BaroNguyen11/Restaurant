import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Flame, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Mock Data
const offers = [
    {
        id: 1,
        name: "Spicy Beef Burger",
        discount: 25,
        sold: 15,
        total: 20,
        originalPrice: 20.00,
        salePrice: 15.00,
        image: "https://png.pngtree.com/png-clipart/20250428/original/pngtree-hot-spicy-beef-burger-image-creat-png-image_20880960.png"
    },
    {

        id: 2,

        name: "Crispy Fried Chicken",

        discount: 15,

        sold: 45,

        total: 100,

        originalPrice: 18.00,

        salePrice: 15.30,

        image: "https://godrejyummiez.in/images/products/details/Non-Veg/Crispy_Fried_Chicken_Plate.png"

    },

    {

        id: 3,

        name: "Seafood Pizza XL",

        discount: 40,

        sold: 8,

        total: 10,

        originalPrice: 45.00,

        salePrice: 27.00,

        image: "https://citypizzadelivers.com/wp-content/uploads/2020/06/Pesto-Chicken-Artichoke.png"

    },

    {

        id: 4,

        name: "Fresh Garden Salad",

        discount: 10,

        sold: 22,

        total: 50,

        originalPrice: 12.00,

        salePrice: 10.80,

        image: "https://static.vecteezy.com/system/resources/previews/055/325/203/non_2x/fresh-garden-salad-served-on-a-transparent-plate-with-vibrant-vegetables-prepared-for-a-healthy-meal-salad-in-plate-isolated-on-transparent-background-free-png.png"

    },

    {

        id: 5,

        name: "Coca Cola Combo",

        discount: 50,

        sold: 90,

        total: 100,

        originalPrice: 8.00,

        salePrice: 4.00,

        image: "https://camperdowncellars.com.au/cdn/shop/files/cokecombo_1103x.png?v=1730178655"

    },

    {

        id: 6,

        name: "Cheese Pasta",

        discount: 20,

        sold: 30,

        total: 60,

        originalPrice: 25.00,

        salePrice: 20.00,

        image: "https://static.vecteezy.com/system/resources/previews/053/572/667/non_2x/penne-pasta-with-cheese-and-mushrooms-on-a-transparent-background-png.png"

    },
];

// --- 1. Create a separate component for the Card ---
const OfferCard = ({ item }) => {
    const [quantity, setQuantity] = useState(1);
    const stock = item.total - item.sold;
    const percentSold = (item.sold / item.total) * 100;
    const { addToCart } = useCart();
    
    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        if (quantity < stock) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const productToAdd = {
            ...item,
            price: item.salePrice, 
        };

        addToCart(productToAdd, quantity);

        setQuantity(1);

        // You might want to add a toast notification here
        // e.g., toast.success(`Added ${quantity} ${item.name} to cart!`);
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex gap-4 items-center group border border-gray-100"
        >
            {/* ... Image Section ... */}
            <div className="relative w-1/3 h-32 shrink-0 bg-[#fff8f0] rounded-xl flex items-center justify-center p-2">
                {/* ... Badge & Image ... */}
                <div className="absolute top-0 left-0 bg-[#9e1c20] text-white text-xs font-bold px-2 py-1 rounded-tl-xl rounded-br-lg z-10">
                    -{item.discount}%
                </div>
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* ... Info Section ... */}
            <div className="flex-1 flex flex-col justify-between h-full py-1">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 group-hover:text-[#9e1c20] transition-colors">
                        {item.name}
                    </h3>
                    <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
                        <span>Sold: {item.sold}</span>
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
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
    ];

    return (
        <section className="w-full py-20 bg-white font-['Poppins']">
            <div className="container mx-auto px-4">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    {/* ... Title section ... */}
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#9e1c20] text-white p-1 rounded-full"><Flame size={18} fill="white" /></span>
                            <h4 className="text-[#9e1c20] font-bold text-sm tracking-widest uppercase">Limited Time Offer</h4>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
                            Special <span className="text-[#FFA500] font-['Oleo_Script'] text-5xl md:text-6xl capitalize transform -rotate-3 inline-block">Deals</span> of the Day
                        </h2>
                    </div>

                    {/* ... Timer section ... */}
                    <div className="flex gap-3 md:gap-4">
                        {timerComponents.map((item, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="bg-[#9e1c20] text-white w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-colors duration-300">
                                    {formatNumber(item.value)}
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 mt-2 block uppercase tracking-wide">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- GRID CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((item) => (
                        // Use the new OfferCard component here
                        <OfferCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Promotion;