import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, Award, Users, Cake, Star, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATS = [
  { icon: Clock, value: '15+', label: 'Years Experience' },
  { icon: Users, value: '10K+', label: 'Happy Customers' },
  { icon: Award, value: '50+', label: 'Award Winning' },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[hsl(var(--secondary))] via-white to-[hsl(var(--secondary))]">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -right-20 w-96 h-96 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-[hsl(var(--color-amber-500))]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-32 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Artisan Baked with Love
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-[var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[hsl(var(--foreground))] leading-tight mb-6"
            >
              Discover the Art of{' '}
              <span className="text-[hsl(var(--primary))] relative">
                Baking
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-[var(--font-body)] text-lg lg:text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-xl mx-auto lg:mx-0"
            >
              From traditional recipes to modern creations, every bite tells a story of passion, quality ingredients, and generations of baking expertise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="xl" asChild className="group">
                <Link to="/menu">
                  Explore Menu
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image / Decorative */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--color-amber-500))]/20 rounded-full animate-pulse" />
              <div className="absolute inset-8 bg-gradient-to-br from-[hsl(var(--primary))]/30 to-[hsl(var(--color-amber-500))]/30 rounded-full" />
              <div className="absolute inset-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <Cake className="w-24 h-24 text-[hsl(var(--primary))]" strokeWidth={1} />
              </div>
              
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-0 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2"
              >
                <Coffee className="w-6 h-6 text-amber-600" />
                <span className="font-medium text-sm">Fresh Daily</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 left-0 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2"
              >
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span className="font-medium text-sm">5 Star Rated</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 lg:mt-24 grid grid-cols-3 gap-4 lg:gap-8 max-w-3xl mx-auto"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center p-4 lg:p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[hsl(var(--border))]"
            >
              <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 text-[hsl(var(--primary))] mx-auto mb-2" />
              <div className="font-[var(--font-heading)] text-2xl lg:text-3xl font-bold text-[hsl(var(--foreground))]">
                {stat.value}
              </div>
              <div className="font-[var(--font-body)] text-xs lg:text-sm text-[hsl(var(--muted-foreground))]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
