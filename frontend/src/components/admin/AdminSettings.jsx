import React from 'react';
import { FaQrcode, FaStore, FaTruck, FaLock } from 'react-icons/fa';

const AdminSettings = ({
    settingsForm,
    setSettingsForm,
    storeSettings,
    setStoreSettings,
    feeSettings,
    setFeeSettings,
    onUpdateUPI,
    onUpdateStore,
    onUpdateFees,
    setShowMapPicker
}) => {
    return (
        <div className="px-4 pb-20 pt-4 space-y-6">
            <h2 className="text-2xl font-black text-gray-800 mb-6 sticky top-0 bg-gray-50 z-30 pb-4">Settings</h2>

            {/* UPI Settings */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <FaQrcode />
                    </div>
                    <h3 className="font-bold text-gray-800">UPI Payments</h3>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">UPI ID</label>
                        <input
                            type="text"
                            value={settingsForm.upiId}
                            onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            placeholder="e.g. business@upi"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Payee Name</label>
                        <input
                            type="text"
                            value={settingsForm.payeeName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, payeeName: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            placeholder="Business Name"
                        />
                    </div>
                    <button
                        onClick={onUpdateUPI}
                        className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98]"
                    >
                        Update UPI Details
                    </button>
                </div>
            </div>

            {/* Store Settings */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        <FaStore />
                    </div>
                    <h3 className="font-bold text-gray-800">Store Details</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Store Status</label>
                            <select
                                value={storeSettings.isOpen ? "open" : "closed"}
                                onChange={(e) => setStoreSettings({ ...storeSettings, isOpen: e.target.value === "open" })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowMapPicker(true)}
                        className="w-full py-3 border-2 border-purple-100 text-purple-600 font-bold rounded-xl hover:bg-purple-50"
                    >
                        📍 Set Store Location
                    </button>
                    <button
                        onClick={onUpdateStore}
                        className="w-full py-3 bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 active:scale-[0.98]"
                    >
                        Save Store Settings
                    </button>
                </div>
            </div>

            {/* Delivery Fees */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <FaTruck />
                    </div>
                    <h3 className="font-bold text-gray-800">Delivery Fees</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Base Fee (₹)</label>
                        <input
                            type="number"
                            value={feeSettings.baseFee}
                            onChange={(e) => setFeeSettings({ ...feeSettings, baseFee: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Per km (₹)</label>
                        <input
                            type="number"
                            value={feeSettings.perKmFee}
                            onChange={(e) => setFeeSettings({ ...feeSettings, perKmFee: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Free Above (₹)</label>
                        <input
                            type="number"
                            value={feeSettings.freeDeliveryThreshold}
                            onChange={(e) => setFeeSettings({ ...feeSettings, freeDeliveryThreshold: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Max Dist (km)</label>
                        <input
                            type="number"
                            value={feeSettings.maxDeliveryDistance}
                            onChange={(e) => setFeeSettings({ ...feeSettings, maxDeliveryDistance: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                        />
                    </div>
                </div>
                <button
                    onClick={onUpdateFees}
                    className="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-200 active:scale-[0.98]"
                >
                    Update Fee Rules
                </button>
            </div>

            {/* Password Reset Section (Placeholder for Security) */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 opacity-50">
                <div className="flex items-center gap-3">
                    <FaLock className="text-gray-400" />
                    <h3 className="font-bold text-gray-500">Admin Password</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Change password functionality coming soon.</p>
            </div>

        </div>
    );
};

export default AdminSettings;
