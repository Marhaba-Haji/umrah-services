import { useState } from 'react';

export interface ZiarathCartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  count: number;
}

export const useZiarathCart = () => {
  const [cartItems, setCartItems] = useState<ZiarathCartItem[]>([]);

  const addToCart = (item: Omit<ZiarathCartItem, 'count'>) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.id === item.id);
      if (existing) {
        return prev.map(ci => ci.id === item.id ? { ...ci, count: ci.count + 1 } : ci);
      } else {
        return [...prev, { ...item, count: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItemCount = (id: string, count: number) => {
    if (count <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, count } : item));
  };

  const clearCart = () => setCartItems([]);

  const getTotalAmount = () => cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.count, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    clearCart,
    getTotalAmount,
    getTotalItems,
  };
}; 