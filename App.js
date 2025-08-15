import HomeScreen from './screens/HomeScreen';
import FiveDayForecast from './screens/FiveDayForecastScreen';

import * as SplashScreen from 'expo-splash-screen';

import { createStaticNavigation } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import calendar from './assets/calendar-alt-svgrepo-com.png';

import sunVector from './assets/sun-svgrepo-com(3).png';

import { LocationProvider } from './LocationContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Current',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={sunVector}
            // tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
        tabBarStyle: {
          backgroundColor: '#021d2cff',
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: 10,
        },
        headerStyle: { backgroundColor: '#021d2cff' },
        headerTintColor: '#fff',
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
        tabBarStyle: {
          backgroundColor: '#021d2cff',
          borderTopWidth: 0,
        },
        headerStyle: { backgroundColor: '#021d2cff' },
        headerTintColor: '#fff',
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
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <Navigation />
      </LocationProvider>
    </QueryClientProvider>
  );
}
