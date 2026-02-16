import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerEntry from "./CustomerEntry";

const CartFooter = () => {
  const { cart, total, getItemCount } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [showCustomerEntry, setShowCustomerEntry] = useState(false);

  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  const handlePayNow = () => {
    if (!customer || !customer.name || !customer.phone) {
      setShowCustomerEntry(true);
      return;
    }

    // Go to cart page to select order type and proceed to payment
    navigate("/cart");
  };

  return (
    <>
      {/* Fixed Cart Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[hsl(var(--border))] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 safe-area-bottom">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Cart Summary */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--color-amber-500))] rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[hsl(var(--primary))] text-xs font-bold rounded-full flex items-center justify-center shadow-md border border-[hsl(var(--primary))]/20">
                  {itemCount}
                </span>
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </p>
                <p className="text-lg font-bold text-[hsl(var(--foreground))]">
                  ₹{(total || 0).toFixed(0)}
                </p>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayNow}
              className="h-12 px-6 rounded-xl text-base gap-2 shadow-lg shadow-[hsl(var(--primary))]/30"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Entry Modal */}
      {showCustomerEntry && (
        <div className="relative z-[100]">
          <CustomerEntry onClose={() => setShowCustomerEntry(false)} />
        </div>
      )}

      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </>
  );
};

export default CartFooter;
