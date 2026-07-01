import React from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiUser, FiCoffee, FiSmartphone, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{background:'linear-gradient(145deg,#0B0B14 0%,#151525 50%,#1A1A30 100%)'}}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#7C3AED,#6D28D9)',boxShadow:'0 4px 15px rgba(124,58,237,0.3)'}}>
            <FiGrid className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold text-white">QR Menu</span>
        </div>
        <div className="flex gap-3">
          <Link to="/cafe/login" className="btn-outline text-sm py-2 px-4">Cafe Login</Link>
          <Link to="/admin/login" className="btn-primary text-sm py-2 px-4">Admin</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="slide-up max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{background:'rgba(124,58,237,0.1)',border:'1px solid rgba(124,58,237,0.3)'}}>
            <FiSmartphone className="text-[#7C3AED]" />
            <span className="text-sm text-[#A78BFA] font-medium">Scan • Order • Enjoy</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="text-white">QR Menu</span>
            <br />
            <span style={{background:'linear-gradient(135deg,#7C3AED,#F43F5E)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Ordering System
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
            Transform your restaurant with digital QR menus. Customers scan, browse & order directly from their table — no app needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cafe/login" className="btn-primary text-lg py-3 px-8">
              <FiCoffee /> Cafe Owner Login
            </Link>
            <Link to="/admin/login" className="btn-outline text-lg py-3 px-8">
              <FiUser /> Super Admin
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {[
            { icon: '📱', title: 'QR Code Tables', desc: 'Generate unique QR for each table. Customers scan & order instantly.' },
            { icon: '🍽️', title: 'Digital Menu', desc: 'Add items with images, categories, prices. Update in real-time.' },
            { icon: '📊', title: 'Live Orders', desc: 'Track orders, update status, view daily stats from your dashboard.' }
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 text-center slide-up" style={{animationDelay:`${i*0.1}s`}}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} QR Menu Ordering System
      </footer>
    </div>
  );
};

export default LandingPage;
