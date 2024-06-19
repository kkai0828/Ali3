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
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'

interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}
interface NewsItem {
  NewsID: string
  Language: number
  Title: string
  NewsCategory: number
  Description: string
  StartTime: string
  EndTime: string
  PublishTime: string
  UpdateTime: string
}
async function GetAuthorizationHeader(): Promise<AuthResponse | undefined> {
  const parameter = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'sssun-09d597db-5ec8-446e',
    client_secret: '8ffe4bd6-dc2e-40e1-8f9e-2c5d62e13ab1',
  })

  const auth_url =
    'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token'

  try {
    const response = await fetch(auth_url, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'br,gzip',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parameter.toString(),
    })

    if (response.ok) {
      const data: AuthResponse = await response.json()
      return data
    } else {
      console.error('Authorization Error:', response.statusText)
    }
  } catch (error) {
    console.error('Authorization Error:', error)
  }
}

async function GetApiResponse(
  accesstoken: AuthResponse | undefined,
  setData: Function
): Promise<void> {
  if (!accesstoken) {
    console.error('No access token found')
    return
  }

  try {
    const response = await fetch(
      'https://tdx.transportdata.tw/api/basic/v3/Rail/AFR/News?%24top=30&%24format=JSON',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accesstoken.access_token,
          'Accept-Encoding': 'br,gzip',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      // console.log('news', data)
      console.log(data['Newses'])
      setData(data['Newses'] as NewsItem[])
      // 在這裡處理數據，設置狀態或顯示在界面上
    } else {
      console.error('API Response Error:', response.statusText)
    }
  } catch (error) {
    console.error('API Response Error:', error)
  }
}
export default function TimeTableScreen() {
  const [startingStation, setStartingStation] = React.useState<string>('嘉義')
  const [endingStation, setEndingStation] = React.useState<string>('祝山')
  const [startingStationTmp, setStartingStationTmp] =
    React.useState<string>('嘉義')
  const [endingStationTmp, setEndingStationTmp] = React.useState<string>('祝山')
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)
  const [direction, setDirection] = React.useState(0)
  const [data, setData] = React.useState<NewsItem[]>([])
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0)
  const date = new Date()


  React.useEffect(() => {
    async function fetchData() {
      const token = await GetAuthorizationHeader()
      await GetApiResponse(token, setData)
    }
    fetchData()
  }, [])
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % data.length)
      date.setTime(Date.parse(data[currentMessageIndex]?.PublishTime))
    }, 10000) // 10 seconds

    return () => clearInterval(intervalId)
  }, [data])

  const stationNames = [
    '嘉義',
    '北門',
    '竹崎',
    '樟腦寮',
    '獨立山',
    '梨園寮',
    '交力坪',
    '水社寮',
    '奮起湖',
    '多林',
    '十字路',
    '神木',
    '阿里山',
    '沼平',
    '祝山',
  ]
  const stationMap: { [key: string]: number } = stationNames.reduce(
    (acc, name, index) => {
      acc[name] = index
      return acc
    },
    {} as { [key: string]: number }
  )
  React.useEffect(() => {
    const startingStationNumber = stationMap[startingStation]
    const endingStationNumber = stationMap[endingStation]

    const newDirection = endingStationNumber < startingStationNumber ? 1 : 0
    setDirection(newDirection)
  }, [startingStation, endingStation])

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }
  const exchangeStation = () => {
    let tmp = startingStation
    setStartingStation(endingStation)
    setEndingStation(tmp)
  }
  const router = useRouter()
  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Image
          style={{ width: '100%', height: 120 }}
          resizeMode="cover"
          source={{
            uri: 'https://cpok.tw/wp-content/uploads/2022/03/unnamed-file-42.png',
          }}
        />
        <View style={styles.infoBox}>
          <View
            style={{
              height: Dimensions.get('screen').height * 0.15,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: '10%',
              paddingVertical: '5%',
              backgroundColor: 'transparent',
            }}
          >
            <View style={{ height: '100%', alignItems: 'flex-start' }}>
              <Text style={{ color: '#767676', marginVertical: 15 }}>
                起程站
              </Text>
              <Pressable onPress={toggleModal}>
                <Text style={{ fontSize: 25 }}>{startingStation}</Text>
              </Pressable>
            </View>
            <Pressable onPress={exchangeStation} style={{ top: 10 }}>
              <FontAwesome size={25} name="exchange" color={'#767676'} />
            </Pressable>
            <View style={{ height: '100%', alignItems: 'flex-end' }}>
              <Text style={{ color: '#767676', marginVertical: 15 }}>
                終點站
              </Text>
              <Pressable onPress={toggleModal}>
                <Text style={{ fontSize: 25 }}>{endingStation}</Text>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.navigate({
                pathname: './result',
                params: {
                  startingStation: startingStation,
                  endingStation: endingStation,
                  direction: direction,
                },
              })
            }}
          >
            <Text style={styles.buttonText}>查詢</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '500',
            letterSpacing: 0.9,
            marginVertical: 20,
          }}
        >
          最新消息
        </Text>
        <View style={styles.infoBox2}>
          <Text style={styles.title}>
            {data[currentMessageIndex]?.Title.replace(' ', '\n')}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '500',
              textAlign: 'center',
              letterSpacing: 1,
              marginBottom: 5,
            }}
          >
            {'發布時間 : '}
            {date.toLocaleString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <View style={styles.separator} />
          <Text style={styles.description}>
            {data[currentMessageIndex]?.Description.replace(
              /<\/?[^>]+(>|$)|&nbsp;|-/g,
              ''
            )}
          </Text>
          <Text style={styles.description}></Text>
        </View>
      </ScrollView>
      {isModalVisible && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerTopBar}>
            <TouchableOpacity
              onPress={() => {
                let tmp = startingStationTmp
                setStartingStationTmp(endingStationTmp)
                setEndingStationTmp(tmp)
              }}
            >
              <Text style={[styles.buttonText, { color: '#28B67E' }]}>
                起迄站互換
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (startingStationTmp !== endingStationTmp) {
                  setStartingStation(startingStationTmp)
                  setEndingStation(endingStationTmp)
                  toggleModal()
                } else {
                  Alert.alert('起程站與到達站不能相同')
                }
              }}
            >
              <Text style={[styles.buttonText, { color: '#28B67E' }]}>
                完成
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingTop: 13 }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'gray',
                  fontSize: 18,
                  fontWeight: '400',
                }}
              >
                起程站
              </Text>
              <Picker
                selectedValue={startingStationTmp}
                onValueChange={(itemValue) => setStartingStationTmp(itemValue)}
              >
                {stationNames.map((stationName: any, index: number) => (
                  <Picker.Item
                    key={index}
                    label={stationName}
                    value={stationName}
                  />
                ))}
              </Picker>
            </View>
            <View style={{ flex: 1, paddingTop: 13 }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'gray',
                  fontSize: 18,
                  fontWeight: '400',
                }}
              >
                到達站
              </Text>
              <Picker
                selectedValue={endingStationTmp}
                onValueChange={(itemValue) => setEndingStationTmp(itemValue)}
              >
                {stationNames.map((stationName: any, index: number) => (
                  <Picker.Item
                    key={index}
                    label={stationName}
                    value={stationName}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 15,
    letterSpacing: 0.8,
    fontWeight: '500',
    flexWrap: 'wrap',
    lineHeight: 20,
    color: '#696069',
  },
  infoBox: {
    height: Dimensions.get('screen').height * 0.2,
    width: '90%',
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,0.25)', // Shadow color
    shadowOpacity: 1, // Shadow opacity (0.0 to 1.0)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (width, height)
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Android shadow elevation (works on Android API level 21 and above)
  },
  infoBox2: {
    width: '90%',
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,0.25)', // Shadow color
    shadowOpacity: 1, // Shadow opacity (0.0 to 1.0)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (width, height)
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Android shadow elevation (works on Android API level 21 and above)
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    // padding: 16,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  pickerTopBar: {
    flexDirection: 'row',
    height: '20%',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 19,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
  },
  separator: {
    height: 1,
    borderWidth: 0.5,
    marginBottom: 15,
    alignSelf: 'center',
    width: '80%',
  },
  button: {
    marginHorizontal: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28B67E',
    height: 35,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
})
