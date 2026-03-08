import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaPhone, FaArrowRight, FaUtensils } from 'react-icons/fa';

const CustomerEntry = ({ onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const { enterAsCustomer } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim() || !phone.trim()) {
            setError('Please fill in all fields');
            return;
        }

        // Validate Name (letters, Hindi, spaces, dots, hyphens)
        if (!/^[\p{L}\s.'-]+$/u.test(name.trim())) {
            setError('Name contains invalid characters');
            return;
        }
        
        // Validate Phone (Indian format)
        if (!/^[6-9]\d{9}$/.test(phone)) {
            setError('Please enter a valid valid 10-digit mobile number (starting with 6-9)');
            return;
        }

        const result = await enterAsCustomer(name.trim(), phone.trim());
        
        if (result.success) {
            onClose();
        } else {
            setError(result.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full rounded-t-[2rem] p-6 pb-8 shadow-2xl animate-slide-up safe-area-bottom">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-300/50">
                        <FaUtensils className="text-3xl text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">Welcome! 👋</h2>
                    <p className="text-gray-500 mt-1">Enter your details to get started</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 font-medium px-5 py-4 rounded-2xl mb-4 text-center border border-red-100">
                        {error}
                    </div>
                )}

                {/* Form - Large Touch Inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Your Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setError(''); }}
                                placeholder="Enter your name"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-4 h-16 text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                                placeholder="10-digit number"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-4 h-16 text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-300/50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6"
                    >
                        <span>Continue to Menu</span>
                        <FaArrowRight size={18} />
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Your details are used for order tracking only
                </p>
            </div>

            {/* Custom CSS */}
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
                .safe-area-bottom { padding-bottom: max(2rem, env(safe-area-inset-bottom)); }
            `}</style>
        </div>
    );
};

export default CustomerEntry;
