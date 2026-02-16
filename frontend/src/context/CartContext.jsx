import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

// Helper to safely parse JSON from localStorage
const getStoredCart = () => {
  try {
    const stored = localStorage.getItem("sewashubham_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => getStoredCart());
  const [total, setTotal] = useState(0);

  // Calculate total whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => {
        const itemPrice = Number(item.price) || Number(item.basePrice) || 0;
        const itemQty = Number(item.quantity) || 1;
        return sum + (itemPrice * itemQty);
      },
      0,
    );
    setTotal(newTotal);
  }, [cart]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("sewashubham_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart]);

  const addToCart = (item) => {
    // Add with unique ID based on product, size, and addons
    const cartItem = {
      ...item,
      cartId: `${item._id}-${item.size || "default"}-${(item.selectedAddons || []).join("-")}-${Date.now()}`,
      quantity: 1,
    };
    setCart((prev) => [...prev, cartItem]);
  };

  const updateQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    // Also clear from localStorage
    try {
      localStorage.removeItem("sewashubham_cart");
    } catch (e) {
      console.error("Failed to clear cart from localStorage:", e);
    }
  };

  const getItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
