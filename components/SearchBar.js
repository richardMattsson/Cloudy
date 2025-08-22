import { useContext, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Alert,
  Modal,
} from 'react-native';

import { LocationContext } from '../contexts/LocationContext';
import axios from 'axios';

export default function SearchBar() {
  const [city, setCity] = useState('');
  const { setLocation } = useContext(LocationContext);
  const [modalVisible, setModalVisible] = useState(false);

  async function locationSearch(cityName) {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName.trim()}&count=1&language=sv&format=json`
      );

      if (response.data.results === undefined) {
        setModalVisible(true);
      } else {
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textStyle}>
              <Text>Något gick fel med sökningen.</Text>
              <Text> Vänligen försök igen.</Text>
            </Text>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Okej</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#021d2cff',
    borderRadius: 20,
    padding: 35,
    width: 300,
    alignItems: 'center',
    gap: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    width: 100,
    borderWidth: 2,
    borderColor: 'red',
  },
});
