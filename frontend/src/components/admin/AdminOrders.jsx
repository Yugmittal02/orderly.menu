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
        Pending: { icon: FaClock, color: '#EAB308', bg: '#FEF9C3', label: "Pending" },
        Preparing: { icon: FaSpinner, color: '#3B82F6', bg: '#DBEAFE', label: "Preparing" },
        Ready: { icon: FaCheckCircle, color: '#16A34A', bg: '#DCFCE7', label: "Ready" },
        Delivered: { icon: FaTruck, color: '#7E7E7E', bg: '#F3F4F6', label: "Delivered" },
    };

    const getUrgencyLevel = (createdAt, status, isAccepted) => {
        if (status !== "Pending") return "normal";
        const minutes = (new Date() - new Date(createdAt)) / 1000 / 60;
        if (!isAccepted && minutes > 5) return "critical";
        if (minutes > 15) return "critical";
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

    const getUrgencyBorder = (urgency) => {
        if (urgency === 'critical') return '2px solid #FCA5A5';
        if (urgency === 'high') return '2px solid #FED7AA';
        return '2px solid #E8E3DB';
    };

    return (
        <div className="px-4 pb-20 pt-4">
            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 sticky top-0 z-30 -mx-4 px-4 scrollbar-hide"
                style={{ background: '#FAF7F2' }}>
                <button
                    onClick={() => setActiveStatus('All')}
                    className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    style={activeStatus === 'All'
                        ? { background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(201, 123, 75, 0.3)' }
                        : { background: '#FFFFFF', color: '#A0998F', border: '2px solid #E8E3DB' }
                    }
                >
                    All Orders ({orders.length})
                </button>
                {Object.keys(statusConfig).map((status) => {
                    const conf = statusConfig[status];
                    const ConfigIcon = conf.icon;
                    const count = orders.filter(o => o.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            style={activeStatus === status
                                ? { background: conf.color, color: '#FFFFFF', boxShadow: `0 4px 12px ${conf.color}40` }
                                : { background: '#FFFFFF', color: '#A0998F', border: '2px solid #E8E3DB' }
                            }
                        >
                            <ConfigIcon />
                            {status}
                            <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{count}</span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                            style={{ background: '#FEF3E2', border: '3px solid #E8E3DB' }}>
                            <FaClipboardList size={28} style={{ color: '#C97B4B' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#7E7E7E' }}>No {activeStatus === 'All' ? '' : activeStatus} orders found</p>
                    </div>
                ) : filteredOrders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig["Pending"];
                    const urgency = getUrgencyLevel(order.createdAt, order.status, order.isAccepted);
                    const pendingTime = formatPendingTime(order.createdAt);
                    const ConfigIcon = config.icon;

                    return (
                        <div
                            key={order._id}
                            className="p-5 rounded-3xl transition-all duration-300"
                            style={{
                                background: urgency === 'critical' ? '#FFF5F5' : urgency === 'high' ? '#FFFBF0' : '#FFFFFF',
                                border: getUrgencyBorder(urgency),
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-lg" style={{ color: '#1C1C1C' }}>#{order._id.slice(-4).toUpperCase()}</span>
                                        {order.status === "Pending" && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-white ${urgency === 'critical' ? 'animate-pulse' : ''
                                                }`}
                                                style={{ background: urgency === 'critical' ? '#DC2626' : urgency === 'high' ? '#EA580C' : '#EAB308' }}>
                                                <FaClock size={8} /> {pendingTime}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm mt-0.5" style={{ color: '#1C1C1C' }}>{order.user?.name}</p>
                                    <p className="text-xs" style={{ color: '#A0998F' }}>{order.orderType} • {order.paymentMethod}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black" style={{ color: '#C97B4B' }}>₹{order.totalAmount}</p>
                                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold mt-1"
                                        style={order.paymentStatus === 'Paid'
                                            ? { background: '#DCFCE7', color: '#16A34A' }
                                            : order.paymentMethod === 'Cash'
                                                ? { background: '#FAF7F2', color: '#7E7E7E' }
                                                : { background: '#FEE2E2', color: '#DC2626' }
                                        }>
                                        {order.paymentStatus === 'Paid' ? 'PAID' : order.paymentMethod === 'Cash' ? 'CASH' : 'UNPAID'}
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            {order.deliveryAddress && (
                                <div className="p-3 rounded-xl mb-4 text-xs"
                                    style={{ background: '#FAF7F2', color: '#7E7E7E', border: '1px solid #E8E3DB' }}>
                                    <div className="flex justify-between items-start">
                                        <p className="line-clamp-2 pr-2">
                                            <FaMapMarkerAlt className="inline mr-1" style={{ color: '#C97B4B' }} />
                                            {order.deliveryAddress.manualAddress || order.deliveryAddress.address}
                                        </p>
                                        {order.deliveryAddress.coordinates && (
                                            <a
                                                href={`https://www.google.com/maps?q=${order.deliveryAddress.coordinates.lat},${order.deliveryAddress.coordinates.lng}`}
                                                target="_blank" rel="noreferrer"
                                                className="p-2 rounded-lg"
                                                style={{ background: '#FEF3E2', color: '#C97B4B' }}
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
                                    <div key={idx} className="flex justify-between items-center text-sm pb-2 last:pb-0"
                                        style={{ borderBottom: '1px solid #F5F0E8' }}>
                                        <span className="font-medium" style={{ color: '#1C1C1C' }}>
                                            <span className="font-bold mr-2" style={{ color: '#C97B4B' }}>{item.quantity}x</span>
                                            {item.name}
                                        </span>
                                        <span className="text-xs" style={{ color: '#A0998F' }}>{item.size}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {order.status === "Pending" && !order.isAccepted && (
                                    order.paymentMethod === "Cash" || order.paymentStatus === "Paid" ? (
                                        <button
                                            onClick={() => onAcceptOrder(order._id)}
                                            className="w-full py-3.5 text-white font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)', boxShadow: '0 4px 16px rgba(22, 163, 74, 0.3)' }}
                                        >
                                            <FaCheckCircle /> Accept Order
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2"
                                            style={{ background: '#FEF9C3', color: '#A16207', border: '2px solid #FDE68A' }}>
                                            <FaSpinner className="animate-spin" /> Waiting Payment...
                                        </div>
                                    )
                                )}

                                {order.paymentMethod === "Cash" && order.paymentStatus !== "Paid" && (
                                    <button
                                        onClick={() => onManualVerifyPayment(order._id)}
                                        className="w-full py-3 font-bold rounded-xl active:scale-[0.98]"
                                        style={{ background: '#FFFFFF', color: '#16A34A', border: '2px solid #DCFCE7' }}
                                    >
                                        Mark Cash Received
                                    </button>
                                )}

                                {/* Status Progression */}
                                <div className="grid grid-cols-4 gap-2 pt-2" style={{ borderTop: '2px solid #F5F0E8' }}>
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
                                                className="flex flex-col items-center justify-center p-2 rounded-xl transition-all"
                                                style={isActive
                                                    ? { background: sConf.color, color: '#FFFFFF', boxShadow: `0 4px 12px ${sConf.color}30` }
                                                    : isDisabled
                                                        ? { opacity: 0.3, background: '#FAF7F2', cursor: 'not-allowed' }
                                                        : { background: '#FAF7F2', color: '#A0998F' }
                                                }
                                            >
                                                <SIcon size={14} className="mb-1" />
                                                <span className="text-[10px] font-bold">{status === 'Preparing' ? 'Prep' : status}</span>
                                            </button>
                                        );
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
