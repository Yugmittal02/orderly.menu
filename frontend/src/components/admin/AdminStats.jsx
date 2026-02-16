import React from 'react';
import { FaClipboardList, FaRupeeSign, FaClock, FaChartLine } from 'react-icons/fa';

const AdminStats = ({ todayOrders, todayRevenue, pendingOrders }) => {
    return (
        <div className="px-4 pb-20 pt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800">Overview</h2>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">
                    Live Updates
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Today's Orders */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-orange-100 relative overflow-hidden col-span-2 sm:col-span-1">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                <FaClipboardList />
                            </div>
                            <span className="text-gray-500 font-bold text-sm">Today's Orders</span>
                        </div>
                        <p className="text-4xl font-black text-gray-800">{todayOrders.length}</p>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
                </div>

                {/* Today's Revenue */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-green-100 relative overflow-hidden col-span-2 sm:col-span-1">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <FaRupeeSign />
                            </div>
                            <span className="text-gray-500 font-bold text-sm">Today's Revenue</span>
                        </div>
                        <p className="text-4xl font-black text-gray-800">₹{todayRevenue.toFixed(0)}</p>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-yellow-100 relative overflow-hidden col-span-2">
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                                    <FaClock />
                                </div>
                                <span className="text-gray-500 font-bold text-sm">Pending Orders</span>
                            </div>
                            <p className="text-4xl font-black text-gray-800">{pendingOrders}</p>
                        </div>
                        <div className="h-full flex items-center pr-4">
                            {pendingOrders > 0 ? (
                                <div className="animate-pulse flex gap-2 items-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-xs font-bold">Action Required</span>
                                </div>
                            ) : (
                                <div className="flex gap-2 items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                    <FaClock />
                                    <span className="text-xs font-bold">All Clear</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Placeholder for future charts */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChartLine className="text-gray-300 text-2xl" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Detailed Analytics</h3>
                <p className="text-gray-400 text-sm">Weekly and monthly charts coming soon.</p>
            </div>
        </div>
    );
};

export default AdminStats;
