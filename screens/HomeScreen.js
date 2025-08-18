import SearchBar from '../components/SearchBar';
import SettingsButton from '../components/SettingsButton';

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
  ActivityIndicator,
  DrawerLayoutAndroid,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { LocationContext } from '../LocationContext';
import { TempUnitContext } from '../TempUnitContext';
import rain from '../assets/rain.jpg';
import mist from '../assets/mist.jpg';
import clear from '../assets/clear.jpg';
import clouds from '../assets/clouds.jpg';
import snow from '../assets/snow.jpg';
import thunderstorm from '../assets/thunderstorm.jpg';

import { useQuery } from '@tanstack/react-query';
// import { Button } from '@react-navigation/elements';

import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const { location } = useContext(LocationContext);
  const { tempUnit, setTempUnit } = useContext(TempUnitContext);

  // const [tempUnit, setTempUnit] = useState('celsius');

  // const drawer = useRef(null);

  // const [currentWeather, setCurrentWeather] = useState(null);
  // const [backImg, setBackImg] = useState(clear);

  const fetchCurrentWeather = async (location) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=34ec35da331d9646a7524278373c16a0`
    );

    await SplashScreen.hideAsync();

    return response.data;
  };

  const {
    data: currentWeather,
    isLoading,
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

  // useEffect(() => {
  //   if (currentWeather) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [currentWeather]);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const backImg = getBackImg(currentWeather.weather[0].main);

  const now = new Date();
  const currentTime = now.toLocaleTimeString();

  // if (tempUnit === 'celsius') {
  //   setMainTemp((currentWeather.main.temp - 273.15).toFixed(1) + '°');
  // } else {
  //   setMainTemp(currentWeather.main.temp.toFixed(1));
  // }

  let weatherData;
  if (currentWeather) {
    weatherData = [
      `${currentWeather.name}, ${currentWeather.sys.country}`,
      currentTime,
      currentWeather.weather[0].main,
      tempUnit === 'celsius'
        ? (currentWeather.main.temp - 273.15).toFixed(1) + 'C°'
        : (((currentWeather.main.temp - 273.15) * 9) / 5 + 32).toFixed(1) +
          'F°',
    ];
  }

  // useEffect(() => {
  //   async function getCurrentWeather() {
  //     try {
  //       const response = await axios.get(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=34ec35da331d9646a7524278373c16a0`
  //       );

  //       setCurrentWeather(response.data);
  //       switch (response.data.weather[0].main) {
  //         case 'Clear':
  //           setBackImg(clear);
  //           break;

  //         case 'Rain':
  //           setBackImg(rain);
  //           break;

  //         case 'Drizzle':
  //           setBackImg(rain);
  //           break;

  //         case 'Snow':
  //           setBackImg(snow);
  //           break;

  //         case 'Thunderstorm':
  //           setBackImg(thunderstorm);
  //           break;

  //         case 'Mist':
  //           setBackImg(mist);
  //           break;
  //         case 'Clouds':
  //           setBackImg(clouds);
  //           break;

  //         default:
  //           setBackImg(clear);
  //       }
  //       await SplashScreen.hideAsync();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getCurrentWeather();
  // }, [location]);

  // const navigationView = () => (
  //   <SafeAreaView>
  //     <Text>Profil</Text>
  //   </SafeAreaView>
  // );

  // const onPress = () =>
  //   ActionSheetIOS.showActionSheetWithOptions(
  //     {
  //       options: [
  //         'Cancel',

  //         tempUnit === 'celsius' ? 'Change to Fahrenheit' : 'Change to Celsius',
  //         // 'Reset',
  //       ],
  //       // destructiveButtonIndex: 1,
  //       cancelButtonIndex: 0,
  //       userInterfaceStyle: 'dark',
  //     },
  //     (buttonIndex) => {
  //       if (buttonIndex === 0) {
  //         // cancel action
  //       } else if (buttonIndex === 1) {
  //         setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  //       }
  //     }
  //   );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <DrawerLayoutAndroid
          ref={drawer}
          drawerWidth={300}
          drawerPosition="left"
          renderNavigationView={navigationView}
        > */}
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {currentWeather && (
                <ImageBackground
                  resizeMode="cover"
                  style={[
                    styles.image,
                    {
                      justifyContent: 'center',
                    },
                  ]}
                  source={backImg}
                >
                  <View
                    style={[
                      styles.container,
                      { justifyContent: 'space-around' },
                    ]}
                  >
                    <View style={{ gap: 10 }}>
                      {weatherData.map((data, index) => (
                        <Text key={index} style={styles.header}>
                          {data}
                        </Text>
                      ))}
                    </View>

                    {/* {Platform.OS === 'android' && (
                      <Button
                        title="Open drawer"
                        onPress={() => drawer.current.openDrawer()}
                      />
                    )} */}

                    <View style={styles.searchBar}>
                      <SearchBar />
                    </View>
                  </View>
                  {Platform.OS === 'ios' && <SettingsButton />}
                </ImageBackground>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* </DrawerLayoutAndroid> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    // padding: 20,
    flex: 1,
    // borderWidth: 2,
    justifyContent: 'flex-start',
    gap: 20,
    // justifyContent: 'space-evenly',
    // backgroundColor: 'none',
  },
  textContainer: {},
  header: {
    fontSize: 35,
    marginBottom: 5,
    color: '#fff',
    // borderWidth: 1,
  },
  searchBar: { marginBottom: 10 },
  searchButton: {
    borderWidth: 1,
    // borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    // paddingTop: 0,
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
  // textInput: {
  //   height: 40,
  //   borderColor: '#000000',
  //   borderWidth: 1,
  //   padding: 10,
  //   marginBottom: 5,
  // },
  image: { flex: 1, padding: 24 },
});
