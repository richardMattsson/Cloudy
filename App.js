import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  TextInput,
  Platform,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  Image,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
// import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

SplashScreen.preventAutoHideAsync();

function HomeScreen() {
  const [city, setCity] = useState('');

  const [lat, setLat] = useState('57.707');
  const [lon, setLon] = useState('11.967');

  const [currentWeather, setCurrentWeather] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    async function getCurrentWeather(lat, lon) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=34ec35da331d9646a7524278373c16a0`
        );

        setCurrentWeather(response.data);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error(error);
      }
    }
    getCurrentWeather(lat, lon);
  }, [lat, lon]);

  async function locationSearch(cityName) {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      console.log(response.data);

      if (response.data) {
        setLat(response.data.results[0].latitude);
        setLon(response.data.results[0].longitude);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {currentWeather && (
            <>
              <Text style={styles.header}>
                {currentWeather.name}, {currentWeather.sys.country}
              </Text>
              <Text style={styles.header}>
                {currentWeather.weather[0].main}
              </Text>
              <Text style={styles.header}>
                {(currentWeather.main.temp - 273.15).toFixed(1) + '°'}
              </Text>
              <Image
                style={styles.image}
                source={{
                  uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
                }}
              />
            </>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="City"
            onChangeText={setCity}
            value={city}
            onSubmitEditing={() => locationSearch(city)}
          />
          <Button
            onPress={() => {
              locationSearch(city);
            }}
            title="Search"
          ></Button>
          <StatusBar style="auto" />
          <Button
            title="5-day forecast"
            onPress={() => navigation.navigate('FiveDayForecast')}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
 
  );
}
function FiveDayForecast() {
  return (
    <>
      <View>
        <Text>Hej</Text>
      </View>
    </>
  );
}
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerStyle: { backgroundColor: 'lightblue' },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Current weather',
      },
    },
    FiveDayForecast: {
      screen: FiveDayForecast,
      options: {
        title: '5-day forecast',
      },
    },
  },
});
const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;

  // const [city, setCity] = useState('');

  // const [lat, setLat] = useState('57.707');
  // const [lon, setLon] = useState('11.967');

  // const [currentWeather, setCurrentWeather] = useState(null);

  // useEffect(() => {
  //   async function getCurrentWeather(lat, lon) {
  //     try {
  //       const response = await axios.get(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=34ec35da331d9646a7524278373c16a0`
  //       );

  //       setCurrentWeather(response.data);
  //       await SplashScreen.hideAsync();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getCurrentWeather(lat, lon);
  // }, [lat, lon]);

  // async function locationSearch(cityName) {
  //   try {
  //     const response = await axios.get(
  //       `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
  //     );
  //     console.log(response.data);

  //     if (response.data) {
  //       setLat(response.data.results[0].latitude);
  //       setLon(response.data.results[0].longitude);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // return (
  //   <KeyboardAvoidingView
  //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  //     style={styles.container}
  //   >
  //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  //       <View style={styles.inner}>
  //         {currentWeather && (
  //           <>
  //             <Text style={styles.header}>
  //               {currentWeather.name}, {currentWeather.sys.country}
  //             </Text>
  //             <Text style={styles.header}>
  //               {currentWeather.weather[0].main}
  //             </Text>
  //             <Text style={styles.header}>
  //               {(currentWeather.main.temp - 273.15).toFixed(1) + '°'}
  //             </Text>
  //             <Image
  //               style={styles.image}
  //               source={{
  //                 uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
  //               }}
  //             />
  //           </>
  //         )}
  //         <TextInput
  //           style={styles.textInput}
  //           placeholder="City"
  //           onChangeText={setCity}
  //           value={city}
  //           onSubmitEditing={() => locationSearch(city)}
  //         />
  //         <Button
  //           onPress={() => {
  //             locationSearch(city);
  //           }}
  //           title="Search"
  //         ></Button>
  //         <StatusBar style="auto" />
  //       </View>
  //     </TouchableWithoutFeedback>
  //   </KeyboardAvoidingView>
  //   // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //   //   <Text>Home Screen</Text>
  //   // </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 15,
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
  },
});
