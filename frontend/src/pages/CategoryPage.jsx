import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaShoppingCart, FaFire, FaTimes } from 'react-icons/fa';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCardCompact from '../components/ProductCardCompact';
import SideCart from '../components/SideCart';
import Footer from '../components/Footer';

// Category configurations with keywords, theme colors, and subcategories
const CATEGORY_CONFIG = {
    fastfood: {
        name: 'Fast Food',
        icon: '🍔',
        banner: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=300&fit=crop',
        subcategories: ['All', 'Patties', 'Burger', 'Pizza', 'Sandwich', 'Maggi', 'Momos'],
        keywords: ['fastfood', 'fast food', 'burger', 'pizza', 'patties', 'sandwich', 'momos', 'maggi', 'snacks', 'pattis'],
        accentBg: 'linear-gradient(180deg, #FFF5EE 0%, #FFEDD5 100%)',
        accentColor: '#D4700A',
    },
    cake: {
        name: 'Cakes',
        icon: '🎂',
        banner: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=300&fit=crop',
        subcategories: ['All', 'Birthday', 'Anniversary', 'First Birthday', 'Photo Cake', 'Custom', 'Cupcakes'],
        keywords: ['cake', 'cakes', 'pastry', 'pastries', 'cupcake', 'birthday', 'anniversary', 'chocolate cake', 'vanilla', 'photo cake'],
        accentBg: 'linear-gradient(180deg, #FFF0F5 0%, #FFE4EC 100%)',
        accentColor: '#C94070',
    },
    beverages: {
        name: 'Beverages',
        icon: '☕',
        banner: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=300&fit=crop',
        subcategories: ['All', 'Cold Coffee', 'Tea', 'Shakes', 'Mocktails', 'Juice'],
        keywords: ['beverages', 'beverage', 'coffee', 'tea', 'shake', 'juice', 'mocktail', 'drink', 'cold coffee', 'milkshake'],
        accentBg: 'linear-gradient(180deg, #F5F0EA 0%, #EDE5D8 100%)',
        accentColor: '#6B4226',
    },
    bakery: {
        name: 'Bakery',
        icon: '🥐',
        banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=300&fit=crop',
        subcategories: ['All', 'Bread', 'Cookies', 'Croissants', 'Pastries', 'Biscuits'],
        keywords: ['bakery', 'bread', 'cookies', 'croissant', 'biscuit', 'pastry', 'baked'],
        accentBg: 'linear-gradient(180deg, #FFF8F0 0%, #FFE8CC 100%)',
        accentColor: '#B8860B',
    },
    flowers: {
        name: 'Flowers',
        icon: '💐',
        banner: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=300&fit=crop',
        subcategories: ['All', 'Bouquets', 'Roses', 'Mixed', 'Premium', 'Gift Combos'],
        keywords: ['flower', 'flowers', 'bouquet', 'rose', 'roses', 'gift', 'floral', 'arrangement'],
        accentBg: 'linear-gradient(180deg, #F0FFF4 0%, #E8F5E9 100%)',
        accentColor: '#2E7D32',
    },
    patties: {
        name: 'Patties',
        icon: '🥟',
        banner: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=300&fit=crop',
        subcategories: ['All', 'Veg Patties', 'Paneer Patties', 'Aloo Patties', 'Special'],
        keywords: ['patties', 'pattis', 'patty', 'patti', 'samosa', 'snack'],
        accentBg: 'linear-gradient(180deg, #FFF5EE 0%, #FFEDD5 100%)',
        accentColor: '#D4700A',
    },
    pizza: {
        name: 'Pizza',
        icon: '🍕',
        banner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=300&fit=crop',
        subcategories: ['All', 'Veg Pizza', 'Cheese Pizza', 'Special', 'Mini Pizza'],
        keywords: ['pizza', 'pizzas', 'cheese pizza', 'veg pizza'],
        accentBg: 'linear-gradient(180deg, #FFF5EE 0%, #FFEDD5 100%)',
        accentColor: '#D4700A',
    },
    anniversary: {
        name: 'Anniversary',
        icon: '💑',
        banner: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?w=800&h=300&fit=crop',
        subcategories: ['All', 'Cakes', 'Flowers', 'Gift Combos', 'Chocolates', 'Decoration'],
        keywords: ['anniversary', 'wedding', 'couple', 'love', 'romantic', 'heart', 'rose', 'gift'],
        accentBg: 'linear-gradient(180deg, #FFF0F5 0%, #FFE4EC 100%)',
        accentColor: '#C94070',
    }
};

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { cart = [] } = useCart();

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showSideCart, setShowSideCart] = useState(false);

    const category = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.fastfood;
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const { data } = await fetchProducts();
                setAllProducts(data || []);
            } catch (error) {
                console.error('Failed to load products:', error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
        setActiveSubcategory('All');
    }, [categoryId]);

    const filteredProducts = useMemo(() => {
        let filtered = allProducts.filter(product => {
            const productCategory = (product.category || '').toLowerCase();
            const productName = (product.name || '').toLowerCase();
            const productDesc = (product.description || '').toLowerCase();
            return category.keywords.some(keyword =>
                productCategory.includes(keyword) ||
                productName.includes(keyword) ||
                productDesc.includes(keyword)
            );
        });

        if (activeSubcategory !== 'All') {
            const subLower = activeSubcategory.toLowerCase();
            filtered = filtered.filter(p =>
                (p.subcategory || '').toLowerCase().includes(subLower) ||
                (p.name || '').toLowerCase().includes(subLower) ||
                (p.category || '').toLowerCase().includes(subLower)
            );
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                (p.name || '').toLowerCase().includes(query) ||
                (p.description || '').toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [allProducts, category.keywords, activeSubcategory, searchQuery]);

    const handleItemAdded = () => setShowSideCart(true);

    return (
        <div className="min-h-screen pb-20 animate-page-enter" style={{ background: category.accentBg }}>
            {/* Header — Warm gradient themed to category */}
            <header className="sticky top-0 z-20"
                style={{
                    background: 'var(--bg-card)',
                    borderBottom: `2px solid ${category.accentColor}20`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Back + Category Name */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                            style={{ background: `${category.accentColor}15` }}
                            aria-label="Go back"
                        >
                            <FaArrowLeft size={16} color={category.accentColor} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            <h1 className="text-lg font-script" style={{ color: 'var(--text-dark)' }}>
                                {category.name}
                            </h1>
                        </div>
                    </div>

                    {/* Right: Search + Cart */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: `${category.accentColor}15` }}
                            aria-label="Search"
                        >
                            {showSearch ? (
                                <FaTimes size={16} color={category.accentColor} />
                            ) : (
                                <FaSearch size={16} color={category.accentColor} />
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-11 h-11 rounded-xl flex items-center justify-center relative"
                            style={{ background: `${category.accentColor}15` }}
                            aria-label="Cart"
                        >
                            <FaShoppingCart size={16} color={category.accentColor} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                                    style={{ background: category.accentColor }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {showSearch && (
                    <div className="px-4 pb-3 animate-fade-in">
                        <input
                            type="text"
                            placeholder={`Search in ${category.name}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-base"
                            style={{
                                background: 'var(--bg-page)',
                                border: `1px solid var(--border-light)`,
                                color: 'var(--text-dark)',
                                outline: 'none',
                            }}
                            autoFocus
                        />
                    </div>
                )}
            </header>

            {/* Category Banner — Overlapping food photo */}
            <div className="mx-4 mt-4">
                <div className="relative rounded-2xl overflow-hidden"
                    style={{ boxShadow: `0 4px 16px ${category.accentColor}25` }}>
                    <img
                        src={category.banner}
                        alt={`${category.name} Banner`}
                        className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0"
                        style={{ background: `linear-gradient(90deg, ${category.accentColor}dd 0%, transparent 70%)` }}>
                        <div className="p-5 h-full flex flex-col justify-center">
                            <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Explore</p>
                            <h2 className="text-2xl font-script text-white mt-1">{category.name}</h2>
                            <p className="text-sm text-white/80 mt-1">Freshly made daily with love</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subcategory Tabs — Horizontal scroll pills */}
            <div className="mt-4 px-4">
                <div className="flex overflow-x-auto pb-3 gap-2 hide-scrollbar snap-x"
                    style={{ WebkitOverflowScrolling: 'touch' }}>
                    {category.subcategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start"
                            style={{
                                background: activeSubcategory === sub
                                    ? category.accentColor
                                    : 'var(--bg-card)',
                                color: activeSubcategory === sub ? 'white' : 'var(--text-brown)',
                                border: activeSubcategory === sub ? 'none' : '1px solid var(--border-light)',
                                boxShadow: activeSubcategory === sub
                                    ? `0 3px 10px ${category.accentColor}40`
                                    : 'var(--shadow-sm)',
                            }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product List — Zomato-style compact cards */}
            <div className="px-4 mt-2">
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                                <div className="w-[90px] h-[90px] rounded-xl skeleton-shine"
                                    style={{ background: '#E8E3DB' }} />
                                <div className="flex-1">
                                    <div className="h-4 w-3/4 rounded skeleton-shine mb-2.5"
                                        style={{ background: '#E8E3DB' }} />
                                    <div className="h-3 w-1/2 rounded skeleton-shine mb-2.5"
                                        style={{ background: '#E8E3DB' }} />
                                    <div className="h-3 w-full rounded skeleton-shine"
                                        style={{ background: '#E8E3DB' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        {/* Results count */}
                        <div className="flex items-center gap-2 mb-4">
                            <FaFire size={14} color={category.accentColor} />
                            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                                {filteredProducts.length} items found
                            </span>
                        </div>

                        {/* Compact Card List — Single column */}
                        <div className="flex flex-col gap-2.5">
                            {filteredProducts.map((product, idx) => (
                                <div key={product._id} className="animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 0.04}s` }}>
                                    <ProductCardCompact
                                        product={product}
                                        onAddSuccess={handleItemAdded}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <span className="text-6xl mb-4 block">{category.icon}</span>
                        <h3 className="text-lg font-script" style={{ color: 'var(--text-dark)' }}>
                            No items found
                        </h3>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                            No products available in this category yet
                        </p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="mt-5 px-6 py-3 rounded-xl text-white text-base font-medium"
                            style={{
                                background: `linear-gradient(135deg, ${category.accentColor}, ${category.accentColor}cc)`,
                                boxShadow: `0 4px 12px ${category.accentColor}30`,
                                minHeight: '48px',
                            }}
                        >
                            Browse All Categories
                        </button>
                    </div>
                )}
            </div>

            {/* Side Cart */}
            <SideCart
                isOpen={showSideCart}
                onClose={() => setShowSideCart(false)}
            />

            <Footer />
        </div>
    );
};

export default CategoryPage;
