import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductBySlug, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCardNew from '../components/ProductCardNew';
import {
    FaArrowLeft, FaShareAlt, FaShoppingCart,
    FaWhatsapp, FaInstagram, FaLink, FaCheck,
    FaPlus, FaMinus, FaStar, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart, updateQuantity, removeFromCart, getItemCount } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Customization state
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const shareMenuRef = useRef(null);

    // Load product data
    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError(false);
            setImageLoaded(false);
            try {
                const { data } = await fetchProductBySlug(slug);
                setProduct(data.product);
                setRelatedProducts(data.relatedProducts || []);
                // Default select first size
                if (data.product?.sizes?.length > 0) {
                    setSelectedSize(data.product.sizes[0]);
                } else {
                    setSelectedSize(null);
                }
                setSelectedAddons([]);
                // Set page title
                document.title = `${data.product.name} — Seva Shubham Bakery`;
            } catch (err) {
                console.error('Failed to load product:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    // Close share menu on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
                setShowShareMenu(false);
            }
        };
        if (showShareMenu) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showShareMenu]);

    const safeProduct = useMemo(() => {
        if (!product) return null;
        return {
            _id: product._id,
            name: product.name || 'Product',
            slug: product.slug || '',
            description: product.description || '',
            image: product.image || '',
            basePrice: Number(product.basePrice || product.price) || 0,
            price: Number(product.price || product.basePrice) || 0,
            isAvailable: product.isAvailable !== false,
            isBestseller: product.isBestseller || false,
            category: product.category || null,
            rating: product.rating || 0,
            ratingCount: product.ratingCount || 0,
            sizes: Array.isArray(product.sizes) ? product.sizes : [],
            addons: Array.isArray(product.addons) ? product.addons : [],
        };
    }, [product]);

    const hasSizes = safeProduct?.sizes?.length > 0;
    const hasAddons = safeProduct?.addons?.length > 0;

    // Price calculation
    const unitPrice = useMemo(() => {
        if (!safeProduct) return 0;
        let p = selectedSize?.price || safeProduct.basePrice;
        p += selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
        return p;
    }, [safeProduct, selectedSize, selectedAddons]);

    // Cart match
    const existingCartItem = useMemo(() => {
        if (!safeProduct) return null;
        const addonKey = selectedAddons.map(a => a.name).sort().join(',');
        return cart.find(item => {
            if (item._id !== safeProduct._id) return false;
            if ((item.size || 'default') !== (selectedSize?.name || 'default')) return false;
            const itemAddonKey = (item.selectedAddons || []).slice().sort().join(',');
            return itemAddonKey === addonKey;
        });
    }, [cart, safeProduct, selectedSize, selectedAddons]);

    const existingQty = existingCartItem?.quantity || 0;

    // Addon toggle
    const toggleAddon = useCallback((addon) => {
        setSelectedAddons(prev =>
            prev.find(a => a.name === addon.name)
                ? prev.filter(a => a.name !== addon.name)
                : [...prev, addon]
        );
    }, []);

    // Add to cart
    const handleAddToCart = useCallback(() => {
        if (!safeProduct || !safeProduct.isAvailable) return;
        addToCart({
            _id: safeProduct._id,
            name: safeProduct.name,
            image: safeProduct.image,
            basePrice: safeProduct.basePrice,
            price: unitPrice,
            size: selectedSize?.name || null,
            selectedAddons: selectedAddons.map(a => a.name),
        });
    }, [safeProduct, unitPrice, selectedSize, selectedAddons, addToCart]);

    // Quantity controls
    const handleIncrement = useCallback(() => {
        if (existingCartItem) updateQuantity(existingCartItem.cartId, 1);
    }, [existingCartItem, updateQuantity]);

    const handleDecrement = useCallback(() => {
        if (existingCartItem) {
            if (existingCartItem.quantity <= 1) {
                removeFromCart(existingCartItem.cartId);
            } else {
                updateQuantity(existingCartItem.cartId, -1);
            }
        }
    }, [existingCartItem, updateQuantity, removeFromCart]);

    // Share functions
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const shareWhatsApp = useCallback(() => {
        const text = `Check out ${safeProduct?.name} at Seva Shubham Bakery! 🍰\n₹${unitPrice}\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        setShowShareMenu(false);
    }, [safeProduct, unitPrice, shareUrl]);

    const shareInstagram = useCallback(() => {
        // Instagram doesn't have a direct share URL, copy link + open Instagram
        navigator.clipboard?.writeText(shareUrl);
        window.open('https://www.instagram.com/', '_blank');
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        setShowShareMenu(false);
    }, [shareUrl]);

    const copyLink = useCallback(() => {
        navigator.clipboard?.writeText(shareUrl).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        });
        setShowShareMenu(false);
    }, [shareUrl]);

    const catColor = safeProduct?.category?.colorFrom || '#C97B4B';
    const cartCount = getItemCount();

    // ─── Loading State ───
    if (loading) {
        return (
            <div style={{ background: '#FDF8F4', minHeight: '100vh' }}>
                {/* Skeleton Header */}
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 20, background: '#E8E3DB' }} />
                    <div style={{ flex: 1, height: 20, borderRadius: 10, background: '#E8E3DB' }} />
                </div>
                {/* Skeleton Image */}
                <div style={{ width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #F5EDE6 0%, #E8DFD6 100%)', animation: 'pulse 1.5s ease infinite' }} />
                {/* Skeleton Content */}
                <div style={{ padding: '20px 16px' }}>
                    <div style={{ height: 24, width: '70%', borderRadius: 8, background: '#E8E3DB', marginBottom: 12 }} />
                    <div style={{ height: 16, width: '40%', borderRadius: 8, background: '#E8E3DB', marginBottom: 8 }} />
                    <div style={{ height: 32, width: '30%', borderRadius: 8, background: '#E8E3DB', marginBottom: 20 }} />
                    <div style={{ height: 60, borderRadius: 16, background: '#E8E3DB' }} />
                </div>
                <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            </div>
        );
    }

    // ─── Error State ───
    if (error || !safeProduct) {
        return (
            <div style={{ background: '#FDF8F4', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 40, background: '#FEF3E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 40 }}>😕</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D1810', margin: '0 0 8px' }}>Product not found</h2>
                <p style={{ fontSize: 14, color: '#8B7355', margin: '0 0 24px' }}>This product may have been removed or the link is incorrect.</p>
                <button
                    onClick={() => navigate('/menu')}
                    style={{
                        padding: '14px 32px', borderRadius: 16, border: 'none',
                        background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)',
                        color: '#FFF', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(201,123,75,0.3)'
                    }}
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: '#FDF8F4', minHeight: '100vh', paddingBottom: 100 }}>

            {/* ─── STICKY HEADER ─── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px',
                background: 'rgba(253,248,244,0.92)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(232,223,214,0.5)',
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        width: 40, height: 40, borderRadius: 20, border: 'none',
                        background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                >
                    <FaArrowLeft size={16} color="#2D1810" />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Share Button */}
                    <div style={{ position: 'relative' }} ref={shareMenuRef}>
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            style={{
                                width: 40, height: 40, borderRadius: 20, border: 'none',
                                background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}
                        >
                            <FaShareAlt size={14} color="#2D1810" />
                        </button>

                        {/* Share Dropdown */}
                        {showShareMenu && (
                            <div style={{
                                position: 'absolute', right: 0, top: 48, zIndex: 50,
                                background: '#FFFFFF', borderRadius: 16, padding: '8px 4px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                minWidth: 200, animation: 'shareDropIn 0.2s ease',
                            }}>
                                <button onClick={shareWhatsApp} style={shareItemStyle}>
                                    <FaWhatsapp size={18} color="#25D366" />
                                    <span>Share on WhatsApp</span>
                                </button>
                                <button onClick={shareInstagram} style={shareItemStyle}>
                                    <FaInstagram size={18} color="#E4405F" />
                                    <span>Share on Instagram</span>
                                </button>
                                <button onClick={copyLink} style={shareItemStyle}>
                                    <FaLink size={16} color="#C97B4B" />
                                    <span>{linkCopied ? '✓ Link Copied!' : 'Copy Link'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Cart Button */}
                    <button
                        onClick={() => navigate('/cart')}
                        style={{
                            width: 40, height: 40, borderRadius: 20, border: 'none',
                            background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            position: 'relative',
                        }}
                    >
                        <FaShoppingCart size={14} color="#2D1810" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -2, right: -2,
                                width: 18, height: 18, borderRadius: 9,
                                background: '#E53935', color: '#FFF',
                                fontSize: 10, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* ─── PRODUCT IMAGE ─── */}
            <div style={{
                width: '100%', aspectRatio: '1/1', position: 'relative',
                background: 'linear-gradient(135deg, #F5EDE6 0%, #E8DFD6 100%)',
                overflow: 'hidden',
            }}>
                {safeProduct.image ? (
                    <img
                        src={safeProduct.image}
                        alt={safeProduct.name}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.4s ease',
                        }}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 80, background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
                    }}>🍰</div>
                )}

                {/* Badges */}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {safeProduct.isBestseller && (
                        <span style={{
                            background: 'linear-gradient(135deg, #C97B4B, #E8956A)', color: '#FFF',
                            fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                            display: 'flex', alignItems: 'center', gap: 4,
                            boxShadow: '0 2px 8px rgba(201,123,75,0.3)',
                        }}>
                            ⚡ Bestseller
                        </span>
                    )}
                    {!safeProduct.isAvailable && (
                        <span style={{
                            background: 'rgba(0,0,0,0.7)', color: '#FFF',
                            fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                        }}>
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Image dots / carousel indicator placeholder */}
                <div style={{
                    position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: 6,
                }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: '#C97B4B', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }} />
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.5)' }} />
                </div>
            </div>

            {/* ─── PRODUCT INFO ─── */}
            <div style={{ padding: '20px 16px 0' }}>
                {/* Rating */}
                {safeProduct.rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 3,
                            background: '#1B7E1B', color: '#FFF',
                            padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                        }}>
                            <FaStar size={10} /> {safeProduct.rating.toFixed(1)}
                        </div>
                        {safeProduct.ratingCount > 0 && (
                            <span style={{ fontSize: 12, color: '#8B7355' }}>
                                ({safeProduct.ratingCount.toLocaleString()} ratings)
                            </span>
                        )}
                    </div>
                )}

                {/* Name */}
                <h1 style={{
                    fontSize: 22, fontWeight: 800, color: '#1C1C1C',
                    margin: 0, lineHeight: 1.3,
                }}>
                    {safeProduct.name}
                </h1>

                {/* Category Badge */}
                {safeProduct.category && (
                    <button
                        onClick={() => navigate(`/category/${safeProduct.category.slug || safeProduct.category._id}`)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            marginTop: 8, padding: '4px 12px', borderRadius: 20,
                            background: `${catColor}12`, color: catColor,
                            border: `1px solid ${catColor}30`,
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        {safeProduct.category.icon || '📦'} {typeof safeProduct.category === 'object' ? safeProduct.category.name : safeProduct.category}
                    </button>
                )}

                {/* Price */}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#2D1810' }}>₹{unitPrice}</span>
                    {safeProduct.basePrice !== unitPrice && (
                        <span style={{ fontSize: 16, color: '#AAA', textDecoration: 'line-through' }}>
                            ₹{safeProduct.basePrice}
                        </span>
                    )}
                </div>
                <p style={{ fontSize: 11, color: '#8B7355', margin: '4px 0 0' }}>Inclusive of all taxes</p>
            </div>

            {/* ─── DESCRIPTION ─── */}
            {safeProduct.description && (
                <div style={{ padding: '16px 16px 0' }}>
                    <div style={{ borderTop: '1px solid #F0ECE6', paddingTop: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2D1810', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            📋 Product Details
                        </h3>
                        <p style={{
                            fontSize: 14, color: '#666', lineHeight: 1.6, margin: 0,
                            ...(showFullDesc ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
                        }}>
                            {safeProduct.description}
                        </p>
                        {safeProduct.description.length > 120 && (
                            <button
                                onClick={() => setShowFullDesc(!showFullDesc)}
                                style={{
                                    background: 'none', border: 'none', color: '#C97B4B',
                                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    padding: '6px 0', display: 'flex', alignItems: 'center', gap: 4,
                                }}
                            >
                                {showFullDesc ? 'Show Less' : 'View More'}
                                {showFullDesc ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ─── SIZE SELECTOR ─── */}
            {hasSizes && (
                <div style={{ padding: '16px 16px 0' }}>
                    <div style={{ borderTop: '1px solid #F0ECE6', paddingTop: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2D1810', margin: '0 0 12px' }}>
                            📏 Choose Size <span style={{ color: '#E53935' }}>*</span>
                        </h3>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {safeProduct.sizes.map(size => {
                                const isActive = selectedSize?.name === size.name;
                                return (
                                    <button
                                        key={size.name}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            flex: '1 1 0', minWidth: 90,
                                            padding: '12px 10px', borderRadius: 16,
                                            border: isActive ? '2px solid #E8956A' : '2px solid #E8E3DB',
                                            background: isActive
                                                ? 'linear-gradient(135deg, #E8956A, #D4773E)'
                                                : '#FFFFFF',
                                            color: isActive ? '#FFF' : '#2D1810',
                                            textAlign: 'center', cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: isActive ? '0 4px 16px rgba(232,149,106,0.35)' : '0 2px 8px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{size.name}</p>
                                        <p style={{ fontSize: 14, fontWeight: 600, margin: '4px 0 0', opacity: isActive ? 0.9 : 0.7 }}>₹{size.price}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── ADDONS ─── */}
            {hasAddons && (
                <div style={{ padding: '16px 16px 0' }}>
                    <div style={{ borderTop: '1px solid #F0ECE6', paddingTop: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2D1810', margin: '0 0 12px' }}>
                            ✨ Add Extras <span style={{ fontSize: 12, fontWeight: 500, color: '#AAA' }}>(optional)</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {safeProduct.addons.map(addon => {
                                const checked = !!selectedAddons.find(a => a.name === addon.name);
                                return (
                                    <button
                                        key={addon.name}
                                        onClick={() => toggleAddon(addon)}
                                        style={{
                                            width: '100%', padding: '12px 14px', borderRadius: 14,
                                            border: checked ? '2px solid #E8956A' : '2px solid #E8E3DB',
                                            background: checked ? '#FFF7ED' : '#FFF',
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                                        }}
                                    >
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                                            border: checked ? '2px solid #E8956A' : '2px solid #CCC',
                                            background: checked ? '#E8956A' : '#FFF',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {checked && <FaCheck size={10} color="#FFF" />}
                                        </div>
                                        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#2D1810' }}>{addon.name}</span>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: checked ? '#E8956A' : '#8B7355' }}>+₹{addon.price}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── SHARE SECTION (inline) ─── */}
            <div style={{ padding: '20px 16px 0' }}>
                <div style={{ borderTop: '1px solid #F0ECE6', paddingTop: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2D1810', margin: '0 0 12px' }}>
                        📤 Share this product
                    </h3>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={shareWhatsApp} style={shareButtonStyle('#25D366')}>
                            <FaWhatsapp size={18} />
                            <span>WhatsApp</span>
                        </button>
                        <button onClick={shareInstagram} style={shareButtonStyle('#E4405F')}>
                            <FaInstagram size={18} />
                            <span>Instagram</span>
                        </button>
                        <button onClick={copyLink} style={shareButtonStyle('#C97B4B')}>
                            {linkCopied ? <FaCheck size={16} /> : <FaLink size={16} />}
                            <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── RELATED PRODUCTS ─── */}
            {relatedProducts.length > 0 && (
                <div style={{ padding: '24px 0 0' }}>
                    <div style={{ padding: '0 16px', borderTop: '8px solid #F0ECE6', paddingTop: 20 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#2D1810', margin: '0 0 4px' }}>
                            Similar Products
                        </h3>
                        <p style={{ fontSize: 12, color: '#8B7355', margin: '0 0 14px' }}>
                            You might also like
                        </p>
                    </div>
                    <div style={{
                        display: 'flex', gap: 10, overflowX: 'auto',
                        padding: '0 16px 16px', WebkitOverflowScrolling: 'touch',
                        scrollSnapType: 'x mandatory',
                    }}
                    className="hide-scrollbar"
                    >
                        {relatedProducts.map((rp, idx) => (
                            <div
                                key={rp._id}
                                style={{ flex: '0 0 160px', scrollSnapAlign: 'start' }}
                            >
                                <ProductCardNew product={rp} index={idx} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── STICKY BOTTOM BAR ─── */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
                background: '#FFFFFF',
                borderTop: '1px solid #F0ECE6',
                padding: '12px 16px',
                paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
            }}>
                {/* Price */}
                <div>
                    <p style={{ fontSize: 11, color: '#999', margin: 0, fontWeight: 500 }}>Total</p>
                    <p style={{ fontSize: 24, fontWeight: 800, color: '#2D1810', margin: 0 }}>
                        ₹{unitPrice * (existingQty || 1)}
                    </p>
                </div>

                {/* Add / Quantity Stepper */}
                {!safeProduct.isAvailable ? (
                    <div style={{
                        padding: '14px 28px', borderRadius: 16,
                        background: '#E0E0E0', color: '#999',
                        fontSize: 15, fontWeight: 700,
                    }}>
                        Out of Stock
                    </div>
                ) : existingQty > 0 ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 0,
                        background: 'linear-gradient(135deg, #E8956A, #D4773E)',
                        borderRadius: 16, overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(232,149,106,0.4)',
                    }}>
                        <button onClick={handleDecrement} style={stepperBtnStyle}>
                            <FaMinus size={14} color="#FFF" />
                        </button>
                        <span style={{
                            minWidth: 36, textAlign: 'center',
                            fontSize: 20, fontWeight: 800, color: '#FFF',
                        }}>
                            {existingQty}
                        </span>
                        <button onClick={handleIncrement} style={stepperBtnStyle}>
                            <FaPlus size={14} color="#FFF" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        style={{
                            padding: '14px 36px', borderRadius: 16, border: 'none',
                            background: 'linear-gradient(135deg, #E8956A, #D4773E)',
                            color: '#FFF', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(232,149,106,0.4)',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}
                    >
                        <FaPlus size={12} /> Add to Cart
                    </button>
                )}
            </div>

            {/* ─── LINK COPIED TOAST ─── */}
            {linkCopied && (
                <div style={{
                    position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 50, background: 'rgba(34,197,94,0.92)', color: '#FFF',
                    padding: '10px 20px', borderRadius: 24,
                    fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
                    animation: 'toastSlideUp 0.3s ease',
                }}>
                    <FaCheck size={12} /> Link copied to clipboard!
                </div>
            )}

            {/* ─── CSS Animations ─── */}
            <style>{`
                @keyframes shareDropIn {
                    0% { opacity: 0; transform: translateY(-8px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes toastSlideUp {
                    0% { opacity: 0; transform: translate(-50%, 16px); }
                    100% { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

// ─── Style helpers ───
const shareItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: 'none', background: 'transparent', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, color: '#2D1810',
    transition: 'background 0.15s',
};

const shareButtonStyle = (color) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '12px 8px', borderRadius: 14,
    border: `1.5px solid ${color}25`, background: `${color}08`,
    color: color, fontSize: 11, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s',
});

const stepperBtnStyle = {
    width: 48, height: 52, border: 'none', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

export default ProductDetail;
