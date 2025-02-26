import { View, Text } from 'react-native'
import React from 'react'
import { Colors } from '../../../../constants/color/Colors'

export default function MessageItem({message, currentUser}) {
    if (currentUser?.uid===message?.userId){
        // my message
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>

                </View>
                <View style={{borderWidth: 1, padding: 10, marginRight: 10, marginBottom: 10,
                    borderRadius: 15, backgroundColor: Colors.Green, borderColor: "white"
                }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{message?.text}</Text>
                </View>
            </View>
        )
    }
    else {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{borderWidth: 1, padding: 10, marginLeft: 10, marginBottom: 10,
                    borderRadius: 15, backgroundColor: 'white', borderColor: "white"
                }}>
                    <Text>{message?.text}</Text>
                </View>
            </View>
        )
    }
}