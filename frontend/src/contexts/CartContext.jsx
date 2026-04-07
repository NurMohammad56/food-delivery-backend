import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    setLoading(true);
    try {
      const response = await cartApi.get();
      setCart(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (menuItemId, quantity = 1) => {
    const response = await cartApi.add({ menuItemId, quantity });
    setCart(response.data.data);
    return response;
  };

  const updateQuantity = async (menuItemId, quantity) => {
    const response = await cartApi.update(menuItemId, { quantity });
    setCart(response.data.data);
    return response;
  };

  const removeItem = async (menuItemId) => {
    const response = await cartApi.remove(menuItemId);
    setCart(response.data.data);
    return response;
  };

  const clearCart = async () => {
    const response = await cartApi.clear();
    setCart(response.data.data);
    return response;
  };

  const value = useMemo(() => ({
    cart,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  }), [cart, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
