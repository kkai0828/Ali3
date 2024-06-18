import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs, useRouter } from 'expo-router'
import { Pressable, TouchableOpacity } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const router = useRouter()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { height: 100 },
      }}
    >
      <Tabs.Screen
        name="cctv"
        options={{
          title: '即時影像',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="video-camera" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '時刻表',
          tabBarIcon: ({ color }) => <TabBarIcon name="train" color={color} />,
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: '目前天氣',
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="sun-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          title: '查詢結果',
          href: null,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                borderRadius: 40,
                left: '10%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => router.navigate('./../')}
            >
              <FontAwesome
                name="angle-left"
                size={30}
                color="black"
                style={{ marginRight: 2 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  )
}
