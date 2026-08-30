import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Load cart from localStorage (guest) or stay empty (logged-in managed in state)
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
