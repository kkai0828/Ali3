import { Text, View } from '@/components/Themed'
import React from 'react'
import { Tabs, useRouter, useLocalSearchParams } from 'expo-router'

interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
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
      const schedules = timetable.reduce((acc: any, schedule: any) => {
        schedule.StopTimes.forEach((stop: any) => {
          if (!acc[stop.StationID]) {
            acc[stop.StationID] = {
              StationName: stop.StationName,
              Times: [],
            }
          }
          acc[stop.StationID].Times.push({
            TrainNo: schedule.TrainNo,
            StopSequence: stop.StopSequence,
            ArrivalTime: stop.ArrivalTime,
            DepartureTime: stop.DepartureTime,
          })
        })
        return acc
      }, {})
      console.log('API Response:', schedules)
      setData(schedules)
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
  const { startingStation, endingStation } = params
  React.useEffect(() => {
  //   async function fetchData() {
  //     const token = await GetAuthorizationHeader()
  //     await GetApiResponse(token, setData)
  //   }
  //   fetchData()
  console.log('result')
  }, [])
  return (
    <>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{startingStation}</Text>
      </View>
    </>
  )
}
