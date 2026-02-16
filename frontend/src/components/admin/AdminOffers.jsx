import React from 'react';
import { FaTicketAlt, FaTrash, FaPlus, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const AdminOffers = ({ offers, onAdd, onDelete }) => {
    return (
        <div className="px-4 pb-20 pt-4">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-30 pb-4">
                <h2 className="text-2xl font-black text-gray-800">Offers</h2>
                <button
                    onClick={onAdd}
                    className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-200 active:scale-95 transition-transform"
                >
                    <FaPlus size={12} /> Create Offer
                </button>
            </div>

            <div className="space-y-4">
                {offers.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FaTicketAlt className="text-5xl mx-auto mb-4 opacity-30" />
                        <p className="font-medium">No active offers</p>
                    </div>
                ) : (
                    offers.map((offer) => (
                        <div
                            key={offer._id}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
                        >
                            {/* Decorative Circle */}
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-50 rounded-full z-0"></div>

                            <div className="relative z-10 flex gap-4">
                                {/* Coupon Code vertical strip */}
                                <div className="bg-amber-100 rounded-xl px-2 py-4 flex flex-col items-center justify-center border border-dashed border-amber-300 min-w-[70px]">
                                    <span className="text-amber-700 font-bold text-lg rotate-180 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                                        {offer.code}
                                    </span>
                                    <FaTicketAlt className="text-amber-500 mt-2" />
                                </div>

                                <div className="flex-1 py-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{offer.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onDelete(offer._id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{offer.description}</p>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-600">
                                            <FaMoneyBillWave className="text-green-500" />
                                            <span className="font-bold">
                                                {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-600">
                                            <FaCalendarAlt className="text-blue-500" />
                                            <span>
                                                {offer.validTo ? new Date(offer.validTo).toLocaleDateString() : 'No Expiry'}
                                            </span>
                                        </div>
                                    </div>

                                    {offer.image && (
                                        <div className="mt-3 h-24 w-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${offer.image})` }}>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOffers;
