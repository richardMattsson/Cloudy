import SearchBar from '../components/SearchBar';
// import ThreeHourForecast from '../components/ThreeHourForecast';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { LocationContext } from '../LocationContext';

import { LineChart } from 'react-native-gifted-charts';

export default function FiveDayForecast() {
  // const [latAndLon, setLatAndLon] = useState(['57.707', '11.967']);

  const [fivedaysforecast, setFivedaysforecast] = useState(null);

  const { location } = useContext(LocationContext);

  const [tempData, setTempData] = useState([]);
  const [windData, setWindData] = useState([]);
  const [gustData, setGustData] = useState([]);

  // const data = [
  //   { value: 50, label: 'Mon' },
  //   { value: 80, label: 'Tue' },
  //   { value: 90, label: 'Wed' },
  //   { value: 70, label: 'Thu' },
  // ];

  // let array = [
  //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  // ];

  useEffect(() => {
    async function getCurrentWeather(location) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0]}&lon=${location[1]}&appid=34ec35da331d9646a7524278373c16a0`
        );

        setFivedaysforecast(response.data);

        // setTempData(
        //   response.data.list.map((hour) => ({
        //     value: Number((hour.main.temp - 273.15).toFixed(0)),
        //     label: hour.dt_txt.split(' ')[1].split(':').slice(0, 2).join(':'),
        //   }))
        // );
        setTempData(
          response.data.list.map((hour, index, arr) => {
            const [date, time] = hour.dt_txt.split(' '); // ["2025-08-15", "06:00:00"]
            const [hourStr] = time.split(':'); // "06"
            const monthDay = date.slice(5); // "08-15"

            // Om det är första objektet, eller om datumet skiljer sig från föregående
            const isFirstOfDay =
              index === 0 || date !== arr[index - 1].dt_txt.split(' ')[0];

            return {
              value: Number((hour.main.temp - 273.15).toFixed(0)),
              label: isFirstOfDay ? `${hourStr} ${monthDay}` : hourStr,
            };
          })
        );
        setWindData(
          response.data.list.map((hour) => {
            return {
              value: Number(hour.wind.speed),
            };
          })
        );
        setGustData(
          response.data.list.map((hour, index, array) => {
            const [date, time] = hour.dt_txt.split(' ');
            const [hourStr] = time.split(':');
            const monthDay = date.slice(5);

            const isFirstOfDay =
              index === 0 || date !== array[index - 1].dt_txt.split(' ')[0];

            return {
              value: Number(hour.wind.gust),
              label: isFirstOfDay ? `${hourStr} ${monthDay}` : hourStr,
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    }
    getCurrentWeather(location);
  }, [location]);

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
      <ScrollView>
        <Text style={styles.header}>
          {fivedaysforecast && fivedaysforecast.city.name}
        </Text>
        {/* {fivedaysforecast && (
          <View style={styles.wrapper}>
            {array.map((number) => (
              <ThreeHourForecast
                fivedaysforecast={fivedaysforecast}
                hour={number}
                key={fivedaysforecast.list[number].dt}
              />
            ))}
          </View>
        )} */}
        {tempData && (
          <ScrollView>
            <View style={styles.wrapper}>
              <LineChart
                data={tempData}
                yAxisLabelSuffix="°"
                xAxisTextNumberOfLines={2}
                areaChart
                curved
                hideDataPoints
                color1="rgba(236, 185, 16, 1)"
                startFillColor="rgba(236, 185, 16, 1)"
                startOpacity={0.8}
                endFillColor="rgb(203, 241, 250)"
                endOpacity={0.3}
                xAxisLabelTextStyle={{
                  // fontSize: 12,
                  // color: "black",
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  // width: 50,
                }}
              />
              <Text>Temperature, °C</Text>
            </View>
            <View style={styles.wrapper}>
              <LineChart
                data={gustData}
                data2={windData}
                xAxisTextNumberOfLines={2}
                areaChart
                curved
                hideDataPoints
                // height={250}
                // showVerticalLines
                // spacing={44}
                color1="rgba(148, 186, 204, 1)"
                color2="rgba(16, 166, 236, 1)"
                // dataPointsColor1="blue"
                // dataPointsColor2="red"
                startFillColor1="rgba(168, 212, 233, 1)"
                startFillColor2="rgba(53, 178, 236, 1)"
                startOpacity={0.8}
                endOpacity={0.3}
                // endFillColor="rgb(203, 241, 250)"
                xAxisLabelTextStyle={{
                  // fontSize: 12,
                  // color: "black",
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  // width: 50,
                }}
              />
              <Text>Wind, m/s, Gust m/s</Text>
            </View>
          </ScrollView>
        )}

        <View style={styles.searchBar}>
          <SearchBar />
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: 'white',
  // },
  wrapper: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    marginBottom: 20,
    padding: 10,
    // margin: 10,
  },
  // inner: {
  //   padding: 24,
  //   flex: 1,
  //   justifyContent: 'space-evenly',
  //   backgroundColor: 'white',
  // },
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
  // image: {
  //   width: 100,
  //   height: 100,
  //   backgroundColor: 'grey',
  // },
});
