import { Text, View } from '@/components/Themed'
import React from 'react'
import { FlatList, StyleSheet, Dimensions } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}
interface trainInfo {
  TrainNo: string
  DepartureTime: string
  ArrivalTime: string
}

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
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
  setData: Function,
  startingStation: any,
  endingStation: any,
  direction: any
): Promise<void> {
  if (!accesstoken) {
    console.error('No access token found')
    return
  }

  try {
    const response = await fetch(
      'https://tdx.transportdata.tw/api/basic/v3/Rail/AFR/GeneralTrainTimetable',
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
      const timetable = data['TrainTimetables']
      const schedules: trainInfo[] = [
        {
          TrainNo: '',
          DepartureTime: '',
          ArrivalTime: '',
        },
      ]

      let j = 0
      for (let i = 0; i < timetable.length; i++) {
        if (timetable[i].TrainInfo.Direction != direction) {
          continue
        }
        schedules[j] = { TrainNo: '', DepartureTime: '', ArrivalTime: '' }
        console.log(timetable[i])
        for (let k = 0; k < timetable[i].StopTimes.length; k++) {
          let stop = timetable[i].StopTimes[k]
          console.log(stop.StopSequence, stop.StationName.Zh_tw)
          if (stop.StationName.Zh_tw === startingStation) {
            schedules[j] = {
              ...schedules[j],
              TrainNo: timetable[i].TrainInfo.TrainNo,
              DepartureTime: stop.DepartureTime,
            }
          }
          if (stop.StationName.Zh_tw === endingStation) {
            schedules[j] = {
              ...schedules[j],
              ArrivalTime: stop.ArrivalTime,
            }
          }
        }
        if (
          schedules[j].ArrivalTime == '' ||
          schedules[j].DepartureTime == ''
        ) {
          delete schedules[j] // Delete the incomplete schedule
        } else {
          j++
        }
      }
      schedules.sort((a, b) => {
        if (a.DepartureTime && b.DepartureTime) {
          return a.DepartureTime.localeCompare(b.DepartureTime)
        }
        return 0
      })
      if (schedules[0] == undefined) {
        setData(null)
        console.log('Data not found')
      } else {
        setData(schedules)
        console.log('API Response:', schedules)
      }
      // 在這裡處理數據，設置狀態或顯示在界面上
    } else {
      console.error('API Response Error:', response.statusText)
    }
  } catch (error) {
    console.error('API Response Error:', error)
  }
}
export default function Result() {
  const [data, setData] = React.useState<any>(null)
  const params = useLocalSearchParams()
  const { startingStation, endingStation, direction } = params
  React.useEffect(() => {
    async function fetchData() {
      const token = await GetAuthorizationHeader()
      await GetApiResponse(
        token,
        setData,
        startingStation,
        endingStation,
        direction
      )
    }
    fetchData()
  }, [startingStation, endingStation, direction])
  const renderItem = ({ item }: { item: any; index: number }) => {
    function getTimeDifference(startTime: string, endTime: string): string {
      const start = new Date(`2022-01-01T${startTime}`)
      const end = new Date(`2022-01-01T${endTime}`)
      const diffMs = end.getTime() - start.getTime()

      // Calculate hours and minutes
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      return `${hours} 時 ${minutes} 分`
    }

    return !item ? null : (
      <View style={styles.box}>
        <View
          style={{
            height: '70%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '30%', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: '500' }}>
              {item?.DepartureTime}
            </Text>
          </View>
          <View style={{ width: '40%', alignItems: 'center' }}>
            <FontAwesome size={30} name="long-arrow-right" color={'#767676'} />
            <Text style={{ fontSize: 15, fontWeight: '300' }}>
              No.{item?.TrainNo}
            </Text>
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: '500' }}>
              {item?.ArrivalTime}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: '30%',
            width: '90%',
            borderTopWidth: 0.4,
            borderColor: 'gray',
            justifyContent: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome size={20} name="clock-o" color={'#767676'} />
            <Text style={{ left: 10 }}>
              {getTimeDifference(item.DepartureTime, item.ArrivalTime)}
            </Text>
          </View>
        </View>
      </View>
    )
  }
  return (
    <>
      <View
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            height: height * 0.07,
            width: width,
            marginBottom: 20,
            backgroundColor: '#28B67E',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            shadowColor: 'rgba(0,0,0,0.25)', // Shadow color
            shadowOpacity: 1, // Shadow opacity (0.0 to 1.0)
            shadowOffset: { width: 0, height: 2 }, // Shadow offset (width, height)
            shadowRadius: 4, // Shadow blur radius
            elevation: 5, // Android shadow elevation (works on Android API level 21 and above)
          }}
        >
          <Text style={{ color: '#fff', fontSize: 25, fontWeight: '500' }}>
            {startingStation}
          </Text>
          <FontAwesome
            style={{ marginHorizontal: 70 }}
            size={30}
            name="long-arrow-right"
            color={'#fff'}
          />
          <Text style={{ color: '#fff', fontSize: 25, fontWeight: '500' }}>
            {endingStation}
          </Text>
        </View>
        {data == null ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome size={30} name="train" color={'#767676'} />
            <Text style={{ fontSize: 25, fontWeight: '500', left: 10 }}>
              查無資料
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={data}
              renderItem={renderItem}
              contentContainerStyle={{ width: width }}
            />
          </>
        )}
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    height: height * 0.14,
    width: '94%',
    marginBottom: '5%',
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: 'rgba(0,0,0,0.25)', // Shadow color
    shadowOpacity: 1, // Shadow opacity (0.0 to 1.0)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (width, height)
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Android shadow elevation (works on Android API level 21 and above)
  },
})
