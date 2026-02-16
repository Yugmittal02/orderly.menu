import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubCategoryRow = ({ onSubCategorySelect }) => {
    const navigate = useNavigate();

    const subCategories = [
        {
            id: 'first-birthday-cake',
            name: 'First Birthday',
            image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'anniversary-cake',
            name: 'Anniversary',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'birthday-cake',
            name: 'Birthday',
            image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'photo-cake',
            name: 'Photo Cake',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'patties',
            name: 'Patties',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'beverages',
            name: 'Beverages',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'flowers',
            name: 'Flowers',
            image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop&q=80',
        },
        {
            id: 'pizza',
            name: 'Pizza',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&q=80',
        }
    ];

    const handleClick = (id) => {
        if (onSubCategorySelect) onSubCategorySelect(id);
        navigate(`/category/${id}`);
    };

    return (
        <div className="mt-4 py-4 rounded-2xl"
            style={{
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-light)',
            }}>
            {/* Section Title */}
            <h4 className="text-center text-xs font-bold mb-3 uppercase tracking-widest"
                style={{ color: 'var(--primary)' }}>
                Quick Picks
            </h4>

            {/* Horizontal Scroll Row — 72px circles */}
            <div className="flex overflow-x-auto gap-5 px-4 hide-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch' }}>
                {subCategories.map((sub, index) => (
                    <button
                        key={sub.id}
                        onClick={() => handleClick(sub.id)}
                        className="animate-fade-in flex flex-col items-center gap-2 flex-shrink-0 group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        aria-label={`Browse ${sub.name}`}
                    >
                        <div className="rounded-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md"
                            style={{
                                width: '72px',
                                height: '72px',
                                border: '2.5px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                            <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <p className="text-xs font-semibold text-center leading-tight"
                            style={{ color: 'var(--text-brown)', maxWidth: '72px' }}>
                            {sub.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryRow;
