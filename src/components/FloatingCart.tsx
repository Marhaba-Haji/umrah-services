import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, X, CheckCircle } from "lucide-react";

const FloatingCart: React.FC = () => {
  const {
    cartItems,
    updateCartItemCount,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems,
  } = useCart();
  const [open, setOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevCount = useRef(cartItems.length);

  // Animate cart icon when item is added
  useEffect(() => {
    if (cartItems.length > prevCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    prevCount.current = cartItems.length;
  }, [cartItems.length]);

  // Only show floating cart if there is at least 1 item
  if (cartItems.length === 0) return null;

  // Handle checkout
  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setOpen(false);
      clearCart();
    }, 1800);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-200 to-amber-100 text-emerald-900 rounded-full shadow-2xl flex items-center px-6 py-4 hover:scale-105 transition-transform border-4 border-white/80 hover:from-emerald-300 hover:to-amber-200"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        style={{ boxShadow: "0 8px 32px 0 rgba(2, 63, 58, 0.25)" }}
      >
        <span className={cartBounce ? "animate-bounce" : ""}>
          <ShoppingCart className="w-6 h-6 mr-3" />
        </span>
        <span className="font-bold text-lg">Cart ({getTotalItems()})</span>
      </button>
      {/* Cart Modal/Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-3xl w-full max-w-sm p-0 m-4 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-xl px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <ShoppingCart className="w-5 h-5" />
                Your Cart
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Checkout Success */}
            {checkoutSuccess ? (
              <div className="flex flex-col items-center justify-center py-16">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                <div className="text-xl font-bold text-emerald-700 mb-2">
                  Checkout Successful!
                </div>
                <div className="text-gray-600 text-center">
                  Thank you for your booking. We will contact you soon with
                  confirmation details.
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Item List */}
                <div className="flex-1 overflow-y-auto max-h-80 px-6 py-2 divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-lg border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-base mb-1">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          ₹{item.price} each
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={item.count}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              updateCartItemCount(
                                item.id,
                                parseInt(e.target.value),
                              )
                            }
                            className="w-16 border rounded px-2 py-1 text-sm"
                            aria-label="Quantity"
                          />
                          <button
                            className="text-red-500 hover:text-red-700 p-2 rounded-full"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Sticky Footer */}
                <div className="sticky bottom-0 z-10 bg-white rounded-b-xl px-6 py-4 border-t flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-base">Total:</span>
                    <span className="text-xl font-bold text-emerald-700">
                      ₹{getTotalAmount().toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    className="w-full text-gray-500 text-sm mt-1 underline"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;
