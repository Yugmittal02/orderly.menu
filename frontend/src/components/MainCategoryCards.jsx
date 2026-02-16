import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SubCategoryRow from './SubCategoryRow';

const MainCategoryCards = ({ onCategorySelect, activeCategory }) => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const categories = [
        {
            id: 'cake',
            name: 'Cakes',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop&q=80',
            color: '#D4700A',
        },
        {
            id: 'pastry',
            name: 'Pastries',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&q=80',
            color: '#DC2626',
        },
        {
            id: 'cookie',
            name: 'Cookies',
            image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop&q=80',
            color: '#B45309',
        },
        {
            id: 'bread',
            name: 'Breads',
            image: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=100&h=100&fit=crop&q=80',
            color: '#92400E',
        },
        {
            id: 'dessert',
            name: 'Desserts',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop&q=80',
            color: '#7C3AED',
        },
        {
            id: 'snack',
            name: 'Snacks',
            image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&h=100&fit=crop&q=80',
            color: '#0D9488',
        },
    ];

    const handleCategoryClick = (categoryId) => {
        if (onCategorySelect) {
            onCategorySelect(categoryId);
        } else {
            navigate(`/category/${categoryId}`);
        }
    };

    return (
        <div style={{ padding: '12px 0' }}>
            {/* Category Pill Row */}
            <div
                ref={scrollRef}
                className="hide-scrollbar"
                style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    padding: '4px 16px 12px',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            style={{
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px 8px 8px',
                                borderRadius: '9999px',
                                border: isActive ? `2px solid ${cat.color}` : '2px solid #EDE6DC',
                                background: isActive ? `${cat.color}10` : '#FFFFFF',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minHeight: '44px',
                                boxShadow: isActive
                                    ? `0 4px 12px ${cat.color}30`
                                    : '0 2px 8px rgba(58, 42, 28, 0.06)',
                            }}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `2px solid ${isActive ? cat.color : '#EDE6DC'}`,
                                }}
                                loading="lazy"
                            />
                            <span style={{
                                fontSize: '13px',
                                fontWeight: isActive ? 700 : 600,
                                color: isActive ? cat.color : '#3B322A',
                                whiteSpace: 'nowrap',
                            }}>
                                {cat.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* SubCategory Quick Picks */}
            {activeCategory && (
                <SubCategoryRow
                    category={activeCategory}
                    onSubCategorySelect={(subId) => navigate(`/category/${activeCategory}?sub=${subId}`)}
                />
            )}
        </div>
    );
};

export default MainCategoryCards;
