import React from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  Dimensions,
  Button,
} from 'react-native'
import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'

export default function CCTV() {
  const [vid, setVid] = React.useState("T18-88K+150")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>即時影像</Text>
      <Image
        style={{width: Dimensions.get("window").width * 0.9, height: Dimensions.get("window").width * 0.675}}
        source={{
          uri: `https://cctv-ss06.thb.gov.tw:443/${vid}`,
          cache: "reload",
        }}
      />
      <Text style={styles.title}>道路位置</Text>
      <View style={{width: "90%", backgroundColor: "unset", marginVertical: 12}}>
        <Button
          title="觸口（龍隱寺前）"
          onPress={() => setVid("T18-34K+300")}
        />
        <View style={{marginVertical: 8, backgroundColor: "unset"}}></View>
        <Button
          title="石卓加油站前"
          onPress={() => setVid("T18-60K+990")}
        />
        <View style={{marginVertical: 8, backgroundColor: "unset"}}></View>
        <Button
          title="阿里山國家森林遊樂區入口（阿里山轉運站）"
          onPress={() => setVid("T18-88K+150")}
        />
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
    width: '90%',
    marginVertical: 12,
    padding: 8,
    backgroundColor: "navy",
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
  }
})

/* working area
觸口（龍隱寺前）：CCTV-56-0180-034-001、https://cctv-ss06.thb.gov.tw:443/T18-34K+300
石卓加油站前：CCTV-56-0180-060-001、https://cctv-ss06.thb.gov.tw:443/T18-60K+990
阿里山國家森林遊樂區入口（阿里山轉運站）：CCTV-56-0180-088-001、https://cctv-ss06.thb.gov.tw:443/T18-88K+150
*/
