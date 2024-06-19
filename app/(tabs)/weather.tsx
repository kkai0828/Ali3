import React from 'react'
import { StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Text, View } from '@/components/Themed'
import FontAwesome from '@expo/vector-icons/FontAwesome'

// const CwaApiKey = "CWA-KEY" // api key here
const CwaApiKey = 'CWA-4D45A9F4-6032-4E3B-9AF5-74CF19D3F2FB' // api key here

async function getCWAApi(apiName: string, options: string): Promise<any> {
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

async function getWeather(setWeatherData: Function): Promise<void> {
  const manualStations = ['467530']
  const autoStations = [
    'C0M530',
    'C0M770',
    'C0M800',
    'C0M810',
    'C0M820',
    'C0M860',
  ]
  const weatherArg =
    'WeatherElement=Weather,WindSpeed,AirTemperature,RelativeHumidity&GeoInfo=TownName'
  const towns = ['阿里山鄉', '竹崎鄉', '梅山鄉']
  const weather = (
    await getCWAApi(
      'O-A0003-001',
      `StationId=${manualStations}&${weatherArg}`
    ).then((res) => res.Station)
  ).concat(
    await getCWAApi(
      'O-A0001-001',
      `StationId=${autoStations}&${weatherArg}`
    ).then((res) => res.Station)
  )
  const PoP = await getCWAApi(
    'F-D0047-029',
    `locationName=${towns}&elementName=PoP6h`
  )
    .then((res) => res.locations[0].location)
    .then((l) =>
      l.map((x: any) => ({
        locationName: x.locationName,
        PoP6h: x.weatherElement[0].time[0].elementValue[0].value,
      }))
    )
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
      WindSpeed: x.WeatherElement.WindSpeed,
    },
  }))
  setWeatherData(weatherData)
  console.log(weatherData)
  return
}

export default function Weather() {
  const [weatherStation, setWeatherStation] = React.useState('467530')
  const [weatherStationName, setWeatherStationName] = React.useState('阿里山')
  const [weatherData, setWeatherData] = React.useState<any[]>([])
  const [ready, setReady] = React.useState(false)
  const [modalvisible, setModalVisible] = React.useState(false)
  const [weather, setWeather] = React.useState<string>('陰')
  React.useEffect(() => {
    async function fetchData() {
      await getWeather(setWeatherData)
      setReady(true)
    }
    fetchData()
  }, [weatherStation])
  let iconPath = require('../../assets/images/cloudy.png')
  // let imagePath = require('../../assets/images/cloudy-img.jpeg')
  let imagePath = require('../../assets/images/sunny-img.png')

  const getWeatherImage = (weather: string) => {
    switch (weather) {
      case '陰':
        return (imagePath = require('../../assets/images/cloudy-img.jpeg'))

      case '多雲':
        return (imagePath = require('../../assets/images/partly-cloudy-img.jpeg'))

      case '晴':
        return (imagePath = require('../../assets/images/sunny-img.png'))

      default:
        return (imagePath = require('../../assets/images/sunny-img.png'))
    }
  }
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case '陰':
        return (iconPath = require('../../assets/images/cloudy.png'))

      case '多雲':
        return (imagePath = require('../../assets/images/partly-cloudy.png'))

      case '晴':
        return (iconPath = require('../../assets/images/sunny.png'))

      default:
        return (iconPath = require('../../assets/images/sunny.png'))
    }
  }
  const otherLocationWeatherData = weatherData
    .filter((data) => data.StationId !== weatherStation)
    .slice(0, 3) // 选择前三个不同的数据
  return (
    <View style={styles.container}>
      <Text style={styles.title}>即時天氣</Text>
      {ready && (
        <View style={styles.infoBox}>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              borderWidth: 1,
              height: 40,
              alignItems: 'center',
              paddingHorizontal: 15,
              flexDirection: 'row',
            }}
            onPress={() => {
              setModalVisible(!modalvisible)
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '500' }}>
              {weatherStationName}
            </Text>
            <FontAwesome
              style={{ position: 'absolute', right: 20 }}
              name="caret-down"
              size={30}
            />
          </TouchableOpacity>
          {modalvisible && (
            <Picker
              style={{
                borderWidth: 1,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}
              selectedValue={weatherStation}
              onValueChange={(val) => {
                const station = weatherData.find((x) => x.StationId === val)
                if (station) {
                  setWeatherStation(val)
                  setWeatherStationName(station.StationName)
                  setWeather(
                    weatherData.find((x) => x.StationId === val).WeatherElement
                      .Weather
                  )
                }
              }}
            >
              {weatherData.map((x, index: number) => (
                <Picker.Item
                  key={index}
                  label={x.StationName}
                  value={x.StationId}
                />
              ))}
            </Picker>
          )}
          <Image
            style={{
              height: 160,
              width: '100%',
              marginVertical: 12,
              borderRadius: 13,
            }}
            resizeMode="cover"
            source={getWeatherImage(weather)}
          />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 36, fontWeight: 'bold' }}
              >{`${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.AirTemperature} °C`}</Text>
              <Text
                style={styles.text}
              >{`降雨機率：${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.PoP6h}%`}</Text>
              <Text
                style={styles.text}
              >{`濕度：${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.RelativeHumidity}%`}</Text>
              <Text
                style={styles.text}
              >{`風速：${weatherData.find((x) => x.StationId === weatherStation).WeatherElement.WindSpeed} 公尺/秒`}</Text>
            </View>
            <View
              style={styles.separator}
              lightColor="#888"
              darkColor="rgba(255,255,255,0.1)"
            />
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 32, marginBottom: 5 }}>天氣</Text>
                  <Text style={styles.text}>{weather}</Text>
                </View>
                <Image
                  style={{ width: 54, height: 54 }}
                  resizeMode="contain"
                  source={getWeatherIcon(weather)}
                />
              </View>
              <View>
                <Text style={styles.text}>
                  {((x: string) => {
                    const date = new Date()
                    date.setTime(Date.parse(x))
                    return date.toLocaleString('zh-TW', {
                      weekday: 'long',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  })(
                    weatherData.find((x) => x.StationId === weatherStation)
                      .ObsTime
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <Text style={[styles.title, { top: 20 }]}>其他位置</Text>
      <View
        style={{
          top: 20,
          width: '100%',
          height: height * 0.15,
          flexDirection: 'row',
          paddingHorizontal: 12,
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        {otherLocationWeatherData.map((data, index) => (
          <View style={styles.otherlocation}>
            <Image
              style={{ width: 47, height: 47, marginVertical: 10 }}
              resizeMode="contain"
              source={getWeatherIcon(data.WeatherElement.Weather)}
            />
            <Text
              style={{ textAlign: 'center', fontSize: 17, letterSpacing: 1,lineHeight:25 }}
              key={index}
            >
              {`${data.WeatherElement.AirTemperature} °C\n${data.StationName}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const height = Dimensions.get('window').height
const styles = StyleSheet.create({
  container: {
    height: height,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    width: '90%',
    marginVertical: 8,
  },
  text: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 1,
    marginBottom: 5,
  },
  separator: {
    marginHorizontal: 12,
    height: 'auto',
    width: 1,
  },
  otherlocation: {
    width: '30%',
    height: '100%',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    margin: 6,
    shadowColor: 'rgba(0,0,0,0.25)', // Shadow color
    shadowOpacity: 1, // Shadow opacity (0.0 to 1.0)
    shadowOffset: { width: 1, height: 2 }, // Shadow offset (width, height)
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Android shadow elevation (works on Android API level 21 and above)
  },
})
