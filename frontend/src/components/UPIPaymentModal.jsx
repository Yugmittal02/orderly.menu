import React, { useState } from "react";
import { FaTimes, FaLock, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import useRazorpay from "../hooks/useRazorpay";

const RazorpayPaymentModal = ({
  isOpen,
  onClose,
  amount,
  onRazorpaySuccess,
  customerInfo,
  items,
  orderType,
  deliveryAddress,
  customerNote,
}) => {
  // Razorpay hook
  const {
    initiatePayment,
    loading: razorpayLoading,
    error: razorpayError,
    setError: setRazorpayError,
  } = useRazorpay();

  // Handle Razorpay payment
  const handleRazorpayPayment = () => {
    setRazorpayError(null);

    initiatePayment({
      amount,
      customerInfo,
      items,
      orderType,
      deliveryAddress,
      customerNote,
      onSuccess: (result) => {
        console.log("Payment successful:", result);
        if (onRazorpaySuccess) {
          onRazorpaySuccess(result);
        }
        // Don't call onClose() here - navigation will unmount the component
        // Calling onClose could trigger state changes that cause race conditions
      },
      onFailure: (error) => {
        console.error("Payment failed:", error);
      },
      onDismiss: () => {
        console.log("Payment dismissed");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-light)] rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--text-dark)]">
                Secure Payment
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                Pay securely with Razorpay
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-[var(--bg-cream)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[#F5EAD6] transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Amount Display */}
        <div className="px-6 py-5">
          <div className="bg-[#FFF5EE] rounded-2xl p-5 border-2 border-[#C97B4B] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold mb-1 uppercase tracking-wide" style={{ color: '#C97B4B' }}>
                  Amount to Pay
                </p>
                <p className="text-4xl font-black" style={{ color: '#1C1C1C' }}>
                  ₹{amount.toFixed(0)}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(252, 128, 25, 0.1)', border: '1px solid rgba(252, 128, 25, 0.2)' }}>
                <FaLock size={12} color="#C97B4B" />
                <span className="text-xs font-bold" style={{ color: '#C97B4B' }}>SECURE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Razorpay Error Display */}
        {razorpayError && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {razorpayError}
            </div>
          </div>
        )}

        {/* Razorpay Payment */}
        <div className="px-6 pb-6">
          {/* Benefits */}
          <div className="bg-[var(--bg-cream)] rounded-2xl p-4 mb-5 border border-[var(--border-light)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FEF3E2] rounded-full -mr-10 -mt-10 opacity-50"></div>
            <h3 className="font-bold text-[var(--text-dark)] mb-3 flex items-center gap-2 relative z-10">
              <FaCheckCircle className="text-green-600" />
              Secure Payment with Razorpay
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-brown)] relative z-10">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C97B4B] rounded-full"></span>
                Instant payment confirmation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C97B4B] rounded-full"></span>
                UPI, Cards, Netbanking supported
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C97B4B] rounded-full"></span>
                100% secure & verified
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C97B4B] rounded-full"></span>
                Faster order processing
              </li>
            </ul>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handleRazorpayPayment}
            disabled={razorpayLoading}
            className="w-full py-4 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)',
              boxShadow: '0 8px 24px rgba(252, 128, 25, 0.35)'
            }}
          >
            {razorpayLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard size={18} className="opacity-90" />
                Pay ₹{amount.toFixed(0)} Securely
              </>
            )}
          </button>

          <p className="text-xs text-[var(--text-light)] text-center mt-4 flex items-center justify-center gap-1 font-medium">
            <FaLock size={10} />
            Secured by Razorpay
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default RazorpayPaymentModal;
