import { useContext, useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { LocationContext } from '../LocationContext';

import axios from 'axios';

export default function SearchBar() {
  const [city, setCity] = useState('');
  const { setLocation } = useContext(LocationContext);

  async function locationSearch(cityName) {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );

      if (response.data) {
        setLocation([
          response.data.results[0].latitude,
          response.data.results[0].longitude,
        ]);
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
        placeholder="Sök Stad"
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
    // borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    // paddingTop: 0,
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
    // borderColor: '#000000',
    // borderWidth: 1,
    fontSize: 16,
    padding: 10,
    // marginBottom: 5,
    backgroundColor: '#ffffffff',

    // borderRadius: 10,
  },
});
