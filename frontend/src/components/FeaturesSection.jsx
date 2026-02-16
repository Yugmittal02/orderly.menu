import React from 'react';
import { motion } from 'framer-motion';
import { Award, Truck, Sparkles, Clock, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Award,
    title: 'Artisan Quality',
    description: 'Every product is handcrafted by skilled bakers using traditional recipes passed down through generations.',
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Baked fresh daily and delivered to your doorstep within hours, ensuring maximum freshness.',
  },
  {
    icon: Sparkles,
    title: 'Custom Designs',
    description: 'Create your dream cake with our custom design service. Personal consultations available.',
  },
];

const TRUST_BADGES = [
  { icon: Clock, label: 'Same Day Delivery' },
  { icon: Shield, label: '100% Fresh Guarantee' },
  { icon: Heart, label: 'Made with Love' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[hsl(var(--secondary))] to-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block font-[var(--font-body)] text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-4">
            The SewaShubham Promise
          </h2>
          <p className="font-[var(--font-body)] text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            We're committed to bringing you the finest baked goods with uncompromising quality and service.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16"
        >
          {FEATURES.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full border-2 border-transparent hover:border-[hsl(var(--primary))]/20 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 lg:p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--color-amber-500))] flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[hsl(var(--foreground))] mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-[var(--font-body)] text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 lg:gap-12"
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]"
            >
              <badge.icon className="w-5 h-5 text-[hsl(var(--primary))]" />
              <span className="font-[var(--font-body)] text-sm font-medium">
                {badge.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
