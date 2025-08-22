import { createContext, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [recentFavorites, setRecentFavorites] = useState([]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, setFavorites, recentFavorites, setRecentFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
