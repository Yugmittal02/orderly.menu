import React, { useState, useEffect } from 'react';
import { FaStore, FaToggleOn, FaToggleOff, FaLock, FaSave, FaChevronDown, FaChevronUp, FaAddressCard, FaExclamationTriangle } from 'react-icons/fa';
import { getHomepageBadges, updateHomepageBadges } from '../../services/api';

const AdminSettings = ({
    storeSettings,
    setStoreSettings,
    onUpdateStore,
    onResetData,
}) => {
    // Reset data state
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1 = confirm, 2 = type text, 3 = password
    const [resetConfirmText, setResetConfirmText] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    // Homepage Badges state
    const [badges, setBadges] = useState([]);
    const [badgesOpen, setBadgesOpen] = useState(false);
    const [badgesSaving, setBadgesSaving] = useState(false);
    const [badgesMsg, setBadgesMsg] = useState('');

    useEffect(() => {
        const loadBadges = async () => {
            try {
                const { data } = await getHomepageBadges();
                setBadges(data);
            } catch (err) {
                console.error('Failed to load badges:', err);
            }
        };
        loadBadges();
    }, []);

    const handleBadgeChange = (index, field, value) => {
        const updated = [...badges];
        updated[index] = { ...updated[index], [field]: value };
        setBadges(updated);
    };

    const saveBadges = async () => {
        setBadgesSaving(true);
        setBadgesMsg('');
        try {
            await updateHomepageBadges(badges);
            setBadgesMsg('✅ Saved!');
            setTimeout(() => setBadgesMsg(''), 2000);
        } catch (err) {
            setBadgesMsg('❌ Failed to save');
        }
        setBadgesSaving(false);
    };

    return (
        <div className="px-4 pb-24 pt-4 space-y-5">
            <h2 className="text-2xl font-black" style={{ color: '#1C1C1C' }}>Settings</h2>

            {/* Store Status */}
            <div className="p-5 rounded-2xl"
                style={{ background: '#FFFFFF', border: '2px solid #E8E3DB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: '#FEF3E2', color: '#C97B4B' }}>
                        <FaStore />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold" style={{ color: '#1C1C1C' }}>Store Status</h3>
                        <p className="text-xs" style={{ color: '#A0998F' }}>Control whether customers can place orders</p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl mb-4"
                    style={{ background: '#FAF7F2', border: '1px solid #E8E3DB' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: storeSettings.isOpen ? '#16A34A' : '#DC2626' }}></div>
                        <span className="font-bold" style={{ color: storeSettings.isOpen ? '#16A34A' : '#DC2626' }}>
                            {storeSettings.isOpen ? 'Store is Open' : 'Store is Closed'}
                        </span>
                    </div>
                    <button
                        onClick={() => setStoreSettings({ ...storeSettings, isOpen: !storeSettings.isOpen })}
                        className="text-3xl transition-transform active:scale-90"
                        style={{ color: storeSettings.isOpen ? '#16A34A' : '#A0998F' }}
                    >
                        {storeSettings.isOpen ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                </div>
                <button
                    onClick={onUpdateStore}
                    className="w-full py-3 text-white font-bold rounded-xl active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)', boxShadow: '0 4px 12px rgba(201, 123, 75, 0.3)' }}
                >
                    Save Settings
                </button>
            </div>

            {/* Store Public Details */}
            <div className="p-5 rounded-2xl"
                style={{ background: '#FFFFFF', border: '2px solid #E8E3DB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: '#FEF3E2', color: '#16A34A' }}>
                        <FaAddressCard />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold" style={{ color: '#1C1C1C' }}>Store Public Details</h3>
                        <p className="text-xs" style={{ color: '#A0998F' }}>Contact and location info displayed to users</p>
                    </div>
                </div>

                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: '#1C1C1C' }}>Phone Number (WhatsApp & Calling)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2.5 rounded-xl text-sm"
                            style={{ background: '#FAF7F2', border: '1px solid #E8E3DB', outline: 'none' }}
                            value={storeSettings.adminPhone || ''} 
                            onChange={(e) => setStoreSettings({ ...storeSettings, adminPhone: e.target.value })}
                            placeholder="e.g. 9876543210"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: '#1C1C1C' }}>Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2.5 rounded-xl text-sm"
                            style={{ background: '#FAF7F2', border: '1px solid #E8E3DB', outline: 'none' }}
                            value={storeSettings.email || ''} 
                            onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                            placeholder="e.g. contact@bakerydelight.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: '#1C1C1C' }}>Store Address</label>
                        <textarea 
                            className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                            style={{ background: '#FAF7F2', border: '1px solid #E8E3DB', outline: 'none' }}
                            rows="2"
                            value={storeSettings.storeAddress || ''} 
                            onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                            placeholder="Enter store address"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: '#1C1C1C' }}>Working Hours</label>
                        <textarea 
                            className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                            style={{ background: '#FAF7F2', border: '1px solid #E8E3DB', outline: 'none' }}
                            rows="2"
                            value={storeSettings.workingHours || ''} 
                            onChange={(e) => setStoreSettings({ ...storeSettings, workingHours: e.target.value })}
                            placeholder="e.g. Monday - Sunday\n10:00 AM - 10:00 PM"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: '#1C1C1C' }}>Instagram Link</label>
                        <input 
                            type="url" 
                            className="w-full px-4 py-2.5 rounded-xl text-sm"
                            style={{ background: '#FAF7F2', border: '1px solid #E8E3DB', outline: 'none' }}
                            value={storeSettings.instagramLink || ''} 
                            onChange={(e) => setStoreSettings({ ...storeSettings, instagramLink: e.target.value })}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                </div>
                
                <button
                    onClick={onUpdateStore}
                    className="w-full py-3 text-white font-bold rounded-xl active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' }}
                >
                    Save Details
                </button>
            </div>

            {/* Homepage Badges — Collapsible */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: '#FFFFFF', border: '2px solid #E8E3DB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <button
                    onClick={() => setBadgesOpen(!badgesOpen)}
                    className="w-full p-5 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🏷️</span>
                        <div className="text-left">
                            <h3 className="font-bold" style={{ color: '#1C1C1C' }}>Homepage Badges</h3>
                            <p className="text-xs" style={{ color: '#A0998F' }}>Express Delivery, Eggless, Free Delivery pills</p>
                        </div>
                    </div>
                    {badgesOpen ? <FaChevronUp style={{ color: '#A0998F' }} /> : <FaChevronDown style={{ color: '#A0998F' }} />}
                </button>

                {badgesOpen && (
                    <div className="px-5 pb-5 space-y-4">
                        {badges.map((badge, i) => (
                            <div key={i} className="p-4 rounded-xl space-y-3"
                                style={{ background: '#FAF7F2', border: '1px solid #E8E3DB' }}>
                                <div className="flex items-center gap-3">
                                    {/* Emoji input */}
                                    <input
                                        type="text"
                                        maxLength={2}
                                        value={badge.icon}
                                        onChange={(e) => handleBadgeChange(i, 'icon', e.target.value)}
                                        className="w-12 h-10 text-center text-xl rounded-lg outline-none"
                                        style={{ background: '#FFFFFF', border: '1px solid #E8E3DB' }}
                                    />
                                    {/* Title */}
                                    <input
                                        type="text"
                                        value={badge.title}
                                        onChange={(e) => handleBadgeChange(i, 'title', e.target.value)}
                                        placeholder="Title"
                                        className="flex-1 px-3 py-2 rounded-lg text-sm font-medium outline-none"
                                        style={{ background: '#FFFFFF', border: '1px solid #E8E3DB', color: '#1C1C1C' }}
                                    />
                                    {/* Toggle */}
                                    <button
                                        onClick={() => handleBadgeChange(i, 'enabled', !badge.enabled)}
                                        className="text-2xl"
                                        style={{ color: badge.enabled ? '#16A34A' : '#A0998F' }}
                                    >
                                        {badge.enabled ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>
                                {/* Subtitle */}
                                <input
                                    type="text"
                                    value={badge.subtitle}
                                    onChange={(e) => handleBadgeChange(i, 'subtitle', e.target.value)}
                                    placeholder="Subtitle"
                                    className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                                    style={{ background: '#FFFFFF', border: '1px solid #E8E3DB', color: '#7E7E7E' }}
                                />
                            </div>
                        ))}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={saveBadges}
                                disabled={badgesSaving}
                                className="flex-1 py-3 text-white font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #C97B4B 0%, #E8956A 100%)', boxShadow: '0 4px 12px rgba(201,123,75,0.3)' }}
                            >
                                <FaSave size={12} /> {badgesSaving ? 'Saving...' : 'Save Badges'}
                            </button>
                            {badgesMsg && (
                                <span className="text-sm font-bold" style={{ color: badgesMsg.includes('✅') ? '#16A34A' : '#DC2626' }}>
                                    {badgesMsg}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delivery Info */}
            <div className="p-5 rounded-2xl"
                style={{ background: '#FFFFFF', border: '2px solid #E8E3DB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">🚚</span>
                    <h3 className="font-bold" style={{ color: '#1C1C1C' }}>Delivery Policy</h3>
                </div>
                <div className="p-4 rounded-xl" style={{ background: '#FEF3E2', border: '1px solid #E8E3DB' }}>
                    <p className="text-sm font-semibold" style={{ color: '#C97B4B' }}>₹30 flat delivery fee</p>
                    <p className="text-xs mt-1" style={{ color: '#8B7355' }}>We only serve in Bharatpur city. A flat ₹30 delivery charge is automatically applied to all delivery orders.</p>
                </div>
            </div>

            {/* Admin Password */}
            <div className="p-5 rounded-2xl opacity-50"
                style={{ background: '#FFFFFF', border: '2px solid #E8E3DB' }}>
                <div className="flex items-center gap-3">
                    <FaLock style={{ color: '#A0998F' }} />
                    <div>
                        <h3 className="font-bold" style={{ color: '#7E7E7E' }}>Admin Password</h3>
                        <p className="text-xs" style={{ color: '#A0998F' }}>Change password — coming soon</p>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* DANGER ZONE — Reset Orders & Stats */}
            {/* ═══════════════════════════════════════════ */}
            <div className="p-5 rounded-2xl"
                style={{ background: '#FFFFFF', border: '2px solid #FCA5A5', boxShadow: '0 2px 8px rgba(220,38,38,0.08)' }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: '#FEE2E2', color: '#DC2626' }}>
                        <FaExclamationTriangle />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold" style={{ color: '#DC2626' }}>Danger Zone</h3>
                        <p className="text-xs" style={{ color: '#A0998F' }}>Reset all orders & stats data to start fresh</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl mb-4"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#991B1B' }}>⚠️ This will permanently delete:</p>
                    <ul className="text-xs space-y-1 ml-4" style={{ color: '#991B1B', listStyle: 'disc' }}>
                        <li>All orders history</li>
                        <li>All customer ratings & reviews</li>
                        <li>Revenue & stats data</li>
                        <li>User activity logs</li>
                    </ul>
                    <p className="text-xs font-bold mt-3" style={{ color: '#16A34A' }}>✅ Menu items, categories, offers & settings will NOT be affected</p>
                </div>

                <button
                    onClick={() => { setShowResetModal(true); setResetStep(1); setResetConfirmText(''); setResetPassword(''); setResetError(''); }}
                    className="w-full py-3 font-bold rounded-xl active:scale-[0.98] transition-all"
                    style={{ background: '#FFFFFF', color: '#DC2626', border: '2px solid #DC2626' }}
                >
                    🗑️ Reset All Orders & Stats
                </button>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* RESET CONFIRMATION MODAL — Triple check */}
            {/* ═══════════════════════════════════════════ */}
            {showResetModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">

                        {/* Step 1: First Confirmation */}
                        {resetStep === 1 && (
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                                    style={{ background: '#FEE2E2' }}>
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: '#DC2626' }}>Are you sure?</h3>
                                <p className="text-sm mb-1" style={{ color: '#7E7E7E' }}>This will permanently erase:</p>
                                <div className="p-3 rounded-xl mb-4 text-left" style={{ background: '#FEF2F2' }}>
                                    <p className="text-xs font-semibold" style={{ color: '#991B1B' }}>• All orders • All ratings • Revenue data • Activity logs</p>
                                </div>
                                <p className="text-xs font-bold mb-4" style={{ color: '#16A34A' }}>
                                    ✅ Your menu items & settings are 100% safe
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowResetModal(false)}
                                        className="flex-1 py-3 font-bold rounded-xl"
                                        style={{ background: '#FAF7F2', color: '#7E7E7E', border: '2px solid #E8E3DB' }}>
                                        Cancel
                                    </button>
                                    <button onClick={() => setResetStep(2)}
                                        className="flex-1 py-3 font-bold rounded-xl text-white"
                                        style={{ background: '#DC2626', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
                                        Yes, Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Type RESET to confirm */}
                        {resetStep === 2 && (
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                                    style={{ background: '#FEF3C7' }}>
                                    <span className="text-3xl">✍️</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#1C1C1C' }}>Type <span style={{ color: '#DC2626', fontFamily: 'monospace' }}>RESET</span> to confirm</h3>
                                <p className="text-xs mb-4" style={{ color: '#7E7E7E' }}>This action cannot be undone</p>
                                <input
                                    type="text"
                                    value={resetConfirmText}
                                    onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
                                    placeholder="Type RESET here"
                                    className="w-full px-4 py-3 rounded-xl text-center text-lg font-bold mb-4 outline-none"
                                    style={{ background: '#FAF7F2', border: '2px solid #E8E3DB', color: '#1C1C1C', letterSpacing: 4 }}
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => { setResetStep(1); setResetConfirmText(''); }}
                                        className="flex-1 py-3 font-bold rounded-xl"
                                        style={{ background: '#FAF7F2', color: '#7E7E7E', border: '2px solid #E8E3DB' }}>
                                        Back
                                    </button>
                                    <button
                                        onClick={() => resetConfirmText === 'RESET' && setResetStep(3)}
                                        disabled={resetConfirmText !== 'RESET'}
                                        className="flex-1 py-3 font-bold rounded-xl text-white transition-all"
                                        style={{
                                            background: resetConfirmText === 'RESET' ? '#DC2626' : '#E8E3DB',
                                            boxShadow: resetConfirmText === 'RESET' ? '0 4px 12px rgba(220,38,38,0.3)' : 'none',
                                            cursor: resetConfirmText === 'RESET' ? 'pointer' : 'not-allowed'
                                        }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Enter Settings Password */}
                        {resetStep === 3 && (
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                                    style={{ background: '#FEE2E2' }}>
                                    <FaLock size={24} color="#DC2626" />
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#1C1C1C' }}>Enter Settings Password</h3>
                                <p className="text-xs mb-4" style={{ color: '#7E7E7E' }}>Final verification before reset</p>
                                <input
                                    type="password"
                                    value={resetPassword}
                                    onChange={(e) => { setResetPassword(e.target.value); setResetError(''); }}
                                    placeholder="Settings password"
                                    className="w-full px-4 py-3 rounded-xl text-center text-sm font-bold mb-2 outline-none"
                                    style={{ background: '#FAF7F2', border: `2px solid ${resetError ? '#DC2626' : '#E8E3DB'}`, color: '#1C1C1C' }}
                                    autoFocus
                                />
                                {resetError && (
                                    <p className="text-xs font-bold mb-2" style={{ color: '#DC2626' }}>{resetError}</p>
                                )}
                                <div className="flex gap-3 mt-3">
                                    <button onClick={() => { setResetStep(2); setResetPassword(''); setResetError(''); }}
                                        className="flex-1 py-3 font-bold rounded-xl"
                                        style={{ background: '#FAF7F2', color: '#7E7E7E', border: '2px solid #E8E3DB' }}>
                                        Back
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!resetPassword) { setResetError('Password required'); return; }
                                            setResetLoading(true);
                                            setResetError('');
                                            try {
                                                await onResetData(resetPassword);
                                                setShowResetModal(false);
                                                setResetStep(1);
                                                setResetPassword('');
                                                setResetConfirmText('');
                                            } catch (err) {
                                                setResetError(err.response?.data?.message || 'Reset failed');
                                            }
                                            setResetLoading(false);
                                        }}
                                        disabled={resetLoading || !resetPassword}
                                        className="flex-1 py-3 font-bold rounded-xl text-white transition-all active:scale-[0.98]"
                                        style={{
                                            background: resetPassword ? '#DC2626' : '#E8E3DB',
                                            boxShadow: resetPassword ? '0 4px 12px rgba(220,38,38,0.3)' : 'none',
                                            cursor: resetPassword ? 'pointer' : 'not-allowed'
                                        }}>
                                        {resetLoading ? '⏳ Resetting...' : '🗑️ Reset Now'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
