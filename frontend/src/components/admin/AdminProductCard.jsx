import React from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminProductCard = ({ product, onToggleStock, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border-0 shadow-sm ${!product.isAvailable ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div
              className="w-16 h-16 bg-[hsl(var(--secondary))] rounded-xl bg-cover bg-center flex-shrink-0 flex items-center justify-center"
              style={{
                backgroundImage: product.image ? `url(${product.image})` : 'none',
              }}
            >
              {!product.image && (
                <UtensilsCrossed className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[hsl(var(--foreground))] truncate">
                {product.name}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{product.category}</p>
              <p className="font-bold text-[hsl(var(--primary))]">
                ₹{product.basePrice}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-[hsl(var(--border))]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStock(product)}
              className={`flex-1 gap-1.5 ${
                product.isAvailable
                  ? 'border-green-200 text-green-700 hover:bg-green-50'
                  : 'border-red-200 text-red-700 hover:bg-red-50'
              }`}
            >
              {product.isAvailable ? (
                <>
                  <ToggleRight className="w-4 h-4" /> In Stock
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" /> Out
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(product)}
              className="w-10 h-10 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(product._id)}
              className="w-10 h-10 border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminProductCard;
