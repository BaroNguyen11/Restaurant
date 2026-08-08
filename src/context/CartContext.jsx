import React, { createContext, useContext, useState, useEffect, use } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api'; // Import client đã cấu hình
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                // A. NẾU ĐÃ LOGIN: Lấy từ Supabase
                const { data, error } = await supabase
                    .from('cart_items')
                    .select('*, product:products(*)')
                    .eq('user_id', user.id);

                if (data) {
                    // Format lại dữ liệu cho khớp với cấu trúc frontend
                    const formattedCart = data.map(item => ({
                        cart_item_id: item.id, // ID của dòng trong giỏ
                        id: item.product.id,   // ID sản phẩm
                        name: item.product.name,
                        image: item.product.image,
                        price: item.product.price,
                        salePrice: item.product.salePrice, // Nếu có
                        quantity: item.quantity
                    }));
                    setCartItems(formattedCart);
                }
            } else {
                // B. NẾU CHƯA LOGIN: Lấy từ LocalStorage
                const savedCart = localStorage.getItem('cartItems');
                if (savedCart) setCartItems(JSON.parse(savedCart));
            }
        };

        loadCart();
    }, [user]);
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);


    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            navigate('/signin');
            return;
        }
        let newCart = [];
        const existingIndex = cartItems.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
            newCart = [...cartItems];
            newCart[existingIndex] = {
                ...newCart[existingIndex],
                quantity: newCart[existingIndex].quantity + quantity
            };
        } else {
            newCart = [...cartItems, { ...product, quantity }];
        }

        setCartItems(newCart);
        // setIsCartOpen(true);

        // -- Đồng bộ lên Supabase --
        try {
            const { data: existingItem, error: fetchError } = await supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', user.id)
                .eq('product_id', product.id)
                .maybeSingle(); // Dùng maybeSingle cho an toàn

            if (fetchError) throw fetchError;

            if (existingItem) {
                // Nếu đã có -> Update số lượng
                await supabase
                    .from('cart_items')
                    .update({ quantity: existingItem.quantity + quantity })
                    .eq('id', existingItem.id);
            } else {
                // Nếu chưa có -> Insert mới
                await supabase
                    .from('cart_items')
                    .insert({
                        user_id: user.id,
                        product_id: product.id,
                        quantity: quantity
                    });
            }
        } catch (error) {
            console.error("Lỗi đồng bộ giỏ hàng:", error.message);
            // Có thể thêm toast error ở đây nếu muốn
        }
    };
    const removeFromCart = async (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));

        if (user) {
            await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
        }
    };

    // --- 5. HÀM UPDATE SỐ LƯỢNG ---
    const updateQuantity = async (productId, type) => {
        const currentItem = cartItems.find(item => item.id === productId);
        if (!currentItem) return;

        const newQty = type === 'plus' ? currentItem.quantity + 1 : currentItem.quantity - 1;
        if (newQty <= 0) return;

        // Cập nhật State
        setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item));

        // Cập nhật DB
        if (user) {
            await supabase
                .from('cart_items')
                .update({ quantity: newQty })
                .eq('user_id', user.id)
                .eq('product_id', productId);
        }
    };

    // --- 6. HÀM XÓA SẠCH GIỎ (Sau khi checkout) ---
    const clearCart = async () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        if (user) {
            await supabase.from('cart_items').delete().eq('user_id', user.id);
        }
    };

    // --- 7. HÀM XÓA CÁC MÓN ĐÃ CHỌN (Sau khi thanh toán từng món) ---
    const removeItemsFromCart = async (productIds) => {
        setCartItems((prev) => prev.filter((item) => !productIds.includes(item.id)));
        if (!user) {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                const filtered = parsed.filter((item) => !productIds.includes(item.id));
                localStorage.setItem('cartItems', JSON.stringify(filtered));
            }
        } else {
            await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .in('product_id', productIds);
        }
    };

    // Mở/Đóng giỏ hàng
    const toggleCart = () => {
        if (!user) {
            if (isCartOpen) {
                setIsCartOpen(false);
                return;
            }
            setShowLoginModal(true);
            return;
        }
        setIsCartOpen(!isCartOpen);
    };
    // Tính tổng tiền
    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.salePrice || item.price) * item.quantity,
        0
    );

    // Tính tổng số lượng item (để hiện badge trên icon)
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                toggleCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                cartTotal,
                cartCount,
                clearCart,
                removeItemsFromCart,
                showLoginModal,
                setShowLoginModal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};