import {
  Image,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { LocationContext } from '../contexts/LocationContext';
import { FavoritesContext } from '../contexts/FavoritesContext';

import starTrueBlue from '../assets/star-true-blue.png';
import starFalse from '../assets/star-false.png';

function Favorites() {
  // const [favorites, setFavorites] = useState([]);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const [removedFavorites, setRemovedFavorites] = useState([]);
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
  }, []);

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

  const removeFavorite = async (item) => {
    console.log('pressed', item);
    try {
      const jsonValue = JSON.stringify(
        favorites.filter((city) => city !== item)
      );
      await AsyncStorage.setItem('favorites', jsonValue);
      setFavorites(favorites.filter((city) => city !== item));
      setRemovedFavorites([...removedFavorites, item]);
    } catch (e) {
      console.error('Kunde inte spara favoriter', e);
    }
  };

  const addFavorite = async (item) => {
    const jsonValue = JSON.stringify([...favorites, item]);
    await AsyncStorage.setItem('favorites', jsonValue);
    setFavorites([...favorites, item]);
    setRemovedFavorites(removedFavorites.filter((city) => city !== item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My favorites</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View style={styles.cityContainer}>
            <TouchableWithoutFeedback onPress={() => goToFavorite(item)}>
              <Text style={styles.cityText}>{item}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => removeFavorite(item)}>
              <Image style={styles.starImg} source={starTrueBlue} />
            </TouchableWithoutFeedback>
          </View>
        )}
        keyExtractor={(item) => item}
      />
      <Text style={styles.header}>Recent favorites</Text>
      <FlatList
        data={removedFavorites}
        renderItem={({ item }) => (
          <View style={styles.cityContainer}>
            <TouchableWithoutFeedback onPress={() => goToFavorite(item)}>
              <Text style={styles.cityText}>{item}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => addFavorite(item)}>
              <Image style={styles.starImg} source={starFalse} />
            </TouchableWithoutFeedback>
          </View>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021d2cff',
    padding: 10,
  },
  header: {
    color: 'white',
    fontSize: 24,
    borderBottomWidth: 1,
    borderColor: '#6183a3ff',
    paddingBottom: 5,
    marginBottom: 5,
  },
  cityText: {
    fontSize: 18,
    color: 'white',
  },
  cityContainer: {
    // borderWidth: 1,
    borderBottomWidth: 1,
    // borderTopWidth: 1,
    borderColor: '#6183a3ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 5,
  },
  starImg: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
});
