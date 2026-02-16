import React from 'react';
import { motion } from 'framer-motion';
import { Cake, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminHeader = ({ adminName, onLogout }) => {
  return (
    <header className="bg-[hsl(var(--foreground))] text-white px-4 py-4 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--color-amber-500))] rounded-xl flex items-center justify-center shadow-lg"
          >
            <Cake className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="font-[var(--font-heading)] font-bold text-lg leading-tight">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-400">{adminName}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="w-10 h-10 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
