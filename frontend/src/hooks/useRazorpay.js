import { useState, useCallback } from "react";
import {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
} from "../services/api";

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState(null);

  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Fetch Razorpay key
  const fetchRazorpayKey = useCallback(async () => {
    try {
      const { data } = await getRazorpayKey();
      setRazorpayKey(data.keyId);
      return data.keyId;
    } catch (err) {
      console.error("Failed to fetch Razorpay key:", err);
      setError("Failed to initialize payment");
      return null;
    }
  }, []);

  // Initialize payment
  const initiatePayment = useCallback(
    async ({
      amount,
      customerInfo,
      items,
      orderType,
      deliveryAddress,
      customerNote,
      onSuccess,
      onFailure,
      onDismiss,
    }) => {
      setLoading(true);
      setError(null);

      try {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay SDK");
        }

        // Get Razorpay key
        let key = razorpayKey;
        if (!key) {
          key = await fetchRazorpayKey();
          if (!key) {
            throw new Error("Razorpay is not configured");
          }
        }

        // Create payment order on backend
        const { data } = await createPaymentOrder({
          amount,
          currency: "INR",
          customerInfo,
          items,
          orderType,
          deliveryAddress,
          customerNote,
        });

        // Store pending order ID in sessionStorage for UPI app return detection
        sessionStorage.setItem("pending_order_id", data.orderId);

        // Configure Razorpay options
        const options = {
          key: key,
          amount: data.amount,
          currency: data.currency,
          name: "SewaShubham Bakery",
          description: `Order Payment`,
          order_id: data.razorpayOrderId,
          prefill: {
            name: customerInfo?.name || "",
            contact: customerInfo?.phone || "",
          },
          notes: {
            orderId: data.orderId,
          },
          theme: {
            color: "#f97316", // Orange theme
          },
          // Store order info for recovery after UPI app redirect
          remember_customer: false,
          retry: {
            enabled: true,
            max_count: 3,
          },
          modal: {
            confirm_close: true,
            ondismiss: () => {
              setLoading(false);
              if (onDismiss) onDismiss();
            },
            // Handle when modal loses focus (UPI app switch)
            escape: false,
            animation: true,
          },
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyResponse = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              });

              // Clear pending order from sessionStorage on success
              sessionStorage.removeItem("pending_order_id");

              setLoading(false);
              if (onSuccess) {
                onSuccess({
                  orderId: data.orderId,
                  paymentId: response.razorpay_payment_id,
                  ...verifyResponse.data,
                });
              }
            } catch (err) {
              console.error("Payment verification error:", err);
              setLoading(false);

              // Clear pending order since we're handling it now
              sessionStorage.removeItem("pending_order_id");

              // Even if verification fails, if we have payment_id, the payment likely succeeded
              // The webhook will handle the actual verification
              // Navigate to success page and let it poll for status
              if (response.razorpay_payment_id) {
                console.log(
                  "Payment completed, navigating to success page despite verification error",
                );
                if (onSuccess) {
                  onSuccess({
                    orderId: data.orderId,
                    paymentId: response.razorpay_payment_id,
                    paymentPending: true, // Flag that verification is pending
                  });
                }
              } else {
                setError("Payment verification failed");
                if (onFailure) {
                  onFailure({
                    error: "Payment verification failed",
                    orderId: data.orderId,
                  });
                }
              }
            }
          },
        };

        // Open Razorpay checkout
        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
          setLoading(false);
          setError(response.error.description);
          if (onFailure) {
            onFailure({
              error: response.error.description,
              code: response.error.code,
              orderId: data.orderId,
            });
          }
        });

        razorpay.open();
      } catch (err) {
        setLoading(false);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Payment initiation failed";
        setError(errorMessage);
        if (onFailure) {
          onFailure({ error: errorMessage });
        }
      }
    },
    [loadRazorpayScript, fetchRazorpayKey, razorpayKey],
  );

  return {
    initiatePayment,
    loading,
    error,
    setError,
  };
};

export default useRazorpay;
