import SearchBar from '../components/SearchBar';
import KeyboardAvoidingViewComp from '../components/KeyboardAvoidingComp';

import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import 'moment/src/locale/en-gb';

import { useQuery } from '@tanstack/react-query';

import { useContext } from 'react';
import { LocationContext } from '../contexts/LocationContext';
import { TempUnitContext } from '../contexts/TempUnitContext';

import rain from '../assets/rain.jpg';
import mist from '../assets/mist.jpg';
import clear from '../assets/clear.jpg';
import clouds from '../assets/clouds.jpg';
import snow from '../assets/snow.jpg';
import thunderstorm from '../assets/thunderstorm.jpg';

import * as SplashScreen from 'expo-splash-screen';

export default function HomeScreen() {
  const { location } = useContext(LocationContext);
  const { tempUnit } = useContext(TempUnitContext);

  const fetchCurrentWeather = async (location) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=34ec35da331d9646a7524278373c16a0`
    );

    await SplashScreen.hideAsync();
    return response.data;
  };

  const {
    data: currentWeather,
    isPending,
    error,
  } = useQuery({
    queryKey: ['currentWeather', location],
    queryFn: () => fetchCurrentWeather(location),
    enabled: !!location,
  });

  const getBackImg = (weather) => {
    switch (weather) {
      case 'Clear':
        return clear;
      case 'Rain':
      case 'Drizzle':
        return rain;
      case 'Snow':
        return snow;
      case 'Thunderstorm':
        return thunderstorm;
      case 'Mist':
        return mist;
      case 'Clouds':
        return clouds;
      default:
        return clear;
    }
  };
  const now = new Date();
  const currentTime = now.toLocaleTimeString();

  // const currentTime = moment().format('LT');

  if (isPending)
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

  const backImg = getBackImg(currentWeather.weather[0].main);

  let weatherData;
  if (currentWeather) {
    weatherData = [
      `${location.name}, ${currentWeather.sys.country}`,
      Platform.OS === 'android'
        ? `${Number(currentTime.split(':')[0]) + 2}:${
            currentTime.split(':')[1]
          }`
        : `${currentTime.split(':')[0]}:${currentTime.split(':')[1]}`,
      currentWeather.weather[0].main,
      tempUnit === 'celsius'
        ? (currentWeather.main.temp - 273.15).toFixed(1) + ' C°'
        : (((currentWeather.main.temp - 273.15) * 9) / 5 + 32).toFixed(1) +
          ' F°',
    ];
  }

  return (
    <KeyboardAvoidingViewComp>
      <View style={styles.container}>
        {currentWeather && (
          <ImageBackground
            resizeMode="cover"
            style={styles.image}
            source={backImg}
          >
            <View
              style={[
                styles.container,
                {
                  justifyContent: 'space-evenly',
                  marginBottom: 100,
                },
              ]}
            >
              <StatusBar style="light" />
              <View style={{ gap: 10 }}>
                {weatherData.map((data, index) => (
                  <Text key={index} style={styles.header}>
                    {data}
                  </Text>
                ))}
              </View>

              <View style={styles.searchBar}>
                <SearchBar />
              </View>
            </View>
          </ImageBackground>
        )}
      </View>
    </KeyboardAvoidingViewComp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 20,
  },
  textContainer: {},
  fastBackGroundImage: { width: '100%', height: '100%', position: 'absolute' },
  header: {
    fontSize: 35,
    marginBottom: 5,
    color: '#fff',
  },
  searchBar: { marginBottom: 10 },
  searchButton: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: '50%',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
  },
  textSearchButton: {
    color: 'black',
    fontSize: 16,
  },
  containerSettingBtn: {
    alignItems: 'center',
  },
  settingBtn: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '30%',
  },
  image: { flex: 1, padding: 24 },
});
