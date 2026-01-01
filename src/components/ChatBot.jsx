import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { askClaude } from '../lib/authropic';
import { useNavigate } from 'react-router-dom';
const PRODUCT_MAPPING = {
    "Spicy Beef Burger": 1,
    "Seafood Pizza XL": 2,
    "Crispy Fried Chicken": 3,
    "Coca Cola Zero": 4,
    "Cheese Pasta": 5,
    "Double Cheeseburger": 6,
    "French Fries": 7,
    "Italian Pepperoni": 8
};
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am TasteNest AI Assistant. How can I help you today? 🍔' }
    ]);

    // Ref để tự động cuộn xuống cuối khi có tin nhắn mới
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Xử lý gửi tin nhắn
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();

        // Hiện tin nhắn của user
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await askClaude(userMessage);

            setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };
    const renderMessageContent = (text) => {
        const parts = text.split(/(\[.*?\])/g);
        return parts.map((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const dishName = part.slice(1, -1);
                const productId = PRODUCT_MAPPING[dishName];
                return (
                    <button
                        key={index}
                        onClick={() => {
                            if (productId) {
                                navigate(`/product/${productId}`);
                            } else {
                                navigate('/order/order_food');
                            }
                        }}
                        className="font-bold underline decoration-dotted hover:text-[#9f2121] hover:decoration-solid transition-colors cursor-pointer mx-1"
                        title="Click to order this dish"
                    >
                        {dishName}
                    </button>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };
    return (
        <div className="fixed bottom-6 right-6 z-9999 font-['Poppins']">

            {/* KHUNG CHAT WINDOW */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-20 right-0 w-87.5 sm:w-100 h-125 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden "
                    >
                        {/* Header */}
                        <div className="bg-[#9e1c20] p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">TasteNest Assistant</h3>
                                    <p className="text-xs text-white/80 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-[#9e1c20] text-white rounded-tr-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                      {msg.role === 'bot' ? renderMessageContent(msg.text) : msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-gray-500 text-sm">
                                        <Loader2 size={16} className="animate-spin" />
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about menu, booking..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
                            />
                            <button
                                disabled={isLoading || !input.trim()}
                                className="bg-[#9e1c20] text-white p-2.5 rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </form>

                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative flex items-center justify-center">
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: [0.0, 0.5, 0], scale: [1, 1.2, 1.5] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute w-14 h-14 bg-[#9e1c20] rounded-full z-0 pointer-events-none"
                    />
                )}


                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative z-10 bg-[#9e1c20] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 hover:bg-[#be252a] transition-colors cursor-pointer"
                >
                    {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                </motion.button>

            </div>
        </div>
    );
};

export default Chatbot;