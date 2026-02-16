import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />

      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="font-[var(--font-heading)] text-2xl lg:text-3xl font-bold text-[hsl(var(--foreground))]">
                  My Favorites
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {favorites.length} item{favorites.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>
          </motion.div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Card className="max-w-md mx-auto border-dashed">
                <CardContent className="p-10">
                  <div className="w-20 h-20 bg-[hsl(var(--secondary))] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] mb-6">
                    Tap the heart icon on items you love to save them here
                  </p>
                  <Button onClick={() => navigate("/home")} className="rounded-xl">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Menu
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {favorites.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
