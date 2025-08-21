import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { LocationContext } from '../contexts/LocationContext';

import starTrue from '../assets/star-true.png';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const { setLocation } = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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

  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#021d2cff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  if (error) return <Text>Error: {error.message}</Text>;

  async function goToFavorite(city) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      );

      if (response.data) {
        setLocation({
          name: response.data.results[0].name,
          lat: response.data.results[0].latitude,
          lon: response.data.results[0].longitude,
        });
        navigation.navigate('Home');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
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
