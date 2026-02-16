import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaQuoteRight } from 'react-icons/fa';

const testimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        location: 'Gwalior',
        rating: 5,
        text: 'The best cakes in town! The chocolate truffle was absolutely divine. Will definitely order again for every celebration.',
        initials: 'PS',
        color: '#D4700A',
    },
    {
        id: 2,
        name: 'Rahul Verma',
        location: 'Gwalior',
        rating: 5,
        text: 'Ordered a birthday cake for my daughter and it was perfect. Beautiful design and the taste was out of this world!',
        initials: 'RV',
        color: '#7C3AED',
    },
    {
        id: 3,
        name: 'Sneha Gupta',
        location: 'Gwalior',
        rating: 5,
        text: 'Fresh pastries and amazing customer service. Delivery was right on time. Sewa Shubham never disappoints!',
        initials: 'SG',
        color: '#0D9488',
    },
    {
        id: 4,
        name: 'Amit Jain',
        location: 'Gwalior',
        rating: 4,
        text: 'Great variety and excellent quality. The cookies are my favourite — perfectly crunchy with just the right sweetness.',
        initials: 'AJ',
        color: '#DC2626',
    },
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextTestimonial = useCallback(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextTestimonial, 5000);
        return () => clearInterval(timer);
    }, [nextTestimonial]);

    const current = testimonials[activeIndex];

    return (
        <section
            style={{
                padding: '40px 16px',
                background: 'linear-gradient(180deg, #FFFCF8 0%, #FFF7F0 100%)',
                borderTop: '1px solid rgba(232, 222, 200, 0.5)',
            }}
        >
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '28px',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#3B322A',
                    margin: '0 0 6px',
                }}>
                    What Our Customers Say
                </h2>
                <div style={{
                    width: '48px',
                    height: '3px',
                    background: 'linear-gradient(135deg, #D4700A, #E8923A)',
                    margin: '0 auto',
                    borderRadius: '2px',
                }} />
            </div>

            {/* Testimonial Card */}
            <div
                key={current.id}
                style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '28px 24px',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #EDE6DC',
                    boxShadow: '0 4px 20px rgba(58, 42, 28, 0.08)',
                    animation: 'fadeIn 0.5s ease',
                    position: 'relative',
                }}
            >
                {/* Quote icon */}
                <FaQuoteRight
                    size={24}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '24px',
                        color: 'rgba(212, 112, 10, 0.1)',
                    }}
                />

                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            size={14}
                            style={{ color: i < current.rating ? '#F5A623' : '#E0D8CE' }}
                        />
                    ))}
                </div>

                {/* Quote text */}
                <p style={{
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: '#3B322A',
                    margin: '0 0 20px',
                    fontStyle: 'italic',
                }}>
                    "{current.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `${current.color}15`,
                        border: `2px solid ${current.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: current.color,
                    }}>
                        {current.initials}
                    </div>
                    <div>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1A1612',
                            margin: 0,
                        }}>
                            {current.name}
                        </p>
                        <p style={{
                            fontSize: '12px',
                            color: '#7A6E62',
                            margin: 0,
                        }}>
                            {current.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dots */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '16px',
            }}>
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        style={{
                            width: i === activeIndex ? '20px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: i === activeIndex ? '#D4700A' : '#E0D8CE',
                            border: 'none',
                            padding: 0,
                            minHeight: 'auto',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        aria-label={`Testimonial ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
