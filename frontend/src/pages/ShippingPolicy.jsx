import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaClock, FaRupeeSign, FaShippingFast } from 'react-icons/fa';
import Footer from '../components/Footer';

const ShippingPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #FAF7F2 100%)' }}>
            {/* Header */}
            <header className="sticky top-0 z-10 px-4 py-4 flex items-center gap-4"
                style={{ background: 'linear-gradient(180deg, #2D1F16 0%, #3D2B1F 100%)', borderBottom: '3px solid #C9A962' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                    <FaArrowLeft size={16} color="#D4B896" />
                </button>
                <div className="flex items-center gap-2">
                    <FaShippingFast size={18} color="#C9A962" />
                    <h1 className="text-lg font-script" style={{ color: '#D4B896' }}>Delivery Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 16px rgba(74, 55, 40, 0.06)' }}>
                    <p className="text-sm mb-6" style={{ color: '#A89580' }}>Last updated: January 2026</p>

                    {/* Delivery Summary Card */}
                    <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
                        <h3 className="text-base font-bold mb-3" style={{ color: '#6B4423' }}>🚴 Delivery Overview</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: '#8B7355' }}>
                            <div className="flex items-center gap-2">
                                <FaClock color="#C9A962" />
                                <span>30-45 mins delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt color="#6B4423" />
                                <span>Local area</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaRupeeSign color="#C9A962" />
                                <span>Free on ₹299+</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaTruck color="#6B4423" />
                                <span>Pick-up available</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm" style={{ color: '#5C4033' }}>
                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>1. Delivery Options</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Home Delivery:</strong> We deliver to your doorstep</li>
                            <li><strong className="text-[#4A3728]">Self Pick-up:</strong> Collect from our store</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>2. Delivery Time</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Standard Orders:</strong> 30-45 minutes</li>
                            <li><strong className="text-[#4A3728]">Peak Hours:</strong> May take 45-60 minutes</li>
                            <li><strong className="text-[#4A3728]">Large Orders:</strong> May require additional time</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>3. Delivery Charges</h2>
                        <div className="rounded-xl p-4 mt-2" style={{ background: '#FAF7F2', border: '1px solid #E8E3DB' }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E8E3DB' }}>
                                        <th className="text-left py-2" style={{ color: '#4A3728' }}>Order Value</th>
                                        <th className="text-right py-2" style={{ color: '#4A3728' }}>Delivery Fee</th>
                                    </tr>
                                </thead>
                                <tbody style={{ color: '#8B7355' }}>
                                    <tr style={{ borderBottom: '1px solid #E8E3DB' }}>
                                        <td className="py-2">Below ₹299</td>
                                        <td className="text-right py-2">Based on distance</td>
                                    </tr>
                                    <tr className="font-semibold" style={{ color: '#166534' }}>
                                        <td className="py-2">₹299 and above</td>
                                        <td className="text-right py-2">FREE ✓</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>4. Store Pick-up</h2>
                        <div className="rounded-xl p-4 mt-2" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
                            <p className="text-sm" style={{ color: '#8B7355' }}>
                                <strong className="text-[#6B4423]">📍 Store Location:</strong><br />
                                Bakery Delight, Main Road<br />
                                <strong className="text-[#6B4423]">Timings:</strong> 10:00 AM - 10:00 PM<br />
                                <strong className="text-[#6B4423]">Contact:</strong> <a href="tel:+919694034523" className="underline" style={{ color: '#6B4423' }}>+91 96940 34523</a>
                            </p>
                        </div>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>5. Contact for Delivery Issues</h2>
                        <p style={{ color: '#8B7355' }}>For any delivery-related queries:</p>
                        <p className="mt-2">
                            📞 Phone: <a href="tel:+919694034523" className="font-bold" style={{ color: '#6B4423' }}>+91 96940 34523</a><br />
                            💬 WhatsApp: <a href="https://wa.me/919694034523" className="font-bold" style={{ color: '#6B4423' }}>Chat Now</a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ShippingPolicy;
