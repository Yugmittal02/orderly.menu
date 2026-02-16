import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaUtensils,
  FaSignOutAlt,
} from "react-icons/fa";

// Import Modular Components
import AdminLayout from "../components/admin/AdminLayout";
import AdminOrders from "../components/admin/AdminOrders";
import AdminMenu from "../components/admin/AdminMenu";
import AdminOffers from "../components/admin/AdminOffers";
import AdminCustomers from "../components/admin/AdminCustomers";
import AdminStats from "../components/admin/AdminStats";
import AdminSettings from "../components/admin/AdminSettings";

// Import Modals (Refactored)
import ProductFormModal from "../components/admin/ProductFormModal";
import OfferFormModal from "../components/admin/OfferFormModal";
import StoreLocationPicker from "../components/StoreLocationPicker";

// Import Services
import {
  adminLogin, // Not used here directly but maybe implicitly needed if I missed something? No.
  createProduct, // Used in modals, mostly.
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  fetchProducts,
  updateOrderStatus,
  fetchOffers, // Used in AdminOffers? No, fetched here.
  createOffer,
  deleteOffer,
  fetchAllOrders,
  getUPISettingsAdmin,
  updateUPISettings,
  getStoreSettings,
  updateStoreSettings,
  getFeeSettings,
  updateFeeSettings,
  manualVerifyPayment,
  acceptOrder,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin, isAdmin } = useAuth();

  // URL-based Tab State
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "orders";
  const setActiveTab = (tab) => setSearchParams({ tab });

  // Data State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  // Modals & Forms State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showStockConfirm, setShowStockConfirm] = useState(null);

  // Settings State (Lifted up for AdminSettings component)
  const [loading, setLoading] = useState(true);
  const [settingsForm, setSettingsForm] = useState({ upiId: "", payeeName: "" });
  const [storeSettings, setStoreSettings] = useState({
    isOpen: true,
    storeLatitude: null,
    storeLongitude: null,
  });
  const [feeSettings, setFeeSettings] = useState({
    baseFee: 40,
    perKmFee: 10,
    freeDeliveryThreshold: 500,
    maxDeliveryDistance: 15,
  });

  // Load Data
  useEffect(() => {
    loadOrders();
    loadProducts();
    loadOffers();
    loadSettings();

    // Poll for new orders every 30s
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await fetchAllOrders();
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOffers = async () => {
    try {
      const { data } = await fetchOffers(); // Corrected to use fetchOffers (public or admin?) - using service.
      setOffers(data);
    } catch (err) { console.error(err); }
  };

  const loadSettings = async () => {
    try {
      // Parallel fetch for speed
      const [upiRes, storeRes, feeRes] = await Promise.allSettled([
        getUPISettingsAdmin(),
        getStoreSettings(),
        getFeeSettings(),
      ]);

      if (upiRes.status === 'fulfilled' && upiRes.value.data) setSettingsForm(upiRes.value.data);
      if (storeRes.status === 'fulfilled' && storeRes.value.data) setStoreSettings(storeRes.value.data);
      if (feeRes.status === 'fulfilled' && feeRes.value.data) setFeeSettings(feeRes.value.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // --- Actions ---

  // Orders
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) { alert("Failed to update status"); }
  };

  const handleAcceptOrder = async (id) => {
    try {
      await acceptOrder(id);
      loadOrders();
    } catch (err) { alert("Failed to accept order"); }
  };

  const handleManualVerifyPayment = async (orderId) => {
    if (window.confirm("Verify this payment manually?")) {
      try {
        await manualVerifyPayment(orderId, { verificationNote: "Admin manual verify" });
        loadOrders();
      } catch (err) { alert("Verification failed"); }
    }
  };

  // Products
  const confirmToggleStock = async () => {
    if (showStockConfirm) {
      try {
        await toggleProductAvailability(showStockConfirm._id);
        loadProducts();
        setShowStockConfirm(null);
      } catch (err) { alert("Failed to toggle stock"); }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  // Offers
  const handleDeleteOffer = async (id) => {
    if (window.confirm("Delete offer?")) {
      await deleteOffer(id);
      loadOffers();
    }
  };

  // Settings
  const handleUpdateUPI = async () => {
    try { await updateUPISettings(settingsForm); alert("UPI updated"); } catch (e) { alert("Error updating UPI"); }
  };
  const handleUpdateStore = async () => {
    try { await updateStoreSettings(storeSettings); alert("Store settings updated"); } catch (e) { alert("Error updating Store"); }
  };
  const handleUpdateFees = async () => {
    try { await updateFeeSettings(feeSettings); alert("Fees updated"); } catch (e) { alert("Error updating Fees"); }
  };

  // Auth
  const handleLogout = () => {
    logoutAdmin();
    // navigate("/"); // Layout might handle this, or simple redirect
    window.location.href = "/"; // Force reload clear
  };

  // Derived Stats
  const todayOrders = useMemo(() =>
    orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()),
    [orders]);

  const todayRevenue = useMemo(() =>
    todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [todayOrders]);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Mobile Header (Sticky - Inside Layout Main) */}
      <header className="bg-gray-900 text-white px-4 py-4 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <FaUtensils className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
              <p className="text-xs text-gray-400">{admin?.name || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center active:bg-red-500/30"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <AdminOrders
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onAcceptOrder={handleAcceptOrder}
          onManualVerifyPayment={handleManualVerifyPayment}
        />
      )}

      {activeTab === 'menu' && (
        <AdminMenu
          products={products}
          onAdd={() => { setEditingProduct(null); setShowProductForm(true); }}
          onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
          onDelete={handleDeleteProduct}
          onToggleAvailability={(p) => setShowStockConfirm(p)}
        />
      )}

      {activeTab === 'offers' && (
        <AdminOffers
          offers={offers}
          onAdd={() => setShowOfferForm(true)}
          onDelete={handleDeleteOffer}
        />
      )}

      {activeTab === 'customers' && (
        <AdminCustomers orders={orders} />
      )}

      {activeTab === 'revenue' && (
        <AdminStats
          todayOrders={todayOrders}
          todayRevenue={todayRevenue}
          pendingOrders={pendingOrders}
        />
      )}

      {activeTab === 'settings' && (
        <AdminSettings
          settingsForm={settingsForm}
          setSettingsForm={setSettingsForm}
          storeSettings={storeSettings}
          setStoreSettings={setStoreSettings}
          feeSettings={feeSettings}
          setFeeSettings={setFeeSettings}
          onUpdateUPI={handleUpdateUPI}
          onUpdateStore={handleUpdateStore}
          onUpdateFees={handleUpdateFees}
          setShowMapPicker={setShowMapPicker}
        />
      )}

      {/* Modals */}
      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
          onSave={() => { loadProducts(); setShowProductForm(false); setEditingProduct(null); }}
        />
      )}

      {showOfferForm && (
        <OfferFormModal
          onClose={() => setShowOfferForm(false)}
          onSave={() => { loadOffers(); setShowOfferForm(false); }}
        />
      )}

      {/* Stock Toggle Confirmation Modal (Inline for now as it's simple) */}
      {showStockConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scale-up">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${showStockConfirm.isAvailable ? "bg-red-100" : "bg-green-100"
                  }`}
              >
                <span className="text-3xl">
                  {showStockConfirm.isAvailable ? "⚠️" : "✅"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {showStockConfirm.isAvailable
                  ? "Mark as Out of Stock?"
                  : "Mark as In Stock?"}
              </h3>
              <p className="text-gray-500 text-sm">
                Confirm stock update for
                <span className="font-bold text-gray-700"> "{showStockConfirm.name}"</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStockConfirm(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStock}
                className={`flex-1 py-3 font-bold rounded-xl active:scale-[0.98] transition-transform ${showStockConfirm.isAvailable
                  ? "bg-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-green-500 text-white shadow-lg shadow-green-200"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <StoreLocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        initialLocation={{
          lat: storeSettings.storeLatitude || 28.6139,
          lng: storeSettings.storeLongitude || 77.209,
        }}
        onSave={(location) => {
          setStoreSettings({ ...storeSettings, storeLatitude: location.lat, storeLongitude: location.lng });
          setShowMapPicker(false);
        }}
      />

    </AdminLayout>
  );
};

export default AdminDashboard;
