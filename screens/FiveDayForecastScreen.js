import KeyboardAvoidingViewComp from '../components/KeyboardAvoidingComp';

import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import { LineChart } from 'react-native-gifted-charts';
import { useQuery } from '@tanstack/react-query';

import { useContext } from 'react';
import { LocationContext } from '../contexts/LocationContext';
import { TempUnitContext } from '../contexts/TempUnitContext';

export default function FiveDayForecast() {
  const { location } = useContext(LocationContext);
  const { tempUnit } = useContext(TempUnitContext);

  async function getForecast(location) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=34ec35da331d9646a7524278373c16a0`
    );
    return response.data;
  }

  const {
    data: fivedaysforecast,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['forecast', location],
    queryFn: () => getForecast(location),
    enabled: !!location,
  });

  if (isLoading)
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

  const getTempData = (forecast) => {
    return forecast.list.map((hour, index, arr) => {
      const [date, time] = hour.dt_txt.split(' ');
      const [hourStr] = time.split(':');
      const monthDay = date.slice(5);

      const isFirstOfDay =
        index === 0 || date !== arr[index - 1].dt_txt.split(' ')[0];

      return {
        value:
          tempUnit === 'celsius'
            ? Number((hour.main.temp - 273.15).toFixed(0))
            : Number((((hour.main.temp - 273.15) * 9) / 5 + 32).toFixed(0)),
        label: isFirstOfDay ? `${hourStr} ${monthDay}` : hourStr,
      };
    });
  };
  const tempData = getTempData(fivedaysforecast);

  const getWindData = (forecast) => {
    return forecast.list.map((hour) => {
      return {
        value: Number(hour.wind.speed),
      };
    });
  };

  const windData = getWindData(fivedaysforecast);

  const getGustData = (forecast) => {
    return forecast.list.map((hour, index, arr) => {
      const [date, time] = hour.dt_txt.split(' ');
      const [hourStr] = time.split(':');
      const monthDay = date.slice(5);

      const isFirstOfDay =
        index === 0 || date !== arr[index - 1].dt_txt.split(' ')[0];

      return {
        value: Number(hour.wind.gust),
        label: isFirstOfDay ? `${hourStr} ${monthDay}` : hourStr,
      };
    });
  };

  const gustData = getGustData(fivedaysforecast);

  // useEffect(() => {
  //   async function getCurrentWeather(location) {
  //     try {
  //       const response = await axios.get(
  //         `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0]}&lon=${location[1]}&appid=34ec35da331d9646a7524278373c16a0`
  //       );

  //       setFivedaysforecast(response.data);

  //       // setTempData(
  //       //   response.data.list.map((hour) => ({
  //       //     value: Number((hour.main.temp - 273.15).toFixed(0)),
  //       //     label: hour.dt_txt.split(' ')[1].split(':').slice(0, 2).join(':'),
  //       //   }))
  //       // );
  //       setTempData(
  //         response.data.list.map((hour, index, arr) => {
  //           const [date, time] = hour.dt_txt.split(' '); // ["2025-08-15", "06:00:00"]
  //           const [hourStr] = time.split(':'); // "06"
  //           const monthDay = date.slice(5); // "08-15"

  //           // Om det är första objektet, eller om datumet skiljer sig från föregående
  //           const isFirstOfDay =
  //             index === 0 || date !== arr[index - 1].dt_txt.split(' ')[0];

  //           return {
  //             value: Number((hour.main.temp - 273.15).toFixed(0)),
  //             label: isFirstOfDay ? `${hourStr} ${monthDay}` : hourStr,
  //           };
  //         })
  //       );
  //       setWindData(
  //         response.data.list.map((hour) => {
  //           return {
  //             value: Number(hour.wind.speed),
  //           };
  //         })
  //       );
  //       setGustData(
  //         response.data.list.map((hour, index, array) => {
  //           const [date, time] = hour.dt_txt.split(' ');
  //           const [hourStr] = time.split(':');
  //           const monthDay = date.slice(5);

  //           const isFirstOfDay =
  //             index === 0 || date !== array[index - 1].dt_txt.split(' ')[0];

  //           return {
  //             value: Number(hour.wind.gust),
  //             label: isFirstOfDay ? `${hourStr} ${monthDay}` : hourStr,
  //           };
  //         })
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getCurrentWeather(location);
  // }, [location]);

  // async function locationSearch(cityName) {
  //   try {
  //     const response = await axios.get(
  //       `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
  //     );

  //     if (response.data) {
  //       setLatAndLon([
  //         response.data.results[0].latitude,
  //         response.data.results[0].longitude,
  //       ]);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  return (
    <KeyboardAvoidingViewComp>
      <ScrollView style={[styles.container, { minHeight: '100vh' }]}>
        {tempData && (
          <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={[styles.header, styles.textStyle]}>
              {location.name}
            </Text>
            <View style={styles.wrapper}>
              <LineChart
                data={tempData}
                yAxisLabelSuffix="°"
                xAxisTextNumberOfLines={2}
                areaChart
                curved
                hideDataPoints
                yAxisTextStyle={{ color: '#fff' }}
                color1="rgba(236, 148, 16, 1)"
                startFillColor="#fb8500"
                startOpacity={0.8}
                endFillColor="rgb(203, 241, 250)"
                endOpacity={0.3}
                xAxisLabelTextStyle={{
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  color: '#fff',
                }}
              />
              <Text style={styles.textStyle}>
                Temperature, {tempUnit === 'celsius' ? 'C°' : 'F°'}
              </Text>
            </View>
            <View style={styles.wrapper}>
              <LineChart
                data={gustData}
                data2={windData}
                xAxisTextNumberOfLines={2}
                areaChart
                curved
                hideDataPoints
                color1="#977dbbff"
                color2="#6f31c7ff"
                startFillColor1="#d7d2ddff"
                startFillColor2="#8338ec"
                startOpacity={0.9}
                endOpacity={0.2}
                endFillColor="#cebee4ff"
                yAxisTextStyle={{ color: '#fff' }}
                xAxisLabelTextStyle={{
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  color: '#fff',
                }}
              />
              <Text style={styles.textStyle}>Wind, m/s, Gust m/s</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingViewComp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021d2cff',
  },
  wrapper: {
    padding: 10,
  },

  header: {
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
  },
  searchBar: { margin: 20, marginBottom: 30 },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  textStyle: {
    color: '#fff',
  },
});
