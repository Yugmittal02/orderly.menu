import React, { useState, useEffect } from 'react';

// Help detect iOS devices
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// Help detect if already running as PWA
const isInStandaloneMode = () =>
  ('standalone' in window.navigator && window.navigator.standalone) ||
  window.matchMedia('(display-mode: standalone)').matches;

/**
 * PWA Install Banner — shows a beautiful floating banner on the customer website
 * prompting users to install the SewaShubham Bakery app on their phone.
 * Supports standard browsers (Android/Chrome) and iOS Safari.
 */
const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // iOS specific state
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Only show on admin pages
    if (!window.location.pathname.startsWith('/admin')) return;

    // Check if user already dismissed this session
    const wasDismissed = sessionStorage.getItem('pwa_admin_install_dismissed');
    if (wasDismissed) return;

    // Handle standard platforms (Android, Chrome, Edge)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delay showing for better UX
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Handle iOS (no native install event exists, so we manually prompt)
    if (isIos() && !isInStandaloneMode()) {
      setIsIosDevice(true);
      setTimeout(() => setShowBanner(true), 3000);
    }

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleAction = async () => {
    if (isIosDevice) {
      // Toggle the step-by-step iOS instructions
      setShowIosInstructions(true);
      return;
    }

    // Android / Chrome standard flow
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    sessionStorage.setItem('pwa_admin_install_dismissed', '1');
  };

  if (!showBanner || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80, // Above bottom nav
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 32px)',
        maxWidth: 400,
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
        borderRadius: 20,
        padding: '16px 20px',
        boxShadow: '0 12px 40px rgba(249,115,22,0.25), 0 0 0 1px rgba(249,115,22,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.5s ease-out',
      }}
    >
      {!showIosInstructions ? (
        // Standard Banner Layout
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
            }}
          >
            <span style={{ fontSize: 22 }}>🛡️</span>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: '#1C1C1C', margin: 0, lineHeight: 1.3 }}>
              Install Admin Panel
            </p>
            <p style={{ fontSize: 11, color: '#7E7E7E', margin: '2px 0 0', lineHeight: 1.3 }}>
              Manage orders & store settings
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
            <button
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: '#A0998F',
                fontSize: 18,
                cursor: 'pointer',
                padding: 4,
                lineHeight: 1,
              }}
              aria-label="Dismiss install prompt"
            >
              ✕
            </button>
            <button
              onClick={handleAction}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              Install
            </button>
          </div>
        </div>
      ) : (
        // iOS Step-by-Step Instructions
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontWeight: 800, fontSize: 15, color: '#1C1C1C', margin: 0 }}>
              Install Admin App on iOS
            </p>
            <button
              onClick={handleDismiss}
              style={{ background: 'none', border: 'none', color: '#A0998F', fontSize: 18, cursor: 'pointer', padding: 0 }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 1.5, background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #F1E5D5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ background: '#f97316', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>1</span>
              <span>Tap the <strong>Share</strong> button <svg style={{display:'inline', verticalAlign:'middle', marginBottom:2}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: '#f97316', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>2</span>
              <span>Scroll down and select <strong>Add to Home Screen</strong> <svg style={{display:'inline', verticalAlign:'middle', marginBottom:2}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></span>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 2s infinite' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(5px); }
          60% { transform: translateY(3px); }
        }
      `}</style>
    </div>
  );
};

export default PWAInstallBanner;
