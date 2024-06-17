import React from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  Dimensions,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Text, View } from '@/components/Themed'

const CwaApiKey = "CWA-KEY" // api key here

async function getCWAApi(
  apiName: string,
  options: string
):Promise<any> {
  try {
    const response = await fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${apiName}?Authorization=${CwaApiKey}&format=JSON&${options}`,
      {
        method: 'GET',
        headers: {
          'Accept-Encoding': 'br,gzip',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      return data.records
    } else {
      console.error('API Response Error:', response.statusText)
    }
  } catch (error) {
    console.error('API Response Error:', error)
  }
}

async function getWeather(
  setWeatherData: Function
):Promise<void> {
  console.log("nggyu")
  const manualStations = ["467530"]
  const autoStations = ["C0M530", "C0M770", "C0M800", "C0M810", "C0M820", "C0M860"]
  const weatherArg = "WeatherElement=Weather,WindSpeed,AirTemperature,RelativeHumidity&GeoInfo=TownName"
  const towns = ["阿里山鄉", "竹崎鄉", "梅山鄉"]
  const weather = (await getCWAApi("O-A0003-001", `StationId=${manualStations}&${weatherArg}`).then((res) => res.Station)).concat(await getCWAApi("O-A0001-001", `StationId=${autoStations}&${weatherArg}`).then((res) => res.Station))
  const PoP = await getCWAApi("F-D0047-029", `locationName=${towns}&elementName=PoP6h`).then((res) => res.locations[0].location).then((l) => l.map((x: any) => ({locationName: x.locationName, PoP6h: x.weatherElement[0].time[0].elementValue[0].value})))
  const weatherData = weather.map((x: any) => ({
    TownName: x.GeoInfo.TownName,
    ObsTime: x.ObsTime.DateTime,
    StationId: x.StationId,
    StationName: x.StationName,
    WeatherElement: {
      Weather: x.WeatherElement.Weather,
      AirTemperature: x.WeatherElement.AirTemperature,
      PoP6h: PoP.find((y: any) => y.locationName === x.GeoInfo.TownName).PoP6h,
      RelativeHumidity: x.WeatherElement.RelativeHumidity,
      WindSpeed: x.WeatherElement.WindSpeed
    }
  }))
  setWeatherData(weatherData)
  console.log(weatherData)
  return
}

export default function Weather() {
  const [weatherStation, setWeatherStation] = React.useState("467530")
  const [weatherData, setWeatherData] = React.useState<any[]>([])
  const [ready, setReady] = React.useState(false)
  console.log("abc")
  React.useEffect(() => {
    async function fetchData() {
      await getWeather(setWeatherData)
      setReady(true)
    }
    fetchData()
  }, [weatherStation])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>即時天氣</Text>
      {ready && (<View style={styles.infoBox}>
        <Picker
          selectedValue={weatherStation}
          onValueChange={(val) => setWeatherStation(val)}
        >
          {weatherData.map((x, index: number) => (
            <Picker.Item
            key={index}
            label={x.StationName}
            value={x.StationId}
            />
          ))}
        </Picker>
        <View style={{backgroundColor: "yellow", height: 160, marginVertical: 12}}></View>
        <View style={{flexDirection: "row"}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 36, fontWeight: "bold", textDecorationLine: "underline"}}>{`${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.AirTemperature} °C`}</Text>
            <Text style={styles.text}>{`降雨機率：${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.PoP6h}%`}</Text>
            <Text style={styles.text}>{`濕度：${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.RelativeHumidity}%`}</Text>
            <Text style={styles.text}>{`風速：${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.WindSpeed} 公尺/秒`}</Text>
          </View>
          <View style={styles.separator} lightColor="#888" darkColor="rgba(255,255,255,0.1)"></View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: "row"}}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 32}}>天氣</Text>
                <Text style={styles.text}>{weatherData.find((x) => x.StationId === weatherStation).WeatherElement.Weather}</Text>
              </View>
              <View>
                <View style={{width: 54, height: 54, backgroundColor: "yellow"}} />
              </View>
            </View>
            <View>
              <Text style={styles.text}>{((x: string) => {const date = new Date(); date.setTime(Date.parse(x)); return date.toLocaleString(undefined, {weekday: "long", hour: "numeric", minute: "2-digit"})}) (weatherData.find((x) => x.StationId === weatherStation).ObsTime)}</Text>
            </View>
          </View>
        </View>
      </View>)}
      <Text style={styles.title}>其他位置</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  infoBox: {
    width: '90%',
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    textDecorationLine: 'underline',
    width: '90%',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
  },
  separator: {
    marginHorizontal: 12,
    height: "auto",
    width: 1,
  },
});
