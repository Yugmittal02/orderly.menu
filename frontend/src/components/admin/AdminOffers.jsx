import React from 'react';
import { FaTicketAlt, FaTrash, FaPlus, FaCalendarAlt, FaMoneyBillWave, FaEdit, FaUsers, FaRupeeSign } from 'react-icons/fa';

const AdminOffers = ({ offers, onAdd, onEdit, onDelete }) => {
    const isExpired = (offer) => offer.validTo && new Date(offer.validTo) < new Date();
    const isUpcoming = (offer) => offer.validFrom && new Date(offer.validFrom) > new Date();

    return (
        <div className="px-4 pb-20 pt-4">
            <div className="flex justify-between items-center mb-6 sticky top-0 z-30 pb-4" style={{ background: '#FAF7F2' }}>
                <h2 className="text-2xl font-black" style={{ color: '#1C1C1C' }}>Offers</h2>
                <button
                    onClick={onAdd}
                    className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-white active:scale-95 transition-transform"
                    style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)', boxShadow: '0 4px 16px rgba(201, 123, 75, 0.3)' }}
                >
                    <FaPlus size={12} /> Create Offer
                </button>
            </div>

            <div className="space-y-4">
                {offers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                            style={{ background: '#FEF3E2', border: '3px solid #E8E3DB' }}>
                            <FaTicketAlt size={28} style={{ color: '#C97B4B' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#7E7E7E' }}>No offers yet</p>
                        <p className="text-sm mt-1" style={{ color: '#A0998F' }}>Create your first offer to attract customers</p>
                    </div>
                ) : (
                    offers.map((offer) => (
                        <div
                            key={offer._id}
                            className={`p-4 rounded-2xl relative overflow-hidden ${!offer.isActive ? 'opacity-60' : ''}`}
                            style={{
                                background: '#FFFFFF',
                                border: `2px solid ${!offer.isActive ? '#E8E3DB' : isExpired(offer) ? '#FECACA' : isUpcoming(offer) ? '#BFDBFE' : '#BBF7D0'}`
                            }}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                    style={!offer.isActive ? { background: '#FAF7F2', color: '#7E7E7E' }
                                        : isExpired(offer) ? { background: '#FEE2E2', color: '#DC2626' }
                                            : isUpcoming(offer) ? { background: '#DBEAFE', color: '#2563EB' }
                                                : { background: '#DCFCE7', color: '#16A34A' }
                                    }>
                                    {!offer.isActive ? 'INACTIVE' :
                                        isExpired(offer) ? 'EXPIRED' :
                                            isUpcoming(offer) ? 'UPCOMING' : 'ACTIVE'}
                                </span>
                            </div>

                            <div className="relative z-10 flex gap-4">
                                {/* Coupon Code */}
                                <div className="rounded-xl px-2 py-4 flex flex-col items-center justify-center min-w-[70px]"
                                    style={{ background: '#FEF3E2', border: '2px dashed #C97B4B' }}>
                                    <span className="font-bold text-lg" style={{ writingMode: 'vertical-rl', color: '#C97B4B' }}>
                                        {offer.code}
                                    </span>
                                    <FaTicketAlt className="mt-2" style={{ color: '#C97B4B' }} />
                                </div>

                                <div className="flex-1 py-1">
                                    <h3 className="font-bold text-lg leading-tight mb-1 pr-16" style={{ color: '#1C1C1C' }}>{offer.title}</h3>
                                    <p className="text-sm mb-3" style={{ color: '#7E7E7E' }}>{offer.description}</p>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="px-2 py-1.5 rounded-lg flex items-center gap-1.5"
                                            style={{ background: '#FAF7F2', color: '#7E7E7E', border: '1px solid #E8E3DB' }}>
                                            <FaMoneyBillWave style={{ color: '#16A34A' }} />
                                            <span className="font-bold">
                                                {offer.discountType === 'percentage'
                                                    ? `${offer.discountValue}% OFF${offer.maxDiscount ? ` (max ₹${offer.maxDiscount})` : ''}`
                                                    : `₹${offer.discountValue} OFF`}
                                            </span>
                                        </div>
                                        <div className="px-2 py-1.5 rounded-lg flex items-center gap-1.5"
                                            style={{ background: '#FAF7F2', color: '#7E7E7E', border: '1px solid #E8E3DB' }}>
                                            <FaCalendarAlt style={{ color: '#3B82F6' }} />
                                            <span>{offer.validTo ? new Date(offer.validTo).toLocaleDateString() : 'No Expiry'}</span>
                                        </div>
                                        {offer.minOrderValue > 0 && (
                                            <div className="px-2 py-1.5 rounded-lg flex items-center gap-1.5"
                                                style={{ background: '#FAF7F2', color: '#7E7E7E', border: '1px solid #E8E3DB' }}>
                                                <FaRupeeSign size={10} style={{ color: '#C97B4B' }} />
                                                <span>Min ₹{offer.minOrderValue}</span>
                                            </div>
                                        )}
                                        {(offer.maxUsageCount !== null && offer.maxUsageCount !== undefined) && (
                                            <div className="px-2 py-1.5 rounded-lg flex items-center gap-1.5"
                                                style={{ background: '#FAF7F2', color: '#7E7E7E', border: '1px solid #E8E3DB' }}>
                                                <FaUsers size={10} style={{ color: '#8B5CF6' }} />
                                                <span>{offer.usedCount || 0}/{offer.maxUsageCount} used</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => onEdit(offer)}
                                            className="flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                                            style={{ background: '#FEF3E2', color: '#C97B4B', border: '1px solid #E8E3DB' }}
                                        >
                                            <FaEdit size={11} /> Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(offer._id)}
                                            className="px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                                            style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
                                        >
                                            <FaTrash size={11} /> Delete
                                        </button>
                                    </div>

                                    {offer.image && (
                                        <div className="mt-3 h-24 w-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${offer.image})`, border: '2px solid #E8E3DB' }}>
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
