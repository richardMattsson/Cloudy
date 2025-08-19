import HomeScreen from './screens/HomeScreen';
import FiveDayForecast from './screens/FiveDayForecastScreen';
import SettingsButton from './components/SettingsButton';
import FavoriteComp from './components/FavoriteComp';

import { createStaticNavigation } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Settings } from 'react-native';
import calendar from './assets/calendar-alt-svgrepo-com.png';
import cog from './assets/cog-white.png';

import sunVector from './assets/sun-svgrepo-com(3).png';

import { LocationProvider } from './LocationContext';
import { TempUnitProvider } from './TempUnitContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { FavoriteProvider } from './FavoriteContext';

// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerRight: () => <SettingsButton />,
        headerLeft: () => <FavoriteComp />,
        title: 'Current',
        headerTitleAlign: 'center',
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
        headerRight: () => <SettingsButton />,
        headerLeft: () => <FavoriteComp />,
        title: '5-day forecast',
        headerTitleAlign: 'center',
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
          paddingTop: 10,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: '#021d2cff',
        },
        headerTintColor: '#fff',
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  // initialRouteName: 'Current',
  screenOptions: {
    headerStyle: { backgroundColor: '#021d2cff' },
  },
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false,
        headerRight: () => <SettingsButton />,
        headerLeft: () => <FavoriteComp />,
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
  // useEffect(() => {
  //   const hideSplashScreen = async () => {
  //     await new Promise((res) => setTimeout(res, 4000));
  //     await SplashScreen.hideAsync();
  //   };
  //   hideSplashScreen();
  // }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <TempUnitProvider>
          <FavoriteProvider>
            <Navigation />
          </FavoriteProvider>
        </TempUnitProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}
