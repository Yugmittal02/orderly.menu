import React from 'react';
import {
    FaClipboardList,
    FaUtensils,
    FaTags,
    FaUsers,
    FaChartLine,
    FaCog
} from 'react-icons/fa';

const AdminLayout = ({ activeTab, setActiveTab, children }) => {
    const tabs = [
        { id: "orders", label: "Orders", icon: FaClipboardList },
        { id: "menu", label: "Menu", icon: FaUtensils },
        { id: "offers", label: "Offers", icon: FaTags },
        { id: "customers", label: "Users", icon: FaUsers },
        { id: "revenue", label: "Stats", icon: FaChartLine },
        { id: "settings", label: "Settings", icon: FaCog },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-20">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200 flex-col items-center py-6 z-50">
                <div className="w-12 h-12 bg-amber-100 rounded-xl mb-8 flex items-center justify-center text-2xl shadow-sm border border-amber-200">
                    🍰
                </div>
                <div className="flex flex-col gap-4 w-full px-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all group relative ${activeTab === tab.id
                                ? "bg-amber-50 text-amber-600"
                                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                }`}
                        >
                            <tab.icon size={20} />
                            <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {tab.label}
                            </div>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto min-h-screen">
                {children}
            </main>

            {/* Mobile Bottom Navigation (Visible on Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 px-2 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === tab.id
                                ? "text-amber-600"
                                : "text-gray-400"
                                }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${activeTab === tab.id ? 'bg-amber-50 transform -translate-y-1' : ''}`}>
                                <tab.icon size={20} />
                            </div>
                            <span className={`text-[10px] font-medium mt-0.5 ${activeTab === tab.id ? 'font-bold' : ''}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default AdminLayout;
