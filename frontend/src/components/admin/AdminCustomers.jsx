import React, { useMemo } from 'react';
import { FaUsers, FaClipboardList } from 'react-icons/fa';

const AdminCustomers = ({ orders }) => {
    // Aggregate customers from orders
    const customers = useMemo(() => {
        const customerMap = new Map();
        orders.forEach((order) => {
            // Logic for user based orders
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
            }
            // Logic for guest orders (by phone)
            else if (order.address?.phone || order.phoneNumber) {
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
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-30 pb-4">
                <h2 className="text-2xl font-black text-gray-800">Customers</h2>
                <div className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                    {customers.length} Users
                </div>
            </div>

            <div className="space-y-3">
                {customers.map((customer, idx) => (
                    <div
                        key={customer.id || idx} // fallback key
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                    <span className="text-lg font-black text-purple-600">
                                        {customer.name?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{customer.name || 'Guest'}</p>
                                    <p className="text-sm text-gray-500">{customer.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                                    <FaClipboardList size={10} />
                                    {customer.orderCount} Orders
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                            <div>
                                <span className="text-gray-400 text-xs">Total Spent</span>
                                <p className="font-bold text-green-600">₹{customer.totalSpent.toFixed(0)}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-400 text-xs">Last Order</span>
                                <p className="text-gray-600">
                                    {new Date(customer.lastOrder).toLocaleDateString("en-IN", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {customers.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <FaUsers className="text-5xl mx-auto mb-4 opacity-30" />
                        <p>No customers yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
