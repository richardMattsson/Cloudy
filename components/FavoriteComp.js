import { Pressable, Image, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import starFalse from '../assets/star-false.png';
import starTrue from '../assets/star-true.png';

import { useContext } from 'react';
import { LocationContext } from '../LocationContext';
import { FavoriteContext } from '../FavoriteContext';

function FavoriteComp() {
  const { location } = useContext(LocationContext);
  const { favorite, setFavorite } = useContext(FavoriteContext);

  const onPress = async () => {
    // indexOf

    if (favorite.some((city) => city === location.name)) {
      setFavorite(favorite.filter((city) => city !== location.name));
    } else {
      setFavorite([...favorite, location.name]);
    }

    // console.log(location);
    // console.log('favorite', favorite);

    try {
      const jsonValue = JSON.stringify(favorite);
      await AsyncStorage.setItem('favorites', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  return (
    <Pressable onPress={onPress}>
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
  },
});

export default FavoriteComp;
