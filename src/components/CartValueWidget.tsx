
import React from 'react';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'transport' | 'visa' | 'guide' | 'ziarath';
  name: string;
  price: number;
  details?: any;
}

interface CartValueWidgetProps {
  cartItems: CartItem[];
  className?: string;
}

const CartValueWidget: React.FC<CartValueWidgetProps> = ({ cartItems, className }) => {
  const totalValue = cartItems.reduce((sum, item) => sum + item.price, 0);
  const itemCount = cartItems.length;

  if (itemCount === 0) return null;

  return (
    <Card className={`fixed bottom-4 right-4 z-50 p-4 bg-emerald-600 text-white shadow-lg border-0 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Cart Total</span>
          <span className="text-lg font-bold">₹{totalValue.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default CartValueWidget;
