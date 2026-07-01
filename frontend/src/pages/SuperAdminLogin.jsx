import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { superAdminLogin } from '../services/api';
import { FiShield, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAsSuperAdmin, isSuperAdmin } = useAuth();

  useEffect(() => {
    if (isSuperAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isSuperAdmin, navigate]);

  if (isSuperAdmin) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await superAdminLogin({ email, password });
      loginAsSuperAdmin(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:'linear-gradient(145deg,#0B0B14,#151525,#1A1A30)'}}>
      <div className="glass-card p-8 w-full max-w-md slide-up" style={{maxWidth:'420px'}}>
        <Link to="/" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <FiArrowLeft /> Back
        </Link>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background:'linear-gradient(135deg,#7C3AED,#6D28D9)',boxShadow:'0 8px 25px rgba(124,58,237,0.3)'}}>
            <FiShield className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Super Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all cafes from here</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-red-400" style={{background:'rgba(255,107,107,0.1)',border:'1px solid rgba(255,107,107,0.2)'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@qrmenu.com" className="input-field pl-11" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-11" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
