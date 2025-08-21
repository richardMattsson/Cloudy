import HomeScreen from './screens/HomeScreen';
import FiveDayForecast from './screens/FiveDayForecastScreen';
import Favorites from './screens/FavoritesScreen';
import SettingsButton from './components/SettingsButton';
import FavoriteComp from './components/FavoriteComp';

import { createStaticNavigation, DefaultTheme } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import calendar from './assets/calendar-alt-svgrepo-com.png';

import sunVector from './assets/sun-svgrepo-com(3).png';

import { useEffect } from 'react';

import { Asset } from 'expo-asset';

import starTrue from './assets/star-true.png';

import { LocationProvider } from './contexts/LocationContext';
import { TempUnitProvider } from './contexts/TempUnitContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import * as SplashScreen from 'expo-splash-screen';
import { Background } from '@react-navigation/elements';

const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#021d2cff',
    primary: '#fff',
  },
};

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
          height: 90,
        },
        headerStyle: { backgroundColor: '#021d2cff', height: 125 },
        headerTintColor: '#fff',
      },
    },

    FiveDayForecast: {
      screen: FiveDayForecast,
      options: {
        headerRight: () => <SettingsButton />,
        // headerLeft: () => <FavoriteComp />,
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
          height: 90,
        },
        headerStyle: {
          backgroundColor: '#021d2cff',
          height: 125,
        },
        headerTintColor: '#fff',
      },
    },

    Favorites: {
      screen: Favorites,
      options: {
        headerRight: () => <SettingsButton />,
        // headerLeft: () => <FavoriteComp />,
        title: 'Favorites',
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={starTrue}
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
          height: 90,
        },
        headerStyle: {
          backgroundColor: '#021d2cff',
          height: 125,
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
  useEffect(() => {
    Asset.loadAsync(require('./assets/rain.jpg'));
    Asset.loadAsync(require('./assets/mist.jpg'));
    Asset.loadAsync(require('./assets/clear.jpg'));
    Asset.loadAsync(require('./assets/clouds.jpg'));
    Asset.loadAsync(require('./assets/snow.jpg'));
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <TempUnitProvider>
          <Navigation theme={defaultTheme} />
        </TempUnitProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}
