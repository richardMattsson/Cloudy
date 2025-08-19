import SearchBar from '../components/SearchBar';
import KeyboardAvoidingViewComp from '../components/KeyboardAvoidingComp';

import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

import { useContext } from 'react';
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

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const backImg = getBackImg(currentWeather.weather[0].main);

  const now = new Date();
  const currentTime = now.toLocaleTimeString();

  let weatherData;
  if (currentWeather) {
    weatherData = [
      `${currentWeather.name}, ${currentWeather.sys.country}`,
      currentTime,
      currentWeather.weather[0].main,
      tempUnit === 'celsius'
        ? (currentWeather.main.temp - 273.15).toFixed(1) + ' C°'
        : (((currentWeather.main.temp - 273.15) * 9) / 5 + 32).toFixed(1) +
          ' F°',
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
    <KeyboardAvoidingViewComp>
      <View style={styles.container}>
        <StatusBar style="light" />
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
              style={[styles.container, { justifyContent: 'space-around' }]}
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
            {/* {Platform.OS === 'ios' && <SettingsButton />} */}
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
