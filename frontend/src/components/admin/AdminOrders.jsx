import React, { useState } from 'react';
import {
    FaClock,
    FaSpinner,
    FaCheckCircle,
    FaTruck,
    FaMapMarkerAlt,
    FaExternalLinkAlt,
    FaClipboardList
} from 'react-icons/fa';

const AdminOrders = ({
    orders,
    onUpdateStatus,
    onAcceptOrder,
    onManualVerifyPayment
}) => {
    const [activeStatus, setActiveStatus] = useState('All');

    const statusConfig = {
        Pending: { icon: FaClock, bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
        Preparing: { icon: FaSpinner, bg: "bg-blue-100", text: "text-blue-700", label: "Preparing" },
        Ready: { icon: FaCheckCircle, bg: "bg-green-100", text: "text-green-700", label: "Ready" },
        Delivered: { icon: FaTruck, bg: "bg-gray-100", text: "text-gray-700", label: "Delivered" },
    };

    const getUrgencyLevel = (createdAt, status, isAccepted) => {
        if (status !== "Pending") return "normal";
        const minutes = (new Date() - new Date(createdAt)) / 1000 / 60;
        if (!isAccepted && minutes > 5) return "critical"; // Not accepted after 5 mins
        if (minutes > 15) return "critical"; // Still pending after 15 mins
        if (minutes > 10) return "high";
        if (minutes > 5) return "medium";
        return "normal";
    };

    const formatPendingTime = (createdAt) => {
        const minutes = Math.floor((new Date() - new Date(createdAt)) / 1000 / 60);
        if (minutes < 1) return "Just now";
        return `${minutes}m ago`;
    };

    const filteredOrders = activeStatus === 'All'
        ? orders
        : orders.filter(o => o.status === activeStatus);

    return (
        <div className="px-4 pb-20 pt-4">
            {/* Status Filter Tabs - Mobile Scrollable */}
            <div className="flex gap-2 overflow-x-auto pb-4 sticky top-0 bg-gray-50 z-30 -mx-4 px-4 scrollbar-hide">
                <button
                    onClick={() => setActiveStatus('All')}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeStatus === "All"
                            ? "bg-gray-800 text-white shadow-lg shadow-gray-200"
                            : "bg-white text-gray-500 border border-gray-100"
                        }`}
                >
                    All Orders ({orders.length})
                </button>
                {Object.keys(statusConfig).map((status) => {
                    const ConfigIcon = statusConfig[status].icon;
                    const count = orders.filter(o => o.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeStatus === status
                                    ? `${statusConfig[status].bg.replace('100', '500')} text-white shadow-lg`
                                    : "bg-white text-gray-500 border border-gray-100"
                                }`}
                        >
                            <ConfigIcon />
                            {status}
                            <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FaClipboardList className="text-5xl mx-auto mb-4 opacity-30" />
                        <p className="font-medium">No {activeStatus === 'All' ? '' : activeStatus} orders found</p>
                    </div>
                ) : filteredOrders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig["Pending"];
                    const urgency = getUrgencyLevel(order.createdAt, order.status, order.isAccepted);
                    const pendingTime = formatPendingTime(order.createdAt);
                    const ConfigIcon = config.icon;

                    return (
                        <div
                            key={order._id}
                            className={`bg-white p-5 rounded-3xl shadow-sm border transaction-all duration-300 ${urgency === "critical"
                                    ? "border-red-300 bg-red-50/50"
                                    : urgency === "high"
                                        ? "border-orange-200 bg-orange-50/50"
                                        : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            {/* Header: ID, Name, Timer */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-gray-800 text-lg">#{order._id.slice(-4).toUpperCase()}</span>
                                        {order.status === "Pending" && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${urgency === 'critical' ? 'bg-red-500 text-white animate-pulse' :
                                                    urgency === 'high' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white'
                                                }`}>
                                                <FaClock size={8} /> {pendingTime}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm mt-0.5">{order.user?.name}</p>
                                    <p className="text-xs text-gray-400">{order.orderType} • {order.paymentMethod}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-amber-600">₹{order.totalAmount?.toFixed(0)}</p>
                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold mt-1 ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                            order.paymentMethod === 'Cash' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.paymentStatus === 'Paid' ? 'PAID' : order.paymentMethod === 'Cash' ? 'CASH' : 'UNPAID'}
                                    </div>
                                </div>
                            </div>

                            {/* Address (Collapsible logic could be added here, but showing always for visibility) */}
                            {order.deliveryAddress && (
                                <div className="bg-gray-50 p-3 rounded-xl mb-4 text-xs text-gray-600">
                                    <div className="flex justify-between items-start">
                                        <p className="line-clamp-2 pr-2">
                                            <FaMapMarkerAlt className="inline mr-1 text-gray-400" />
                                            {order.deliveryAddress.manualAddress || order.deliveryAddress.address}
                                        </p>
                                        {order.deliveryAddress.coordinates && (
                                            <a
                                                href={`https://www.google.com/maps?q=${order.deliveryAddress.coordinates.lat},${order.deliveryAddress.coordinates.lng}`}
                                                target="_blank" rel="noreferrer"
                                                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200"
                                            >
                                                <FaExternalLinkAlt />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="space-y-2 mb-4">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <span className="font-medium text-gray-700">
                                            <span className="text-amber-600 font-bold mr-2">{item.quantity}x</span>
                                            {item.name}
                                        </span>
                                        <span className="text-gray-400 text-xs">{item.size}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions Area */}
                            <div className="space-y-3">
                                {/* Accept Button Logic */}
                                {order.status === "Pending" && !order.isAccepted && (
                                    order.paymentMethod === "Cash" || order.paymentStatus === "Paid" ? (
                                        <button
                                            onClick={() => onAcceptOrder(order._id)}
                                            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <FaCheckCircle /> Accept Order
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2">
                                            <FaSpinner className="animate-spin" /> Waiting Payment...
                                        </div>
                                    )
                                )}

                                {/* Manual Payment Verification */}
                                {order.paymentMethod === "Cash" && order.paymentStatus !== "Paid" && (
                                    <button
                                        onClick={() => onManualVerifyPayment(order._id)}
                                        className="w-full py-3 border-2 border-green-100 text-green-700 font-bold rounded-xl hover:bg-green-50 active:scale-[0.98]"
                                    >
                                        Mark Cash Received
                                    </button>
                                )}

                                {/* Status Progression Buttons */}
                                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                                    {['Pending', 'Preparing', 'Ready', 'Delivered'].map((status) => {
                                        const sConf = statusConfig[status];
                                        const SIcon = sConf.icon;
                                        const isActive = order.status === status;
                                        const isDisabled = (status !== "Pending" && !order.isAccepted);

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => onUpdateStatus(order._id, status)}
                                                disabled={isDisabled}
                                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive
                                                        ? `${sConf.bg.replace('100', '500')} text-white shadow-md`
                                                        : isDisabled
                                                            ? "opacity-30 grayscale cursor-not-allowed bg-gray-50"
                                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <SIcon size={14} className="mb-1" />
                                                <span className="text-[10px] font-bold">{status === 'Preparing' ? 'Prep' : status}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminOrders;
