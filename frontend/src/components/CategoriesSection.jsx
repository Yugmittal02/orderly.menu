import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Categories matching the menu page - with image URLs
const CATEGORIES = [
  {
    id: 'cakes',
    name: 'Cakes',
    description: 'Birthday, Wedding & Custom',
    filterValue: 'Cakes',
    color: 'from-orange-500 to-amber-500',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
  },
  {
    id: 'pastries',
    name: 'Pastries',
    description: 'Croissants, Danish & More',
    filterValue: 'Pastries',
    color: 'from-amber-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
  },
  {
    id: 'fast-food',
    name: 'Fast Food',
    description: 'Pizza, Burgers & Snacks',
    filterValue: 'Fast Food',
    color: 'from-red-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Cold Coffee & Shakes',
    filterValue: 'Cold Coffee and Shakes',
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
  },
  {
    id: 'flowers',
    name: 'Flowers',
    description: 'Fresh Bouquets & Arrangements',
    filterValue: 'Flowers',
    color: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CategoriesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block font-[var(--font-body)] text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider mb-4">
            What We Offer
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-4">
            Explore Our Categories
          </h2>
          <p className="font-[var(--font-body)] text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            From classic favorites to artisan creations, discover our handcrafted selection made fresh daily.
          </p>
        </motion.div>

        {/* Categories Grid - 5 items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6"
        >
          {CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link to={`/home?category=${category.id}`}>
                <Card className="group h-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-[hsl(var(--primary))] transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Category Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-40 group-hover:opacity-30 transition-opacity`} />
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white text-center">
                        <h3 className="font-[var(--font-heading)] text-lg lg:text-xl font-bold drop-shadow-lg">
                          {category.name}
                        </h3>
                        <p className="font-[var(--font-body)] text-xs text-white/80 drop-shadow">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/home"
            className="inline-flex items-center gap-2 font-[var(--font-body)] text-[hsl(var(--primary))] font-medium hover:underline"
          >
            View Full Menu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
