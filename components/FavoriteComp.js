import { Pressable, Image, StyleSheet, Text } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import starFalse from '../assets/star-false.png';
import starTrue from '../assets/star-true.png';

import { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../contexts/LocationContext';

function FavoriteComp() {
  const { location } = useContext(LocationContext);
  const [favorite, setFavorite] = useState([]);

  const getFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('favorites');
      if (jsonValue !== null) {
        setFavorite(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('error message: ', e);
    }
  };
  useEffect(() => {
    getFavorites();
  }, []);

  const saveFavorites = async () => {
    if (favorite.indexOf(location.name) !== -1) {
      try {
        const jsonValue = JSON.stringify(
          favorite.filter((city) => city !== location.name)
        );
        await AsyncStorage.setItem('favorites', jsonValue);
        setFavorite(favorite.filter((city) => city !== location.name));
      } catch (e) {
        console.error('Kunde inte spara favoriter', e);
      }
    } else {
      const jsonValue = JSON.stringify([...favorite, location.name]);
      await AsyncStorage.setItem('favorites', jsonValue);
      setFavorite([...favorite, location.name]);
    }
  };

  // }

  return (
    <Pressable onPress={saveFavorites}>
      <Image
        style={styles.starIcon}
        source={
          favorite.some((city) => city === location.name) ? starTrue : starFalse
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
