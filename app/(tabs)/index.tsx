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

export default function TimeTableScreen() {
  const [startingStation, setStartingStation] = React.useState<string>('嘉義')
  const [endingStation, setEndingStation] = React.useState<string>('祝山')
  const [startingStationTmp, setStartingStationTmp] =
    React.useState<string>('嘉義')
  const [endingStationTmp, setEndingStationTmp] = React.useState<string>('祝山')
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)

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
                },
              })
            }}
          >
            <Text style={styles.buttonText}>查詢</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
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
