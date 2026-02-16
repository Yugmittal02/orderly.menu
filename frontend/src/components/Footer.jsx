import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa';

const Footer = memo(() => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <footer className="bakery-footer">
            {/* Brand */}
            <div className="footer-logo">
                <h3>Sewa Shubham</h3>
                <p>Fresh bakes & sweet memories since 2002</p>
            </div>

            {/* Links */}
            <div className="footer-links">
                <Link to="/menu">Menu</Link>
                <Link to="/favorites">Favorites</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/privacy-policy">Privacy</Link>
                <Link to="/refund-policy">Refunds</Link>
                <Link to="/shipping-policy">Shipping</Link>
                <Link to="/terms-conditions">Terms</Link>
            </div>

            {/* Social */}
            <div className="footer-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram size={18} />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <FaWhatsapp size={18} />
                </a>
                <a href="tel:+91" aria-label="Phone">
                    <FaPhoneAlt size={16} />
                </a>
                <a href="mailto:hello@sewashubham.com" aria-label="Email">
                    <FaEnvelope size={16} />
                </a>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <p>© {currentYear} Sewa Shubham Bakery. Made with <FaHeart style={{ display: 'inline', color: '#E57373', verticalAlign: 'middle', margin: '0 3px' }} size={11} /> in India</p>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
export default Footer;
