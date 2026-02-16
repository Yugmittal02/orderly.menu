import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminMenu = ({
    products,
    onAdd,
    onEdit,
    onDelete,
    onToggleAvailability
}) => {
    const [search, setSearch] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-4 pb-20 pt-4">
            {/* Header & Search */}
            <div className="sticky top-0 bg-gray-50 z-30 pb-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-800">Menu</h2>
                    <button
                        onClick={onAdd}
                        className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-200 active:scale-95 transition-transform"
                    >
                        <FaPlus size={12} /> Add Item
                    </button>
                </div>
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredProducts.map((product) => (
                    <div key={product._id} className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 ${!product.isAvailable ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: product.image ? `url(${product.image})` : 'none' }}>
                            {!product.image && <div className="flex items-center justify-center h-full text-2xl">🍰</div>}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-sm truncate pr-2">{product.name}</h3>
                                    <p className="font-bold text-amber-600">₹{product.basePrice}</p>
                                </div>
                                <p className="text-xs text-gray-500">{product.category}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-end justify-between gap-3 mt-2">
                                <button
                                    onClick={() => onToggleAvailability(product)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex-1 transition-colors ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product._id)}
                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMenu;
