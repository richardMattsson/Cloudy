import SearchBar from '../components/SearchBar';

import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LocationContext } from '../LocationContext';
import rain from '../assets/rain.jpg';
import mist from '../assets/mist.jpg';
import clear from '../assets/clear.jpg';
import clouds from '../assets/clouds.jpg';
import snow from '../assets/snow.jpg';
import thunderstorm from '../assets/thunderstorm.jpg';

export default function HomeScreen() {
  const { location } = useContext(LocationContext);

  const [currentWeather, setCurrentWeather] = useState(null);

  const [backImg, setBackImg] = useState(clear);

  const now = new Date();
  const currentTime = now.toLocaleTimeString();

  let weatherData;

  if (currentWeather) {
    weatherData = [
      `${currentWeather.name}, ${currentWeather.sys.country}`,
      currentTime,
      currentWeather.weather[0].main,
      `${(currentWeather.main.temp - 273.15).toFixed(1)}°`,
    ];
  }

  useEffect(() => {
    async function getCurrentWeather() {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=34ec35da331d9646a7524278373c16a0`
        );

        setCurrentWeather(response.data);
        switch (response.data.weather[0].main) {
          case 'Clear':
            setBackImg(clear);
            break;

          case 'Rain':
            setBackImg(rain);
            break;

          case 'Drizzle':
            setBackImg(rain);
            break;

          case 'Snow':
            setBackImg(snow);
            break;

          case 'Thunderstorm':
            setBackImg(thunderstorm);
            break;

          case 'Mist':
            setBackImg(mist);
            break;
          case 'Clouds':
            setBackImg(clouds);
            break;

          default:
            setBackImg(clear);
        }
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error(error);
      }
    }
    getCurrentWeather();
  }, [location]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {currentWeather && (
            <ImageBackground
              resizeMode="cover"
              style={styles.image}
              source={backImg}
            >
              <View style={styles.inner}>
                {weatherData.map((data, index) => (
                  <Text key={index} style={styles.header}>
                    {data}
                  </Text>
                ))}
              </View>
            </ImageBackground>
          )}

          <View style={styles.searchBar}>
            <SearchBar />
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    padding: 20,
    flex: 1,
    // borderWidth: 2,
    justifyContent: 'space-evenly',
    // backgroundColor: 'none',
  },

  header: {
    fontSize: 35,
    marginBottom: 5,
    color: '#fff',
  },
  searchBar: { margin: 40 },

  textInput: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  image: { flex: 1 },
});
