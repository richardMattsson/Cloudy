import { useContext, useState } from 'react';
import { StyleSheet, TextInput, Button, View } from 'react-native';
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="City"
        onChangeText={setCity}
        value={city}
        onSubmitEditing={() => locationSearch(city)}
      />
      <Button
        style={styles.button}
        onPress={() => {
          locationSearch(city);
        }}
        title="Search"
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 20,
  },

  textInput: {
    flexGrow: 1,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    // marginBottom: 5,
    backgroundColor: '#fff',
    // borderRadius: 10,
  },
});
