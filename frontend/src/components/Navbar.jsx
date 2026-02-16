import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Heart, Cake, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const cartItemsCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[hsl(var(--border))]"
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--color-amber-500))] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Cake className="w-5 h-5 text-white" />
            </div>
            <span className="font-[var(--font-heading)] text-xl lg:text-2xl font-bold text-[hsl(var(--foreground))]">
              Sewa<span className="text-[hsl(var(--primary))]">Shubham</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-[var(--font-body)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[hsl(var(--primary))] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/favorites')}>
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {customer ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                {customer.name?.split(' ')[0] || 'Profile'}
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Cake className="w-6 h-6 text-[hsl(var(--primary))]" />
                    SewaShubham
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors font-[var(--font-body)] text-lg"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-[hsl(var(--border))] my-4" />
                  {customer ? (
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                  ) : (
                    <Button className="w-full" onClick={() => { setIsOpen(false); navigate('/login'); }}>
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
