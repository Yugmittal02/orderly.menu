import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar, FaClock, FaShieldAlt } from 'react-icons/fa';

const Welcome = () => {
    const navigate = useNavigate();
    const { customer } = useAuth();

    useEffect(() => {
        if (customer) {
            navigate('/menu');
        }
    }, [customer, navigate]);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">

            {/* Full-bleed Hero Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&h=900&fit=crop&q=85"
                    alt="Fresh bakery"
                    className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay for text contrast */}
                <div className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, rgba(26,22,18,0.3) 0%, rgba(26,22,18,0.5) 40%, rgba(26,22,18,0.85) 100%)'
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-end relative z-10 text-center px-6 pb-12 pt-24">

                {/* Brand Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1.5px solid rgba(255,255,255,0.25)',
                    }}
                >
                    <span className="text-4xl">🧁</span>
                </motion.div>

                {/* Branding — Staggered text reveal */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-display mb-2 text-white"
                    style={{ textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}
                >
                    Sewa Shubham
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm font-semibold tracking-[0.3em] uppercase mb-6"
                    style={{ color: 'rgba(232, 146, 58, 0.95)' }}
                >
                    Bakery & Cafe
                </motion.p>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-base mb-8 max-w-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                    Fresh bakes crafted with love — delivering delicious moments & happy memories since 2002.
                </motion.p>

                {/* Trust Badges — Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                >
                    {[
                        { icon: <FaStar size={12} />, label: '4.9 Rating', color: '#E8923A' },
                        { icon: <FaClock size={12} />, label: '30min Delivery', color: '#E8923A' },
                        { icon: <FaShieldAlt size={12} />, label: 'Safe Payment', color: '#22C55E' },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}
                        >
                            <span style={{ color: badge.color }}>{badge.icon}</span>
                            <span className="text-xs font-semibold text-white">{badge.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="w-full max-w-sm flex flex-col gap-3"
                >
                    <button
                        onClick={() => navigate('/menu')}
                        className="group w-full text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                        style={{
                            background: 'linear-gradient(135deg, #D4700A 0%, #E8923A 100%)',
                            boxShadow: '0 12px 40px rgba(212, 112, 10, 0.4)'
                        }}
                    >
                        <span>Explore Our Menu</span>
                        <FaArrowRight className="transition-transform group-hover:translate-x-2" size={16} />
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full font-semibold text-sm py-3 px-6 rounded-xl transition-all active:scale-95"
                        style={{
                            background: 'rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.9)',
                        }}
                    >
                        Already a customer? Sign In
                    </button>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center pb-8 px-6">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    © {new Date().getFullYear()} Sewa Shubham Bakery. All rights reserved.
                </p>
            </div>

        </div>
    );
};

export default Welcome;
