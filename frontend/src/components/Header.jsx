import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaArrowLeft } from 'react-icons/fa';

import logo from '../assets/brand_logo.png';

const Header = () => {
    const { getItemCount } = useCart();
    const { customer } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const itemCount = getItemCount();

    const showBackButton = location.pathname !== '/' && location.pathname !== '/menu';

    return (
        <header className="sticky top-0 z-50" style={{ background: '#FDF8F4' }}>
            <div className="mx-3 my-2 px-4 py-3" style={{
                background: '#FFF8F0',
                borderRadius: '20px',
                boxShadow: '0 2px 16px rgba(45,24,16,0.07)'
            }}>
                <div className="flex justify-between items-center">
                    {/* Left - Logo Badge */}
                    <div className="flex items-center gap-2.5">
                        {showBackButton && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FaArrowLeft size={16} color="#4A3728" />
                            </button>
                        )}
                        <div
                            className="cursor-pointer active:scale-95 transition-transform"
                            onClick={() => navigate('/')}
                        >
                            <img
                                src={logo}
                                alt="Sewa Shubham Bakery"
                                style={{
                                    height: '44px',
                                    width: '44px',
                                    objectFit: 'cover',
                                    borderRadius: '14px',
                                    boxShadow: '0 2px 8px rgba(45,24,16,0.10)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Center - Brand Name */}
                    <div className="flex-1 text-center px-2">
                        <h1 className="text-lg font-extrabold leading-tight m-0" style={{ color: '#2D1810', letterSpacing: '0.02em' }}>
                            Sewa Shubham
                        </h1>
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase m-0" style={{ color: '#C97B4B' }}>
                            BAKERY
                        </p>
                    </div>

                    {/* Right - Account + Cart */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(customer ? '/dashboard' : '/login')}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
                            style={{ background: 'transparent', border: '2px solid #D4B896' }}
                            aria-label="Account"
                        >
                            <FaUser size={14} color="#8B7355" />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
                            style={{ background: '#E8956A', boxShadow: '0 3px 10px rgba(232,149,106,0.35)' }}
                            aria-label="Cart"
                        >
                            <FaShoppingCart size={14} color="#FFFFFF" />
                            {itemCount > 0 && (
                                <span
                                    className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                                    style={{ background: '#E53935', minWidth: '18px', height: '18px', boxShadow: '0 2px 4px rgba(229,57,53,0.3)' }}
                                >
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
