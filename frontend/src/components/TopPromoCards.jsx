import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaPercent, FaBolt, FaTruck, FaGift } from 'react-icons/fa';

const promoCards = [
    {
        id: 1,
        title: 'Up to 60% OFF',
        subtitle: 'First order — use code WELCOME60',
        badge: 'NEW USER',
        icon: <FaPercent size={18} />,
        gradient: 'linear-gradient(135deg, #D4700A 0%, #E8923A 60%, #F5B041 100%)',
        cta: 'Order Now',
        route: '/menu',
    },
    {
        id: 2,
        title: 'Free Delivery',
        subtitle: 'On orders above ₹499 today',
        badge: 'LIMITED',
        icon: <FaTruck size={18} />,
        gradient: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 60%, #2DD4BF 100%)',
        cta: 'Shop Now',
        route: '/menu',
    },
    {
        id: 3,
        title: 'Flash Sale',
        subtitle: 'Bestseller cakes at flat 40% off',
        badge: 'ENDS SOON',
        icon: <FaBolt size={18} />,
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 60%, #A78BFA 100%)',
        cta: 'Grab Now',
        route: '/category/cake',
    },
    {
        id: 4,
        title: 'Gift a Box',
        subtitle: 'Curated gift boxes for every occasion',
        badge: 'TRENDING',
        icon: <FaGift size={18} />,
        gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 60%, #F87171 100%)',
        cta: 'Explore',
        route: '/menu',
    },
];

const TopPromoCards = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const autoPlayRef = useRef(null);

    const scrollToIndex = useCallback((index) => {
        if (!scrollRef.current) return;
        const cardWidth = scrollRef.current.children[0]?.offsetWidth || 0;
        const gap = 14;
        scrollRef.current.scrollTo({
            left: index * (cardWidth + gap),
            behavior: 'smooth'
        });
        setActiveIndex(index);
    }, []);

    // Auto-advance
    useEffect(() => {
        if (isPaused) return;
        autoPlayRef.current = setInterval(() => {
            setActiveIndex(prev => {
                const next = (prev + 1) % promoCards.length;
                scrollToIndex(next);
                return next;
            });
        }, 4000);
        return () => clearInterval(autoPlayRef.current);
    }, [isPaused, scrollToIndex]);

    // Track scroll position
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, children } = scrollRef.current;
        const cardWidth = children[0]?.offsetWidth || 0;
        const gap = 14;
        const index = Math.round(scrollLeft / (cardWidth + gap));
        setActiveIndex(Math.min(index, promoCards.length - 1));
    }, []);

    return (
        <section
            className="top-promo-section"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="top-promo-scroll hide-scrollbar"
                onScroll={handleScroll}
            >
                {promoCards.map((card) => (
                    <div
                        key={card.id}
                        className="promo-card"
                        style={{ background: card.gradient }}
                        onClick={() => navigate(card.route)}
                    >
                        {/* Badge */}
                        <span className="promo-card-badge">{card.badge}</span>

                        {/* Content */}
                        <div className="promo-card-content">
                            <div className="promo-card-icon-wrap">
                                {card.icon}
                            </div>

                            <h3 className="promo-card-title">{card.title}</h3>
                            <p className="promo-card-subtitle">{card.subtitle}</p>

                            <button className="promo-card-cta">
                                {card.cta}
                                <FaArrowRight size={10} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress bar indicator */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 20px 4px',
            }}>
                {promoCards.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToIndex(i)}
                        style={{
                            height: '3px',
                            flex: 1,
                            maxWidth: '40px',
                            borderRadius: '2px',
                            border: 'none',
                            padding: 0,
                            minHeight: 'auto',
                            cursor: 'pointer',
                            background: i === activeIndex
                                ? '#D4700A'
                                : '#E0D8CE',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        aria-label={`Go to promo ${i + 1}`}
                    >
                        {i === activeIndex && !isPaused && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                background: '#D4700A',
                                animation: 'progressBar 4s linear',
                                borderRadius: '2px',
                            }} />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default TopPromoCards;
