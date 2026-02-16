import React, { createContext, useState, useContext, useEffect } from "react";

const FavoritesContext = createContext();

// Helper to safely parse JSON from localStorage
const getStoredFavorites = () => {
  try {
    const stored = localStorage.getItem("sewashubham_favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }) => {
  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState(() => getStoredFavorites());

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("sewashubham_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage:", e);
    }
  }, [favorites]);

  const addFavorite = (product) => {
    setFavorites((prev) => {
      // Avoid duplicates
      if (prev.some((item) => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((item) => item._id !== productId));
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item._id === productId);
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product._id)) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem("sewashubham_favorites");
    } catch (e) {
      console.error("Failed to clear favorites from localStorage:", e);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
