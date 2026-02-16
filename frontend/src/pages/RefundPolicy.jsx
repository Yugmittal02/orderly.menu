import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaPhoneAlt, FaUndo } from 'react-icons/fa';
import Footer from '../components/Footer';

const RefundPolicy = () => {
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
                    <FaUndo size={16} color="#C9A962" />
                    <h1 className="text-lg font-script" style={{ color: '#D4B896' }}>Refund Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 16px rgba(74, 55, 40, 0.06)' }}>
                    <p className="text-sm mb-6" style={{ color: '#A89580' }}>Last updated: January 2026</p>

                    {/* Quick Summary Card */}
                    <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
                        <h3 className="text-base font-bold mb-3" style={{ color: '#6B4423' }}>📋 Quick Summary</h3>
                        <ul className="space-y-2 text-sm" style={{ color: '#8B7355' }}>
                            <li className="flex items-start gap-2">
                                <FaCheckCircle className="mt-0.5 flex-shrink-0" color="#22C55E" />
                                <span>Cancel within 2 minutes for full refund</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FaClock className="mt-0.5 flex-shrink-0" color="#C9A962" />
                                <span>Refunds processed in 5-7 business days</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FaTimesCircle className="mt-0.5 flex-shrink-0" color="#E57373" />
                                <span>No refund after food preparation starts</span>
                            </li>
                        </ul>
                    </div>

                    <div className="prose prose-sm" style={{ color: '#5C4033' }}>
                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>1. Order Cancellation</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Within 2 minutes:</strong> Full refund if cancelled before preparation.</li>
                            <li><strong className="text-[#4A3728]">After preparation starts:</strong> No cancellation possible.</li>
                            <li><strong className="text-[#4A3728]">Delivery orders:</strong> Cannot cancel once picked up.</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>2. Refund Eligibility</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li>Order cancelled within the allowed time window</li>
                            <li>Wrong items delivered (verified with photos)</li>
                            <li>Missing items from your order</li>
                            <li>Food quality issues reported within 30 minutes</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>3. Non-Refundable Cases</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li>Change of mind after food is prepared</li>
                            <li>Incorrect delivery address provided by customer</li>
                            <li>Complaints raised after 30 minutes of delivery</li>
                        </ul>

                        {/* Contact Card */}
                        <div className="rounded-xl p-4 mt-6" style={{ background: '#DCFCE7', border: '1px solid #22C55E' }}>
                            <h3 className="text-base font-bold mb-2 flex items-center gap-2" style={{ color: '#166534' }}>
                                <FaPhoneAlt /> Contact for Refunds
                            </h3>
                            <p className="text-sm" style={{ color: '#166534' }}>
                                📞 Phone: <a href="tel:+919694034523" className="font-bold underline">+91 96940 34523</a><br />
                                💬 WhatsApp: <a href="https://wa.me/919694034523" className="font-bold underline">Chat Now</a>
                            </p>
                        </div>

                        <div className="mt-8 pt-4 text-center" style={{ borderTop: '2px dashed #E8E3DB' }}>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                                style={{ background: 'linear-gradient(135deg, #6B4423 0%, #5C4033 100%)' }}
                            >
                                Contact Us for Help
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RefundPolicy;
