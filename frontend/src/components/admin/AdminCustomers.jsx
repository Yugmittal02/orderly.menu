import React, { useMemo } from 'react';
import { FaUsers, FaClipboardList } from 'react-icons/fa';

const AdminCustomers = ({ orders }) => {
    const customers = useMemo(() => {
        const customerMap = new Map();
        orders.forEach((order) => {
            if (order.user) {
                if (customerMap.has(order.user._id)) {
                    const c = customerMap.get(order.user._id);
                    c.orderCount += 1;
                    c.totalSpent += order.totalAmount || 0;
                    if (new Date(order.createdAt) > new Date(c.lastOrder)) {
                        c.lastOrder = order.createdAt;
                    }
                } else {
                    customerMap.set(order.user._id, {
                        id: order.user._id,
                        name: order.user.name,
                        phone: order.user.phone,
                        email: order.user.email,
                        orderCount: 1,
                        totalSpent: order.totalAmount || 0,
                        lastOrder: order.createdAt,
                    });
                }
            } else if (order.address?.phone || order.phoneNumber) {
                const phone = order.address?.phone || order.phoneNumber;
                if (customerMap.has(phone)) {
                    const c = customerMap.get(phone);
                    c.orderCount += 1;
                    c.totalSpent += order.totalAmount || 0;
                } else {
                    customerMap.set(phone, {
                        id: phone,
                        name: order.address?.name || 'Guest',
                        phone: phone,
                        orderCount: 1,
                        totalSpent: order.totalAmount || 0,
                        lastOrder: order.createdAt
                    });
                }
            }
        });
        return Array.from(customerMap.values()).sort((a, b) => b.orderCount - a.orderCount);
    }, [orders]);

    return (
        <div className="px-4 pb-20 pt-4">
            <div className="flex justify-between items-center mb-6 sticky top-0 z-30 pb-4" style={{ background: '#FAF7F2' }}>
                <h2 className="text-2xl font-black" style={{ color: '#1C1C1C' }}>Customers</h2>
                <div className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{ background: '#FFFFFF', color: '#C97B4B', border: '2px solid #E8E3DB' }}>
                    {customers.length} Users
                </div>
            </div>

            <div className="space-y-3">
                {customers.map((customer, idx) => (
                    <div
                        key={customer.id || idx}
                        className="p-4 rounded-2xl"
                        style={{ background: '#FFFFFF', border: '2px solid #E8E3DB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE8CC 100%)', border: '2px solid #E8E3DB' }}>
                                    <span className="text-lg font-black" style={{ color: '#C97B4B' }}>
                                        {customer.name?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold" style={{ color: '#1C1C1C' }}>{customer.name || 'Guest'}</p>
                                    <p className="text-sm" style={{ color: '#A0998F' }}>{customer.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
                                    style={{ background: '#FEF3E2', color: '#C97B4B' }}>
                                    <FaClipboardList size={10} />
                                    {customer.orderCount} Orders
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 flex justify-between text-sm"
                            style={{ borderTop: '2px solid #F5F0E8' }}>
                            <div>
                                <span className="text-xs" style={{ color: '#A0998F' }}>Total Spent</span>
                                <p className="font-bold" style={{ color: '#16A34A' }}>₹{customer.totalSpent}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs" style={{ color: '#A0998F' }}>Last Order</span>
                                <p style={{ color: '#7E7E7E' }}>
                                    {new Date(customer.lastOrder).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {customers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                            style={{ background: '#FEF3E2', border: '3px solid #E8E3DB' }}>
                            <FaUsers size={28} style={{ color: '#C97B4B' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#7E7E7E' }}>No customers yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
