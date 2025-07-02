
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  type: string;
  name: string;
  price: number;
  details?: any;
}

interface CartValueWidgetProps {
  cartItems: CartItem[];
  onToggleCart?: () => void;
  className?: string;
}

const CartValueWidget: React.FC<CartValueWidgetProps> = ({ 
  cartItems, 
  onToggleCart,
  className = ""
}) => {
  const totalValue = cartItems.reduce((sum, item) => sum + item.price, 0);
  const itemCount = cartItems.length;

  if (itemCount === 0) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Button
        onClick={onToggleCart}
        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-full px-6 py-3 flex items-center gap-3 transition-all duration-300 hover:scale-105"
      >
        <ShoppingCart className="w-5 h-5" />
        <div className="flex flex-col items-start">
          <span className="text-xs opacity-90">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
          <span className="font-bold">₹{totalValue.toLocaleString()}</span>
        </div>
      </Button>
    </div>
  );
};

export default CartValueWidget;
