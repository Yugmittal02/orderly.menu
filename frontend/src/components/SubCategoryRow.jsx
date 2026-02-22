import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubCategoryRow = ({ onSubCategorySelect }) => {
    const navigate = useNavigate();

    const subCategories = [
        // Row 1
        {
            id: 'first-birthday-cake',
            name: 'First Birthday',
            icon: '🎉',
            image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'anniversary-cake',
            name: 'Anniversary',
            icon: '💍',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'birthday-cake',
            name: 'Birthday',
            icon: '🎂',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'photo-cake',
            name: 'Photo Cake',
            icon: '📸',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&q=80',
            color: '#E8956A'
        },
        // Row 2
        {
            id: 'patties',
            name: 'Patties',
            icon: '🥟',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            icon: '☕',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&q=80',
            color: '#E8956A'
        },
        {
            id: 'flowers',
            name: 'Flowers',
            icon: '💐',
            image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=200&h=200&fit=crop&q=80',
            color: '#C97B4B'
        },
        {
            id: 'pizza',
            name: 'Pizza',
            icon: '🍕',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&q=80',
            color: '#E8956A'
        }
    ];

    // Map subcategory IDs to their parent category route and subcategory tab name
    const categoryRouteMap = {
        'first-birthday-cake': { route: 'cake', sub: 'First Birthday' },
        'anniversary-cake': { route: 'anniversary', sub: 'All' },
        'birthday-cake': { route: 'cake', sub: 'Birthday' },
        'photo-cake': { route: 'cake', sub: 'Photo Cake' },
        'patties': { route: 'patties', sub: 'All' },
        'beverages': { route: 'beverages', sub: 'All' },
        'flowers': { route: 'flowers', sub: 'All' },
        'pizza': { route: 'pizza', sub: 'All' },
    };

    const handleClick = (id) => {
        if (onSubCategorySelect) {
            onSubCategorySelect(id);
        }
        const mapping = categoryRouteMap[id];
        if (mapping) {
            navigate(`/category/${mapping.route}${mapping.sub !== 'All' ? `?sub=${encodeURIComponent(mapping.sub)}` : ''}`);
        } else {
            navigate(`/category/${id}`);
        }
    };

    return (
        <div className="mx-4 mt-2 mb-4 bg-white/60 backdrop-blur-md rounded-2xl border border-[#E8DEC8]/60 shadow-sm overflow-hidden">
            {/* Section Title */}
            <h3 className="text-center text-[#C97B4B] font-bold text-sm py-3 border-b border-[#E8DEC8]/40">
                ✨ Quick Picks
            </h3>

            {/* 4x2 Grid Layout */}
            <div className="grid grid-cols-4 gap-3 p-3">
                {subCategories.map((sub, index) => (
                    <button
                        key={sub.id}
                        onClick={() => handleClick(sub.id)}
                        className="animate-fade-in flex flex-col items-center gap-2 group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-[#E8DEC8] relative shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                            <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                                <span className="text-xl drop-shadow-md filter">{sub.icon}</span>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs font-semibold text-[#5C3A21] text-center leading-tight">
                            {sub.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryRow;
