import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const PromoBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="promo-banner animate-fade-in-up">
            <div className="promo-content">
                {/* Text Content */}
                <div className="promo-text">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style={{ background: 'rgba(201, 169, 98, 0.2)', color: '#6B4423' }}>
                        ✨ Limited Time Offer
                    </div>
                    <h2>
                        Upto 25% Off<br />
                        <span style={{ color: '#C9A962' }}>Premium Cakes</span>
                    </h2>
                    <p>Sweet selection of our finest handcrafted cakes!</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="shop-now-btn group"
                    >
                        <span>Shop Now</span>
                        <FaArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" size={12} />
                    </button>
                </div>

                {/* Image */}
                <div className="promo-image">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&h=400&fit=crop"
                            alt="Birthday Cake"
                            loading="lazy"
                            className="animate-float"
                            style={{ animationDuration: '4s' }}
                        />
                        {/* Happy Birthday Badge */}
                        <div
                            className="absolute top-4 right-4 px-5 py-2 rounded-xl shadow-xl"
                            style={{
                                background: 'linear-gradient(135deg, #C9A962 0%, #B8983A 100%)',
                                fontFamily: "'Great Vibes', cursive",
                                fontSize: '20px',
                                color: 'white',
                                boxShadow: '0 8px 24px rgba(201, 169, 98, 0.4)'
                            }}
                        >
                            Happy Birthday
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                            🎉
                        </div>
                        <div className="absolute -top-2 -left-2 text-xl animate-pulse">
                            ⭐
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
