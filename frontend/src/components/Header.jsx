import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { getItemCount } = useCart();
    const { customer } = useAuth();
    const navigate = useNavigate();
    const itemCount = getItemCount();
    const [scrolled, setScrolled] = useState(false);

    // Scroll-aware shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get user initials for avatar
    const getInitials = () => {
        if (!customer?.name) return null;
        const parts = customer.name.trim().split(' ');
        return parts.length > 1 
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50">
            <div className={`bakery-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-container">

                    {/* User Button */}
                    <button
                        className="header-icon-btn"
                        onClick={() => navigate(customer ? '/dashboard' : '/login')}
                        aria-label={customer ? 'Dashboard' : 'Login'}
                    >
                        {customer && getInitials() ? (
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#D4700A',
                            }}>
                                {getInitials()}
                            </span>
                        ) : (
                            <FaUser size={16} />
                        )}
                    </button>

                    {/* Logo */}
                    <div className="header-logo" onClick={() => navigate('/menu')}>
                        <h1 className="bakery-logo">Sewa Shubham</h1>
                    </div>

                    {/* Cart Button */}
                    <button
                        className="cart-header-btn"
                        onClick={() => navigate('/cart')}
                        aria-label="Cart"
                    >
                        <FaShoppingCart size={18} />
                        {itemCount > 0 && (
                            <span className="cart-badge">{itemCount}</span>
                        )}
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Header;
