import { useContext, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { LocationContext } from '../contexts/LocationContext';

import axios from 'axios';

export default function SearchBar({ cityName }) {
  const [city, setCity] = useState('');
  const { setLocation } = useContext(LocationContext);

  useEffect(() => {
    if (cityName) {
      locationSearch(cityName);
    }
    cityName = '';
  }, [cityName]);

  async function locationSearch(cityName) {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );

      if (response.data) {
        setLocation({
          name: response.data.results[0].name,
          lat: response.data.results[0].latitude,
          lon: response.data.results[0].longitude,
        });
        setCity('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  function CustomButton() {
    return (
      <>
        <Pressable
          onPress={() => {
            locationSearch(city);
          }}
          style={styles.searchButton}
        >
          <Text style={styles.textSearchButton}>Sök</Text>
        </Pressable>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Stad"
        placeholderTextColor="#000"
        onChangeText={setCity}
        value={city}
        onSubmitEditing={() => locationSearch(city)}
      />
      <CustomButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 20,
  },

  searchButton: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
  },
  textSearchButton: {
    color: 'black',
    fontSize: 16,
  },

  textInput: {
    flexGrow: 1,
    height: 40,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#ffffffff',
  },
});
