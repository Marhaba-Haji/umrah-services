import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface ZiarathCartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  count: number;
}

interface CartContextType {
  cartItems: ZiarathCartItem[];
  addToCart: (item: Omit<ZiarathCartItem, "count">) => void;
  removeFromCart: (id: string) => void;
  updateCartItemCount: (id: string, count: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ziarath_cart_items";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ZiarathCartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<ZiarathCartItem, "count">) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, count: ci.count + 1 } : ci,
        );
      } else {
        return [...prev, { ...item, count: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartItemCount = (id: string, count: number) => {
    if (count <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count } : item)),
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalAmount = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemCount,
        clearCart,
        getTotalAmount,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
