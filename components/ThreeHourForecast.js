import { View, Text, Image, StyleSheet } from 'react-native';

export default function ThreeHourForecast({ fivedaysforecast, hour }) {
  return (
    <View style={styles.container}>
      <View>
        <Text>{fivedaysforecast && fivedaysforecast.list[hour].dt_txt}</Text>
        <Text>
          {fivedaysforecast && fivedaysforecast.list[hour].weather[0].main}
        </Text>
        <Text>
          Temp:{' '}
          {fivedaysforecast &&
            (fivedaysforecast.list[hour].main.temp - 273.15).toFixed(1) + '°'}
        </Text>
        <Text>
          Wind speed:{' '}
          {fivedaysforecast && fivedaysforecast.list[hour].wind.speed} m/s
        </Text>
      </View>

      <Image
        style={styles.image}
        source={{
          uri: `https://openweathermap.org/img/wn/${fivedaysforecast.list[hour].weather[0].icon}@2x.png`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 10,
    margin: 5,
  },

  image: {
    width: 50,
    height: 50,
    backgroundColor: '#d8d5d5ff',
  },
});
