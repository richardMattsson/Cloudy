import HomeScreen from './screens/HomeScreen';
import FiveDayForecast from './screens/FiveDayForecastScreen';

import * as SplashScreen from 'expo-splash-screen';

import { createStaticNavigation } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import calendar from './assets/calendar.png';
import sunBlack from './assets/sunBlack.png';

import { LocationProvider } from './LocationContext';

SplashScreen.preventAutoHideAsync();

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Current',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={sunBlack}
            // tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    FiveDayForecast: {
      screen: FiveDayForecast,
      options: {
        title: '5-day forecast',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={calendar}
            // tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  // initialRouteName: 'Current',
  screenOptions: {
    headerStyle: { backgroundColor: 'lightblue' },
  },
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Current',
        headerShown: false,
      },
    },
    // FiveDayForecast: {
    //   screen: FiveDayForecast,
    //   options: {
    //     title: '5-day forecast',
    //   },
    // },
  },
});
const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <LocationProvider>
      <Navigation />
    </LocationProvider>
  );
}
