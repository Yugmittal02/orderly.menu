import React from 'react';
import { FaStar, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCardCompact = ({ product, onAddSuccess }) => {
    const { cart, addToCart, updateQuantity } = useCart();

    // Find this product in cart
    const cartItem = cart.find(item => item._id === product._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(product);
        if (onAddSuccess) onAddSuccess();
    };

    const handleUpdateQty = (e, delta) => {
        e.stopPropagation();
        if (cartItem) updateQuantity(cartItem.cartId, delta);
    };

    const price = Number(product.price) || 0;
    const originalPrice = product.originalPrice || Math.round(price * 1.2);
    const discount = originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <div
            className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md group"
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderLeft: '4px solid var(--primary-orange)',
            }}
        >
            {/* Product Image — 90×90 for proper mobile visibility */}
            <div className="relative flex-shrink-0">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop'}
                    alt={product.name}
                    className="w-[90px] h-[90px] rounded-xl object-cover"
                    style={{ boxShadow: '0 3px 12px rgba(58, 42, 28, 0.12)' }}
                    loading="lazy"
                />

                {/* Bestseller / NEW badge on image */}
                {(product.isBestseller || product.isNew) && (
                    <span
                        className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-lg text-[11px] font-bold text-white"
                        style={{
                            background: product.isBestseller
                                ? 'linear-gradient(135deg, #D4700A, #E8923A)'
                                : '#22C55E'
                        }}
                    >
                        {product.isBestseller ? '🔥 BEST' : '✨ NEW'}
                    </span>
                )}
            </div>

            {/* Product Info — Middle */}
            <div className="flex-1 min-w-0">
                <h4
                    className="font-semibold text-base leading-snug line-clamp-2"
                    style={{ color: 'var(--text-dark)' }}
                >
                    {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded"
                        style={{ background: '#15803d', display: 'inline-flex' }}>
                        <FaStar size={10} color="#fff" />
                        <span className="text-xs font-bold text-white">
                            {product.rating || '4.5'}
                        </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>
                        ({product.reviewCount || '98'})
                    </span>
                    {product.category && (
                        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
                            • {product.category}
                        </span>
                    )}
                </div>

                {/* Description — 1 line */}
                {product.description && (
                    <p
                        className="text-sm mt-1 truncate"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {product.description}
                    </p>
                )}
            </div>

            {/* Price + ADD — Right Side */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {/* Price */}
                <div className="text-right">
                    <span className="font-bold text-base" style={{ color: 'var(--text-dark)' }}>
                        ₹{price}
                    </span>
                    {discount > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs line-through" style={{ color: 'var(--text-light)' }}>
                                ₹{originalPrice}
                            </span>
                            <span className="text-[11px] font-bold" style={{ color: '#22C55E' }}>
                                {discount}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* ADD Button / Quantity Stepper — min 44px touch target */}
                {quantity === 0 ? (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                        style={{
                            background: 'var(--gradient-brown)',
                            boxShadow: '0 3px 10px rgba(212, 112, 10, 0.3)',
                            minHeight: '44px',
                        }}
                    >
                        <FaPlus size={10} />
                        ADD
                    </button>
                ) : (
                    <div
                        className="flex items-center gap-0 rounded-xl overflow-hidden"
                        style={{
                            border: '2px solid var(--primary-orange)',
                            background: 'var(--bg-card)',
                        }}
                    >
                        <button
                            onClick={(e) => handleUpdateQty(e, -1)}
                            className="w-10 h-10 flex items-center justify-center transition-colors"
                            style={{ color: 'var(--primary-orange)' }}
                        >
                            <FaMinus size={12} />
                        </button>
                        <span
                            className="w-10 h-10 flex items-center justify-center text-sm font-bold"
                            style={{
                                background: 'var(--gradient-brown)',
                                color: '#fff',
                            }}
                        >
                            {quantity}
                        </span>
                        <button
                            onClick={(e) => handleUpdateQty(e, 1)}
                            className="w-10 h-10 flex items-center justify-center transition-colors"
                            style={{ color: 'var(--primary-orange)' }}
                        >
                            <FaPlus size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCardCompact;
