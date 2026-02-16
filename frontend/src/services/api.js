import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Interceptor to add admin token to requests
API.interceptors.request.use((req) => {
  const adminToken = localStorage.getItem("adminToken");
  const customerToken = localStorage.getItem("customerToken");

  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  } else if (customerToken) {
    req.headers.Authorization = `Bearer ${customerToken}`;
  }
  return req;
});

// Auth
export const registerCustomer = (data) => API.post("/auth/customer", data);
export const adminLogin = (data) => API.post("/auth/admin/login", data);

// Products
export const fetchProducts = (category) =>
  API.get(`/products${category ? `?category=${category}` : ""}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const toggleProductAvailability = (id) =>
  API.patch(`/products/${id}/toggle-availability`);

// Orders
export const createOrder = (data) => API.post("/orders", data);
export const fetchOrderStatus = (id) => API.get(`/orders/track/${id}`);
export const fetchMyOrders = () => API.get("/orders/my-orders");
export const fetchAllOrders = () => API.get("/orders/all");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });
export const acceptOrder = (id) => API.put(`/orders/${id}/accept`);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);

// Offers
export const fetchOffers = () => API.get("/offers");
export const fetchAllOffersAdmin = () => API.get("/offers/admin");
export const createOffer = (data) => API.post("/offers", data);
export const updateOffer = (id, data) => API.put(`/offers/${id}`, data);
export const deleteOffer = (id) => API.delete(`/offers/${id}`);
export const validateCoupon = (code, orderTotal) =>
  API.post("/offers/validate", { code, orderTotal });

// Ratings
export const submitRating = (data) => API.post("/ratings", data);
export const fetchProductRatings = (productId) =>
  API.get(`/ratings/product/${productId}`);
export const fetchAllRatings = () => API.get("/ratings/all");

// Upload
export const uploadImage = (formData) =>
  API.post("/upload/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Settings
export const getUPISettings = () => API.get("/settings/upi");
export const getUPISettingsAdmin = () => API.get("/settings/upi/admin");
export const updateUPISettings = (data) => API.put("/settings/upi", data);
export const getStoreSettings = () => API.get("/settings/store");
export const updateStoreSettings = (data) => API.put("/settings/store", data);
export const verifySettingsPassword = (password, type) =>
  API.post("/settings/verify-password", { password, type });
export const changeSettingsPassword = (data) =>
  API.put("/settings/change-password", data);

// Fee Settings
export const getFeeSettings = () => API.get("/settings/fees");
export const updateFeeSettings = (data) => API.put("/settings/fees", data);
export const calculateDeliveryFee = (customerLat, customerLng, orderTotal) =>
  API.post("/settings/calculate-delivery", { customerLat, customerLng, orderTotal });

// Payments (Razorpay)
export const getRazorpayKey = () => API.get("/payments/key");
export const createPaymentOrder = (data) =>
  API.post("/payments/create-order", data);
export const verifyPayment = (data) => API.post("/payments/verify", data);
export const getPaymentStatus = (orderId) =>
  API.get(`/payments/status/${orderId}`);
export const manualVerifyPayment = (orderId, data) =>
  API.put(`/payments/manual-verify/${orderId}`, data);

// Payment Screenshot (for manual UPI verification)
export const uploadPaymentScreenshot = (orderId, screenshotUrl) =>
  API.put(`/orders/${orderId}/screenshot`, { screenshotUrl });
export const verifyPaymentScreenshotAdmin = (orderId, verified) =>
  API.put(`/orders/${orderId}/verify-payment`, { verified });

export default API;

