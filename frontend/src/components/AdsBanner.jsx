import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { fetchOffers } from '../services/api';

const AdsBanner = () => {
    const navigate = useNavigate();
    const [currentAd, setCurrentAd] = useState(0);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const gradients = [
        'linear-gradient(135deg, #D4700A 0%, #E8923A 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
    ];

    const icons = ['🎂', '🥟', '💍', '🎁', '🍕', '🍪'];

    // Default fallback ads - always show these if API fails or returns empty
    const defaultAds = [
        {
            id: 'default-1',
            title: 'Fresh Cakes Daily',
            subtitle: 'Made with love & premium ingredients',
            description: 'Order Now & Get 10% OFF',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
            bgGradient: gradients[0],
            link: '/category/cake',
            badge: '🔥 HOT',
            icon: '🎂'
        },
        {
            id: 'default-2',
            title: 'Birthday Specials',
            subtitle: 'Make celebrations memorable',
            description: 'Custom Cakes Available',
            image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=400&fit=crop',
            bgGradient: gradients[1],
            link: '/category/cake',
            badge: '🎉 SPECIAL',
            icon: '🎁'
        },
        {
            id: 'default-3',
            title: 'Crispy Patties',
            subtitle: 'Hot & Fresh from the oven',
            description: 'Starting at just ₹20',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop',
            bgGradient: gradients[4],
            link: '/category/fastfood',
            badge: '⚡ QUICK',
            icon: '🥟'
        },
        {
            id: 'default-4',
            title: 'Beautiful Flowers',
            subtitle: 'Perfect for every occasion',
            description: 'Fresh Bouquets Daily',
            image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=400&fit=crop',
            bgGradient: gradients[2],
            link: '/category/flowers',
            badge: '💐 NEW',
            icon: '💐'
        }
    ];

    useEffect(() => {
        const loadOffers = async () => {
            try {
                const { data } = await fetchOffers();
                // Transform offers to ads format
                if (data && data.length > 0) {
                    const formattedAds = data.map((offer, index) => ({
                        id: offer._id,
                        title: offer.title,
                        subtitle: offer.description || 'Special Deal For You',
                        description: `Use Code: ${offer.code}`,
                        image: offer.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
                        bgGradient: gradients[index % gradients.length],
                        link: '/category/all',
                        badge: offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`,
                        icon: icons[index % icons.length]
                    }));
                    setAds(formattedAds);
                } else {
                    // Use default ads if no offers from API
                    setAds(defaultAds);
                }
            } catch (error) {
                console.error("Failed to fetch ads:", error);
                // Use default ads on error
                setAds(defaultAds);
            } finally {
                setLoading(false);
            }
        };

        loadOffers();
    }, []);

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        if (ads.length === 0) return;
        const timer = setInterval(() => {
            setCurrentAd((prev) => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [ads.length]);

    const handleAdClick = (link) => {
        navigate(link);
    };

    const goToSlide = (index) => {
        setCurrentAd(index);
    };

    const nextSlide = () => {
        if (ads.length === 0) return;
        setCurrentAd((prev) => (prev + 1) % ads.length);
    };

    const prevSlide = () => {
        if (ads.length === 0) return;
        setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
    };

    if (loading) return null; // Or a skeleton

    return (
        <section className="ads-banner-section" aria-label="Special offers carousel">
            {/* Section Header */}
            <div className="ads-banner-header">
                <div className="ads-banner-title">
                    <span className="fire-icon">🔥</span>
                    <h2 className="font-script">Special Offers</h2>
                    <span className="fire-icon">🔥</span>
                </div>
                <p className="ads-banner-subtitle">Don't miss out on these amazing deals!</p>
            </div>

            {/* Main Carousel */}
            <div className="ads-carousel-wrapper">
                {/* Navigation Arrows */}
                {ads.length > 1 && (
                    <>
                        <button className="carousel-arrow prev" onClick={prevSlide}>
                            ‹
                        </button>
                        <button className="carousel-arrow next" onClick={nextSlide}>
                            ›
                        </button>
                    </>
                )}

                {/* Carousel Container */}
                <div className="ads-carousel" role="region" aria-live="polite" aria-label="Promotional offers">
                    <div
                        className="ads-carousel-track"
                        style={{ transform: `translateX(-${currentAd * 100}%)` }}
                    >
                        {ads.map((ad) => (
                            <div
                                key={ad.id}
                                className="ad-slide"
                                onClick={() => handleAdClick(ad.link)}
                            >
                                <div
                                    className="ad-slide-content"
                                    style={{ background: ad.bgGradient }}
                                >
                                    {/* Left Content */}
                                    <div className="ad-slide-text">
                                        <div className="ad-slide-badge">{ad.badge}</div>
                                        <div className="ad-slide-icon">{ad.icon}</div>
                                        <h3 className="ad-slide-title text-shadow">{ad.title}</h3>
                                        <p className="ad-slide-subtitle">{ad.subtitle}</p>
                                        <p className="ad-slide-description bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm mt-2">{ad.description}</p>
                                        <button className="ad-slide-cta mt-3">
                                            Shop Now <FaArrowRight size={14} />
                                        </button>
                                    </div>

                                    {/* Right Image */}
                                    <div className="ad-slide-image">
                                        <img src={ad.image} alt={ad.title} className="object-cover w-full h-full" />
                                        <div className="ad-slide-image-overlay"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                {ads.length > 1 && (
                    <div className="carousel-dots">
                        {ads.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`carousel-dot ${currentAd === index ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Action Buttons */}
            <div className="ads-action-buttons">
                <button
                    className="action-btn"
                    onClick={() => navigate('/category/cake')}
                >
                    <span className="action-icon">🎂</span>
                    <span>All Cakes</span>
                </button>
                <button
                    className="action-btn"
                    onClick={() => navigate('/category/fastfood')}
                >
                    <span className="action-icon">🍔</span>
                    <span>Fast Food</span>
                </button>
                <button
                    className="action-btn highlight"
                    onClick={() => navigate('/category/cake?sub=birthday-cake')}
                >
                    <span className="action-icon">🎁</span>
                    <span>Birthday</span>
                </button>
                <button
                    className="action-btn"
                    onClick={() => navigate('/category/beverages')}
                >
                    <span className="action-icon">☕</span>
                    <span>Beverages</span>
                </button>
            </div>
        </section>
    );
};

export default AdsBanner;
