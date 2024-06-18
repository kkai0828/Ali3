import React from 'react'
import { StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native'
import { Text, View } from '@/components/Themed'
import { WebView } from 'react-native-webview'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
export default function CCTV() {
  const [vid, setVid] = React.useState('T18-88K+150')
  const [location, setLocation] = React.useState<string>('觸口（龍隱寺前）')
  return (
    <View style={styles.container}>
      <Text style={styles.title}>即時影像</Text>
      <View
        style={{
          backgroundColor: '#282828',
          width: width * 0.96,
          height: height * 0.35,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <WebView
          source={{
            uri: `https://cctv-ss06.thb.gov.tw:443/${vid}`,
          }}
          style={{
            alignSelf: 'center',
            width: '90%',
            height: '80%',
            backgroundColor: 'transparent',
          }}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: '400',
            fontSize: 20,
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {location}
        </Text>
      </View>
      <Text style={styles.title}>道路位置</Text>
      <View
        style={{
          width: '90%',
          marginVertical: 12,
          backgroundColor: 'transparent',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                location == '觸口（龍隱寺前）' ? '#27335F' : '#fff',
            },
          ]}
          onPress={() => {
            setVid('T18-34K+300')
            setLocation('觸口（龍隱寺前）')
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: location == '觸口（龍隱寺前）' ? '#fff' : '#27335F' },
            ]}
          >
            {'觸口\n（龍隱寺前）'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: location == '石卓加油站前' ? '#27335F' : '#fff',
            },
          ]}
          onPress={() => {
            setVid('T18-60K+990')
            setLocation('石卓加油站前')
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: location == '石卓加油站前' ? '#fff' : '#27335F' },
            ]}
          >
            {'石卓加油站前'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                location == '阿里山國家森林遊樂區入口\n（阿里山轉運站）'
                  ? '#27335F'
                  : '#fff',
            },
          ]}
          onPress={() => {
            setVid('T18-88K+150')
            setLocation('阿里山國家森林遊樂區入口\n（阿里山轉運站）')
          }}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  location == '阿里山國家森林遊樂區入口\n（阿里山轉運站）'
                    ? '#fff'
                    : '#27335F',
              },
            ]}
          >
            {'阿里山國家森林遊樂區入口\n（阿里山轉運站）'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    textDecorationLine: 'underline',
    width: '90%',
    marginVertical: 8,
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    width: '80%',
    height: '20%',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  buttonText: {
    textAlign: 'center',
    color: '#27335F',
    fontSize: 17,
    fontWeight: '500',
  },
})

/* working area
觸口（龍隱寺前）：CCTV-56-0180-034-001、https://cctv-ss06.thb.gov.tw:443/T18-34K+300
石卓加油站前：CCTV-56-0180-060-001、https://cctv-ss06.thb.gov.tw:443/T18-60K+990
阿里山國家森林遊樂區入口（阿里山轉運站）：CCTV-56-0180-088-001、https://cctv-ss06.thb.gov.tw:443/T18-88K+150
*/
