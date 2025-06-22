
import { useState } from 'react';

export interface CartItem {
  id: string;
  vehicleId: string;
  routeId: string;
  vehicleName: string;
  routeName: string;
  count: number;
  pricePerUnit: number;
  totalPrice: number;
}

export const useTransportCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    const id = `${item.vehicleId}-${item.routeId}`;
    const totalPrice = item.count * item.pricePerUnit;
    
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          count: item.count,
          totalPrice
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prev, { ...item, id, totalPrice }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItemCount = (id: string, count: number) => {
    if (count === 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, count, totalPrice: count * item.pricePerUnit }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.count, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    clearCart,
    getTotalAmount,
    getTotalItems
  };
};
