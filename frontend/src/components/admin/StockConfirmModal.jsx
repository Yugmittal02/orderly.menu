import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StockConfirmModal = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;

  const isMarking = product.isAvailable; // marking as out of stock

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isMarking ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isMarking ? (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              ) : (
                <Check className="w-8 h-8 text-green-500" />
              )}
            </div>
            <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">
              {isMarking ? 'Mark as Out of Stock?' : 'Mark as In Stock?'}
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">
              Are you sure you want to {isMarking ? 'mark' : 'restore'}
              <span className="font-bold text-[hsl(var(--foreground))]">
                {' '}"{product.name}"
              </span>
              {isMarking ? ' as Out of Stock?' : ' to In Stock?'}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant={isMarking ? 'destructive' : 'default'}
              onClick={onConfirm}
              className="flex-1"
            >
              {isMarking ? 'Yes, Mark Out' : 'Yes, In Stock'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StockConfirmModal;
