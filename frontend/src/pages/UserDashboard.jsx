import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/api';
import {
    FaArrowLeft, FaReceipt, FaClock, FaCheckCircle, FaSpinner, FaUtensils,
    FaBoxOpen, FaUser, FaMapMarkerAlt, FaEdit, FaHeart, FaCrown, FaStar,
    FaGift, FaPercent, FaBell
} from 'react-icons/fa';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { customer, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customer) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [customer, navigate]);

    const loadOrders = useCallback(async () => {
        try {
            const { data } = await fetchMyOrders();
            setOrders(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FaCheckCircle className="text-green-500" />;
            case 'preparing': return <FaUtensils className="text-orange-500" />;
            case 'out_for_delivery': return <FaBoxOpen className="text-blue-500" />;
            default: return <FaClock className="text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return { bg: '#DCFCE7', text: '#166534' };
            case 'preparing': return { bg: '#FEF3C7', text: '#92400E' };
            case 'out_for_delivery': return { bg: '#DBEAFE', text: '#1E40AF' };
            case 'cancelled': return { bg: '#FEE2E2', text: '#991B1B' };
            default: return { bg: '#FEF3E2', text: '#6B4423' };
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!customer) return null;

    return (
        <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #FAF7F2 100%)' }}>
            {/* Header */}
            <header className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between"
                style={{ background: 'linear-gradient(180deg, #2D1F16 0%, #3D2B1F 100%)', borderBottom: '3px solid #C9A962' }}>
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <FaArrowLeft size={18} color="#D4B896" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    <h1 className="text-xl font-script" style={{ color: '#D4B896' }}>My Account</h1>
                </div>
                <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-full flex items-center justify-center relative"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <FaBell size={16} color="#D4B896" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
                </button>
            </header>

            {/* Profile Card */}
            <div className="mx-4 mt-4 p-6 rounded-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #4A3728 100%)', boxShadow: '0 8px 32px rgba(74, 55, 40, 0.25)' }}>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: 'rgba(201, 169, 98, 0.1)' }}></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full" style={{ background: 'rgba(201, 169, 98, 0.1)' }}></div>

                <div className="relative flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4B87A 100%)', boxShadow: '0 4px 12px rgba(201, 169, 98, 0.4)' }}>
                        <span className="text-3xl">😊</span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{customer.phone}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(201, 169, 98, 0.2)' }}>
                                <FaCrown size={10} color="#C9A962" />
                                <span className="text-[10px] font-bold" style={{ color: '#C9A962' }}>MEMBER</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <FaStar size={10} color="#F5A623" />
                                <span className="text-[10px] font-bold text-white">{orders.length} Orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
                <button onClick={() => navigate('/address/add')}
                    className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105"
                    style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 12px rgba(74, 55, 40, 0.06)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FEF3E2' }}>
                        <FaMapMarkerAlt size={16} color="#6B4423" />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#4A3728' }}>Address</span>
                </button>
                <button onClick={() => navigate('/favorites')}
                    className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105"
                    style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 12px rgba(74, 55, 40, 0.06)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                        <FaHeart size={16} color="#E57373" />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#4A3728' }}>Favorites</span>
                </button>
                <button onClick={() => navigate('/offers')}
                    className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105"
                    style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 12px rgba(74, 55, 40, 0.06)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                        <FaPercent size={14} color="#22C55E" />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#4A3728' }}>Offers</span>
                </button>
            </div>

            {/* Loyalty Card */}
            <div className="mx-4 mt-4 p-4 rounded-2xl flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4B87A 100%)' }}>
                    <FaGift size={24} color="#3D2B1F" />
                </div>
                <div className="flex-1">
                    <p className="font-bold" style={{ color: '#6B4423' }}>🎉 Loyalty Points</p>
                    <p className="text-sm" style={{ color: '#8B7355' }}>Earn points on every order!</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: '#6B4423' }}>{orders.length * 50}</p>
                    <p className="text-[10px]" style={{ color: '#8B7355' }}>points</p>
                </div>
            </div>

            {/* Orders Section */}
            <div className="mx-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FaReceipt size={18} color="#6B4423" />
                        <h3 className="font-bold" style={{ color: '#4A3728' }}>My Orders</h3>
                    </div>
                    <span className="text-sm" style={{ color: '#8B7355' }}>{orders.length} total</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <FaSpinner className="animate-spin" size={24} color="#6B4423" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl" style={{ background: 'white', border: '2px solid #E8E3DB' }}>
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="font-semibold" style={{ color: '#4A3728' }}>No orders yet</p>
                        <p className="text-sm mt-1 mb-4" style={{ color: '#8B7355' }}>Start ordering delicious treats!</p>
                        <button onClick={() => navigate('/menu')}
                            className="px-6 py-3 rounded-xl text-white font-semibold"
                            style={{ background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)' }}>
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.slice(0, 5).map((order, index) => {
                            const statusStyle = getStatusColor(order.status);
                            return (
                                <div key={order._id}
                                    className="p-4 rounded-2xl animate-fade-in"
                                    style={{ background: 'white', border: '2px solid #E8E3DB', animationDelay: `${index * 0.1}s` }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: '#4A3728' }}>
                                                #{order._id?.slice(-6).toUpperCase()}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: '#8B7355' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                            style={{ background: statusStyle.bg, color: statusStyle.text }}>
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status?.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm" style={{ color: '#8B7355' }}>
                                            {order.items?.length} items
                                        </p>
                                        <p className="font-bold" style={{ color: '#6B4423' }}>₹{order.total}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Logout Button */}
            <div className="mx-4 mt-6">
                <button onClick={handleLogout}
                    className="w-full py-4 rounded-2xl font-semibold border-2 transition-all hover:bg-red-50"
                    style={{ borderColor: '#E57373', color: '#E57373' }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
