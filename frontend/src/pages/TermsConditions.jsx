import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaFileContract } from 'react-icons/fa';
import Footer from '../components/Footer';

const TermsConditions = () => {
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
                    <FaFileContract size={18} color="#C9A962" />
                    <h1 className="text-lg font-script" style={{ color: '#D4B896' }}>Terms & Conditions</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 max-w-2xl mx-auto">
                <div className="rounded-2xl p-6" style={{ background: 'white', border: '2px solid #E8E3DB', boxShadow: '0 4px 16px rgba(74, 55, 40, 0.06)' }}>
                    <p className="text-sm mb-6" style={{ color: '#A89580' }}>Last updated: January 2026</p>

                    {/* Business Details Card */}
                    <div className="rounded-xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #C9A962' }}>
                        <h3 className="text-base font-bold mb-2" style={{ color: '#6B4423' }}>🏪 Business Information</h3>
                        <p className="text-sm" style={{ color: '#8B7355' }}>
                            <strong className="text-[#4A3728]">Business Name:</strong> Bakery Delight<br />
                            <strong className="text-[#4A3728]">Location:</strong> Delhi, India<br />
                            <strong className="text-[#4A3728]">Contact:</strong> +91 96940 34523<br />
                            <strong className="text-[#4A3728]">Email:</strong> contact@bakerydelight.com
                        </p>
                    </div>

                    <div className="prose prose-sm" style={{ color: '#5C4033' }}>
                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>1. Acceptance of Terms</h2>
                        <p style={{ color: '#8B7355' }}>By accessing and using the Bakery Delight website and ordering services, you accept and agree to be bound by these Terms and Conditions.</p>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>2. Services Offered</h2>
                        <p style={{ color: '#8B7355' }}>Bakery Delight provides online food ordering services including:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li>Bakery items (cakes, pastries, snacks)</li>
                            <li>Pick-up orders from our store</li>
                            <li>Home delivery within our serviceable area</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>3. Orders & Pricing</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li>All orders are subject to availability and confirmation.</li>
                            <li>Prices displayed are in Indian Rupees (INR) and include applicable taxes.</li>
                            <li>We reserve the right to modify prices without prior notice.</li>
                            <li>Delivery charges (if applicable) will be shown before checkout.</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>4. Payment Terms</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: '#8B7355' }}>
                            <li><strong className="text-[#4A3728]">Cash on Delivery:</strong> Pay in cash when your order arrives.</li>
                            <li><strong className="text-[#4A3728]">Online Payment:</strong> Secure payment through Razorpay.</li>
                            <li>We do not store your card/UPI details on our servers.</li>
                        </ul>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>5. Cancellation & Refunds</h2>
                        <p style={{ color: '#8B7355' }}>Please refer to our <Link to="/refund" className="font-bold underline" style={{ color: '#6B4423' }}>Refund & Cancellation Policy</Link> for detailed information.</p>

                        <h2 className="text-lg font-bold mt-6 mb-3" style={{ color: '#4A3728' }}>6. Contact Information</h2>
                        <p style={{ color: '#8B7355' }}>For any queries regarding these Terms & Conditions, please contact us:</p>
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

export default TermsConditions;
