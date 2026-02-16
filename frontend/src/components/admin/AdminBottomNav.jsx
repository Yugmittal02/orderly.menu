import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, UtensilsCrossed, Gift, IndianRupee, Settings } from 'lucide-react';

const AdminBottomNav = ({ activeTab, onTabChange, pendingCount = 0 }) => {
  const tabs = [
    { id: 'orders', icon: ClipboardList, label: 'Orders', count: pendingCount },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu' },
    { id: 'offers', icon: Gift, label: 'Offers' },
    { id: 'revenue', icon: IndianRupee, label: 'Revenue' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--border))] px-2 py-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl min-w-[70px] transition-all ${
              activeTab === tab.id
                ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))]'
            }`}
          >
            <div className="relative">
              <tab.icon className="w-5 h-5" />
              {tab.count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </div>
            <span className={`text-xs mt-1 font-medium ${activeTab === tab.id ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default AdminBottomNav;
