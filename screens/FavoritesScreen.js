import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { LocationContext } from '../contexts/LocationContext';

import starTrue from '../assets/star-true.png';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const { setLocation } = useContext(LocationContext);

  const navigation = useNavigation();

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
  });

  function goToFavorite(city) {
    // setLocation(city);
    // console.log(city);
    navigation.navigate('Home', { cityName: city });
  }

  return (
    <View style={styles.container}>
      {favorites.map((city) => (
        <View key={city} style={styles.cityContainer}>
          <Text style={{ color: 'white' }}>{city}</Text>
          <Pressable onPress={() => goToFavorite(city)}>
            <Image style={styles.starImg} source={starTrue} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021d2cff',
  },
  cityContainer: {
    borderWidth: 1,
    borderColor: 'white',
  },
  starImg: {
    width: 50,
    height: 50,
  },
});
