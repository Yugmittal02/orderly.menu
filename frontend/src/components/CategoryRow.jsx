import React from 'react';

const CategoryRow = ({ onCategorySelect }) => {
    const categories = [
        {
            id: 'first-birthday',
            name: 'First Birthday',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=150&fit=crop',
            emoji: '🎂'
        },
        {
            id: 'patties',
            name: 'Patties',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=150&fit=crop',
            emoji: '🥟'
        },
        {
            id: 'anniversary',
            name: 'Anniversary',
            image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=150&fit=crop',
            emoji: '💍'
        },
        {
            id: 'birthday-cake',
            name: 'Birthday Cake',
            image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=200&h=150&fit=crop',
            emoji: '🎁'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=150&fit=crop',
            emoji: '🧋'
        }
    ];

    return (
        <section className="categories-section">
            <h3>Categories</h3>

            <div className="categories-scroll hide-scrollbar">
                {categories.map((category, index) => (
                    <button
                        key={category.id}
                        onClick={() => onCategorySelect?.(category.id)}
                        className="category-thumb animate-fade-in"
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        <div className="category-thumb-img relative">
                            <img
                                src={category.image}
                                alt={category.name}
                                loading="lazy"
                            />
                            {/* Hover overlay with emoji */}
                            <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'rgba(107, 68, 35, 0.7)' }}
                            >
                                <span className="text-2xl">{category.emoji}</span>
                            </div>
                        </div>
                        <p>{category.name}</p>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategoryRow;
