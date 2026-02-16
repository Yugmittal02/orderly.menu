import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
                    <FaShieldAlt size={18} color="#C9A962" />
                    <h1 className="text-lg font-script" style={{ color: '#D4B896' }}>Privacy Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 16px rgba(74, 55, 40, 0.06)' }}>
                    <p className="text-sm mb-6" style={{ color: '#A89580' }}>Last updated: January 2026</p>

                    {/* Summary Card */}
                    <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
                        <h3 className="text-base font-bold mb-2" style={{ color: '#6B4423' }}>🔒 Your Privacy Matters</h3>
                        <p className="text-sm" style={{ color: '#8B7355' }}>
                            We collect minimal data required to process your order. We never sell your information to third parties.
                        </p>
                    </div>

                    <div className="prose prose-sm" style={{ color: '#5C4033' }}>
                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>1. Information We Collect</h2>
                        <p>We collect the following information when you place an order:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Personal Information:</strong> Name, phone number</li>
                            <li><strong className="text-[#4A3728]">Delivery Address:</strong> Location coordinates and manual address</li>
                            <li><strong className="text-[#4A3728]">Order Details:</strong> Items ordered, preferences, order history</li>
                            <li><strong className="text-[#4A3728]">Payment Information:</strong> Payment method (we do NOT store card/UPI details)</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li>Processing and delivering your orders</li>
                            <li>Communicating order status via WhatsApp/SMS</li>
                            <li>Improving our services and menu offerings</li>
                            <li>Customer support and issue resolution</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>3. Payment Data Security</h2>
                        <div className="rounded-xl p-4 mt-2" style={{ background: '#DCFCE7', border: '1px solid #22C55E' }}>
                            <p className="text-sm" style={{ color: '#166534' }}>
                                <strong>🔐 Important:</strong> All online payments are processed through <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway.
                                We do NOT store your card numbers, CVV, or UPI PIN.
                            </p>
                        </div>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>4. Data Sharing</h2>
                        <p style={{ color: '#8B7355' }}>We may share your information with:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Delivery Partners:</strong> Name, phone, and address for delivery</li>
                            <li><strong className="text-[#4A3728]">Payment Gateway:</strong> Order amount and transaction details</li>
                            <li><strong className="text-[#4A3728]">Legal Authorities:</strong> If required by law</li>
                        </ul>
                        <p className="mt-2 font-semibold" style={{ color: '#6B4423' }}>We NEVER sell your data to advertisers.</p>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>5. Your Rights</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Access:</strong> Request a copy of your personal data</li>
                            <li><strong className="text-[#4A3728]">Correction:</strong> Update inaccurate information</li>
                            <li><strong className="text-[#4A3728]">Deletion:</strong> Request deletion of your data</li>
                            <li><strong className="text-[#4A3728]">Opt-out:</strong> Unsubscribe from promotional communications</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>6. Contact Us</h2>
                        <p style={{ color: '#8B7355' }}>For privacy-related queries:</p>
                        <p className="mt-2">
                            📞 Phone: <a href="tel:+919694034523" className="font-bold" style={{ color: '#6B4423' }}>+91 96940 34523</a><br />
                            📧 Email: <a href="mailto:contact@bakerydelight.com" className="font-bold" style={{ color: '#6B4423' }}>contact@bakerydelight.com</a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
