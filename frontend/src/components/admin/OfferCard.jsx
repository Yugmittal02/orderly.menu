import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfferCard = ({ offer, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[hsl(var(--primary))] to-red-500 text-white p-5 rounded-2xl shadow-lg"
    >
      <p className="text-xs font-bold uppercase opacity-80">
        {offer.title}
      </p>
      <p className="text-2xl font-black mt-1">
        {offer.discountType === 'percentage'
          ? `${offer.discountValue}%`
          : `₹${offer.discountValue}`}{' '}
        OFF
      </p>
      <p className="text-sm opacity-90 mt-1 line-clamp-1">
        {offer.description}
      </p>
      <div className="mt-3 flex justify-between items-center">
        <span className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-mono font-bold">
          {offer.code}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(offer._id)}
          className="bg-white/20 hover:bg-white/30 text-white rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default OfferCard;
