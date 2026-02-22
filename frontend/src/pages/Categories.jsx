import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaArrowLeft } from 'react-icons/fa';

const Categories = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'cake',
            name: 'Cake',
            icon: '🎂',
            image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop&q=80',
            description: 'Delicious cakes for every occasion',
            color: 'bg-pink-50'
        },
        {
            id: 'fastfood',
            name: 'Fast Food',
            icon: '🍔',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80',
            description: 'Tasty burgers, fries & more',
            color: 'bg-orange-50'
        },
        {
            id: 'bakery',
            name: 'Bakery',
            icon: '🥐',
            image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=400&fit=crop&q=80',
            description: 'Freshly baked breads & cookies',
            color: 'bg-yellow-50'
        },
        {
            id: 'beverages',
            name: 'Beverages',
            icon: '☕',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80',
            description: 'Refreshing drinks & shakes',
            color: 'bg-emerald-50'
        },
        {
            id: 'flowers',
            name: 'Flowers',
            icon: '💐',
            image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop&q=80',
            description: 'Beautiful bouquets',
            color: 'bg-rose-50'
        },
        {
            id: 'anniversary',
            name: 'Anniversary',
            icon: '💑',
            image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=400&fit=crop&q=80',
            description: 'Special gifts for couples',
            color: 'bg-purple-50'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDF8F4]">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-gray-600"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-[#2D1810]">All Categories</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => navigate(`/category/${category.id}`)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-[#F0E8E0]"
                        >
                            <div className="h-32 md:h-40 overflow-hidden relative">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                <span className="absolute bottom-3 left-3 text-2xl">{category.icon}</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-[#2D1810] mb-1 group-hover:text-[#C97B4B] transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
