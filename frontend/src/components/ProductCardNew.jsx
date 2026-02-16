import React, { useState, useCallback, memo } from 'react';
import { useCart } from '../context/CartContext';
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart, FaCheck } from 'react-icons/fa';

const ProductCardNew = memo(({ product, onAddSuccess, index = 0, featured = false }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [added, setAdded] = useState(false);

    // Defensive checks — API uses basePrice, fallback to price
    const safePrice = Number(product?.basePrice) || Number(product?.price) || 0;
    const safeOriginalPrice = Number(product?.originalPrice) || 0;
    const hasDiscount = safeOriginalPrice > safePrice && safeOriginalPrice > 0;
    const discountPercent = hasDiscount
        ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
        : 0;
    const rating = Number(product?.averageRating) || Number(product?.rating) || 0;
    const ratingCount = Number(product?.totalRatings) || Number(product?.ratingCount) || 0;

    // Fallback image when API returns empty string
    const imageSrc = product?.image && product.image.trim() !== ''
        ? product.image
        : 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&q=80';

    const handleAddToCart = useCallback((e) => {
        e.stopPropagation();
        if (added) return;
        addToCart(product);
        setAdded(true);
        onAddSuccess?.();
        setTimeout(() => setAdded(false), 2000);
    }, [product, addToCart, added, onAddSuccess]);

    const toggleWishlist = useCallback((e) => {
        e.stopPropagation();
        setIsWishlisted(prev => !prev);
    }, []);

    // Render stars
    const renderStars = () => {
        if (rating === 0) return null;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    size={10}
                    className={`star ${i <= Math.round(rating) ? '' : 'empty'}`}
                />
            );
        }
        return (
            <div className="star-rating">
                {stars}
                {ratingCount > 0 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        ({ratingCount})
                    </span>
                )}
            </div>
        );
    };

    return (
        <div
            className="product-card"
            style={{
                animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
            }}
        >
            {/* Image Container */}
            <div className="product-image">
                <img
                    src={imageSrc}
                    alt={product?.name || 'Product'}
                    loading="lazy"
                />

                {/* Single badge — discount takes priority */}
                {hasDiscount && discountPercent > 0 && (
                    <div className="discount-badge">
                        {discountPercent}% OFF
                    </div>
                )}

                {/* Wishlist button */}
                <button
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={toggleWishlist}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {isWishlisted
                        ? <FaHeart size={12} style={{ color: '#EF4444' }} />
                        : <FaRegHeart size={12} style={{ color: '#9C9083' }} />
                    }
                </button>
            </div>

            {/* Details */}
            <div className="product-details">
                {/* Title with veg indicator */}
                <div className="product-title">
                    {product?.isVeg !== false && <div className="veg-icon" />}
                    <h4>{product?.name || 'Unnamed Product'}</h4>
                </div>

                {/* Description */}
                {product?.description && (
                    <p className="product-description">{product.description}</p>
                )}

                {/* Rating */}
                {renderStars()}

                {/* Price */}
                <div className="price-row">
                    <span className="price-current">₹{safePrice}</span>
                    {hasDiscount && (
                        <span className="price-original">₹{safeOriginalPrice}</span>
                    )}
                </div>

                {/* Add to Cart */}
                <button
                    className={`add-cart-btn ${added ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={added}
                >
                    {added ? (
                        <>
                            <FaCheck size={12} />
                            <span>Added</span>
                        </>
                    ) : (
                        <>
                            <FaShoppingCart size={12} />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
});

ProductCardNew.displayName = 'ProductCardNew';
export default ProductCardNew;
