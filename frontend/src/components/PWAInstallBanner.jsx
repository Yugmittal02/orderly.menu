import React, { useState, useEffect } from 'react';

/**
 * PWA Install Banner — shows a beautiful floating banner on the customer website
 * prompting users to install the SewaShubham Bakery app on their phone.
 * Only appears when the browser fires beforeinstallprompt (i.e., PWA is installable).
 */
const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show on admin pages
    if (window.location.pathname.startsWith('/admin')) return;

    // Check if user already dismissed this session
    const wasDismissed = sessionStorage.getItem('pwa_install_dismissed');
    if (wasDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delay showing for better UX — don't interrupt initial page load
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
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
    sessionStorage.setItem('pwa_install_dismissed', '1');
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
        alignItems: 'center',
        gap: 14,
        animation: 'slideUp 0.5s ease-out',
      }}
    >
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
        <span style={{ fontSize: 24 }}>🍰</span>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 800, fontSize: 14, color: '#1C1C1C', margin: 0, lineHeight: 1.3 }}>
          Install SewaShubham App
        </p>
        <p style={{ fontSize: 11, color: '#7E7E7E', margin: '2px 0 0', lineHeight: 1.3 }}>
          Quick access to menu & orders
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
          onClick={handleInstall}
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

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PWAInstallBanner;
