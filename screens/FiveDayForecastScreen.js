import SearchBar from '../components/SearchBar';

import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { LocationContext } from '../LocationContext';

import { LineChart } from 'react-native-gifted-charts';

import { useQuery } from '@tanstack/react-query';

export default function FiveDayForecast() {
  const { location } = useContext(LocationContext);

  // const [fivedaysforecast, setFivedaysforecast] = useState(null);
  // const [tempData, setTempData] = useState([]);
  // const [windData, setWindData] = useState([]);
  // const [gustData, setGustData] = useState([]);

  async function getForecast(location) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0]}&lon=${location[1]}&appid=34ec35da331d9646a7524278373c16a0`
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

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const getTempData = (forecast) => {
    return forecast.list.map((hour, index, arr) => {
      const [date, time] = hour.dt_txt.split(' ');
      const [hourStr] = time.split(':');
      const monthDay = date.slice(5);

      const isFirstOfDay =
        index === 0 || date !== arr[index - 1].dt_txt.split(' ')[0];

      return {
        value: Number((hour.main.temp - 273.15).toFixed(0)),
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
    <>
      <ScrollView style={styles.container}>
        <Text style={[styles.header, styles.textStyle]}>
          {fivedaysforecast && fivedaysforecast.city.name}
        </Text>

        {tempData && (
          <>
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
              <Text style={styles.textStyle}>Temperature, °C</Text>
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
          </>
        )}

        <View style={styles.searchBar}>
          <SearchBar />
        </View>
        <StatusBar style="light" />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021d2cff',
  },
  wrapper: {
    marginBottom: 20,
    padding: 10,
  },

  header: {
    fontSize: 35,
    marginBottom: 5,
    padding: 20,
    textAlign: 'center',
  },
  searchBar: { margin: 40 },
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
