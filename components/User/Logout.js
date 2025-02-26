import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import MyContact from '../../config/MyContact'

export default function Logout() {
  const [user, dispatch] = useContext(MyContact);

  return (
    <View>
      <Text>Logout</Text>
    </View>
  )
}