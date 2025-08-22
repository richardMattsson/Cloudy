import { Pressable, Image, StyleSheet, Text } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import starFalse from '../assets/star-false.png';
import starTrue from '../assets/star-true.png';
import starTrueBlue from '../assets/star-true-blue.png';

import { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../contexts/LocationContext';
import { FavoritesContext } from '../contexts/FavoritesContext';

function FavoriteComp() {
  const { location } = useContext(LocationContext);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const { recentFavorites, setRecentFavorites } = useContext(FavoritesContext);
  // const [favorite, setFavorite] = useState([]);

  const getFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('favorites');
      if (jsonValue !== null) {
        setFavorites(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('error message: ', e);
    }
  };
  useEffect(() => {
    getFavorites();
  }, []);

  const saveFavorites = async () => {
    if (favorites.indexOf(location.name) !== -1) {
      try {
        const jsonValue = JSON.stringify(
          favorites.filter((city) => city !== location.name)
        );
        await AsyncStorage.setItem('favorites', jsonValue);
        setFavorites(favorites.filter((city) => city !== location.name));

        const jsonValue2 = JSON.stringify([...recentFavorites, location.name]);
        await AsyncStorage.setItem('recentFavorites', jsonValue2);
        setRecentFavorites([...recentFavorites, location.name]);
      } catch (e) {
        console.error('Kunde inte spara favoriter', e);
      }
    } else {
      try {
        const jsonValue = JSON.stringify([...favorites, location.name]);
        await AsyncStorage.setItem('favorites', jsonValue);
        setFavorites([...favorites, location.name]);

        const jsonValue2 = JSON.stringify(
          recentFavorites.filter((city) => city !== location.name)
        );
        await AsyncStorage.setItem('recentFavorites', jsonValue2);
        setRecentFavorites(
          recentFavorites.filter((city) => city !== location.name)
        );
      } catch (e) {
        console.error('Kunde inte spara favoriter', e);
      }
    }
  };

  // }

  return (
    <Pressable onPress={saveFavorites}>
      <Image
        style={styles.starIcon}
        source={
          favorites.some((city) => city === location.name)
            ? starTrueBlue
            : starFalse
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  starIcon: {
    width: 40,
    height: 40,
    marginLeft: 15,
  },
});

export default FavoriteComp;
