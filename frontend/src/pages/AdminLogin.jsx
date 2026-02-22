import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaEnvelope, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { adminLogin, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await adminLogin(email, password);
        
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#FAF7F2' }}>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-20 w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg"
                style={{ background: '#FFFFFF', border: '2px solid #E8E3DB' }}
                aria-label="Go back"
            >
                <FaArrowLeft size={16} style={{ color: '#C97B4B' }} />
            </button>

            {/* Background Blurs */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.08] rounded-full blur-[100px]"
                    style={{ background: '#C97B4B' }}></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-[0.08] rounded-full blur-[100px]"
                    style={{ background: '#E8956A' }}></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-sm">
                
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)', boxShadow: '0 8px 32px rgba(201, 123, 75, 0.3)' }}>
                        <FaLock className="text-3xl text-white" />
                    </div>
                    <h1 className="text-2xl font-black" style={{ color: '#1C1C1C' }}>
                        Admin <span style={{ color: '#C97B4B' }}>Portal</span>
                    </h1>
                    <p className="text-sm mt-1" style={{ color: '#A0998F' }}>Sewa Shubham Bakery</p>
                </div>

                {/* Form */}
                <div className="rounded-3xl p-8"
                    style={{ background: '#FFFFFF', border: '2px solid #E8E3DB', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                    
                    {error && (
                        <div className="px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold flex items-center justify-center gap-2"
                            style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#DC2626' }}></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: '#8B7355' }}>Email</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#A0998F' }} />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl pl-11 pr-4 py-3.5 font-medium outline-none transition-all"
                                    style={{ background: '#FAF7F2', border: '2px solid #E8E3DB', color: '#1C1C1C' }}
                                    onFocus={(e) => e.target.style.borderColor = '#C97B4B'}
                                    onBlur={(e) => e.target.style.borderColor = '#E8E3DB'}
                                    placeholder="admin@bakery.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: '#8B7355' }}>Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#A0998F' }} />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl pl-11 pr-4 py-3.5 font-medium outline-none transition-all"
                                    style={{ background: '#FAF7F2', border: '2px solid #E8E3DB', color: '#1C1C1C' }}
                                    onFocus={(e) => e.target.style.borderColor = '#C97B4B'}
                                    onBlur={(e) => e.target.style.borderColor = '#E8E3DB'}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98] transition-all group"
                            style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)', boxShadow: '0 8px 24px rgba(201, 123, 75, 0.3)' }}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-sm font-semibold transition-colors"
                        style={{ color: '#A0998F' }}
                    >
                        ← Return to Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
