import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { fetchProducts } from '../services/api';
import Header from '../components/Header';
import TopPromoCards from '../components/TopPromoCards';
import MainCategoryCards from '../components/MainCategoryCards';
import ProductCardNew from '../components/ProductCardNew';
import Testimonials from '../components/Testimonials';
import SideCart from '../components/SideCart';
import Footer from '../components/Footer';
import { FaShoppingBag, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

// Bestsellers Horizontal Carousel
const BestsellersCarousel = ({ products, onAddSuccess }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', checkScroll, { passive: true });
        return () => el?.removeEventListener('scroll', checkScroll);
    }, [products]);

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 250, behavior: 'smooth' });
    };

    if (!products || products.length === 0) return null;

    return (
        <section style={{
            padding: '32px 0',
            background: 'linear-gradient(180deg, #FFFCF8 0%, #FFF7F0 100%)',
            borderTop: '1px solid rgba(232, 222, 200, 0.5)',
        }}>
            {/* Section Header */}
            <div className="flex items-center justify-between px-4 mb-5">
                <div>
                    <h3 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '24px',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        color: 'var(--text-brown)',
                        margin: 0,
                    }}>
                        Bestsellers
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Our most loved treats
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll(-1)}
                        disabled={!canScrollLeft}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                        style={{
                            background: 'rgba(212, 112, 10, 0.08)',
                            border: '1px solid rgba(212, 112, 10, 0.15)',
                        }}
                        aria-label="Scroll left"
                    >
                        <FaChevronLeft size={12} color="#D4700A" />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        disabled={!canScrollRight}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                        style={{
                            background: 'rgba(212, 112, 10, 0.08)',
                            border: '1px solid rgba(212, 112, 10, 0.15)',
                        }}
                        aria-label="Scroll right"
                    >
                        <FaChevronRight size={12} color="#D4700A" />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 px-4"
            >
                {products.map((product, index) => (
                    <div
                        key={product._id}
                        className="flex-shrink-0 snap-start"
                        style={{
                            width: '180px',
                            animation: `fadeIn 0.4s ease ${index * 0.06}s both`,
                        }}
                    >
                        <ProductCardNew
                            product={product}
                            onAddSuccess={onAddSuccess}
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

// Featured 'Today's Special' Banner
const FeaturedBanner = ({ product }) => {
    if (!product) return null;

    const price = Number(product.basePrice) || Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || 0;
    const hasDiscount = originalPrice > price && originalPrice > 0;
    const imageSrc = product.image && product.image.trim() !== ''
        ? product.image
        : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop';

    return (
        <div className="mx-4 mb-2 rounded-2xl overflow-hidden relative"
            style={{
                background: 'linear-gradient(135deg, #FFFCF8 0%, #FFF7F0 50%, #FFEEE0 100%)',
                border: '1px solid #EDE6DC',
                boxShadow: '0 4px 16px rgba(58, 42, 28, 0.09)',
            }}>
            <div className="relative p-5 flex items-center gap-4">
                {/* Food Image */}
                <div className="relative flex-shrink-0">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-24 h-24 rounded-xl object-cover"
                        style={{
                            border: '2px solid rgba(212, 112, 10, 0.2)',
                            boxShadow: '0 4px 16px rgba(212, 112, 10, 0.15)',
                        }}
                    />
                    {hasDiscount && (
                        <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-lg text-xs font-bold text-white"
                            style={{ background: '#22C55E' }}>
                            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: '#D4700A' }}>
                        Today's Special
                    </span>
                    <h4 className="font-semibold text-base truncate mt-1" style={{ color: '#1A1612' }}>
                        {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-bold text-lg" style={{ color: '#D4700A' }}>
                            ₹{price}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm line-through" style={{ color: '#9C9083' }}>
                                ₹{originalPrice}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSideCart, setShowSideCart] = useState(false);
    const { cart, total, getItemCount } = useCart();
    const searchDebounceRef = useRef(null);

    // Debounce search
    useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 150);
        return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
    }, [searchQuery]);

    // Load products
    useEffect(() => {
        const cachedProducts = sessionStorage.getItem('cachedProducts');
        const cacheTime = sessionStorage.getItem('productsCacheTime');
        const now = Date.now();
        if (cachedProducts && cacheTime && (now - parseInt(cacheTime)) < 120000) {
            setProducts(JSON.parse(cachedProducts));
            setLoading(false);
        }
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data } = await fetchProducts('');
            setProducts(data);
            sessionStorage.setItem('cachedProducts', JSON.stringify(data));
            sessionStorage.setItem('productsCacheTime', Date.now().toString());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Bestseller products (first 8)
    const bestsellers = useMemo(() => products.slice(0, 8), [products]);
    const featuredProduct = useMemo(() => products.length > 0 ? products[0] : null, [products]);

    const handleItemAdded = useCallback(() => setShowSideCart(true), []);

    const handleCategoryChange = useCallback((categoryId) => {
        setActiveCategory(categoryId === activeCategory ? '' : categoryId);
    }, [activeCategory]);

    return (
        <div className="animate-page-enter" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
            {/* 1. Header */}
            <Header />

            {/* 2. Promo Carousel */}
            <TopPromoCards />

            {/* 3. Search Bar */}
            <div className="search-container">
                <div className="search-box" style={{ margin: '0 16px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <FaSearch size={16} style={{ color: '#B8A898', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search cakes, pastries, breads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* 4. Category Pills */}
            <MainCategoryCards
                onCategorySelect={handleCategoryChange}
                activeCategory={activeCategory}
            />

            {/* 5. Featured Today's Special */}
            <FeaturedBanner product={featuredProduct} />

            {/* 6. Bestsellers Carousel */}
            {!loading && (
                <BestsellersCarousel
                    products={bestsellers}
                    onAddSuccess={handleItemAdded}
                />
            )}

            {/* 7. Testimonials */}
            <Testimonials />

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <div
                    onClick={() => setShowSideCart(true)}
                    className="floating-cart cursor-pointer"
                >
                    <div className="cart-info">
                        <div className="cart-icon-wrap">
                            <FaShoppingBag size={22} />
                            <span className="cart-badge">{getItemCount()}</span>
                        </div>
                        <div className="cart-text">
                            <p>Your Cart</p>
                            <h4>₹{(Number(total) || 0).toFixed(0)}</h4>
                        </div>
                    </div>
                    <button className="view-cart-btn">
                        View Cart →
                    </button>
                </div>
            )}

            {/* Side Cart */}
            <SideCart
                isOpen={showSideCart}
                onClose={() => setShowSideCart(false)}
            />

            {/* 8. Footer */}
            <Footer />
        </div>
    );
};

export default Home;
