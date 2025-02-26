import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

// icon 
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from '../../../../constants/color/Colors';

export default function ChatRoomHeader({user}) {
    const navigater = useNavigation();

    useEffect(() => {
        navigater.setOptions({ 
            title: '',
            headerLeft: () => (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => navigater.goBack()}>
                        <AntDesign name="back" size={24} color="black" /> 
                    </TouchableOpacity>


                    <View>
                        <Image style={{width: 35, height: 35, borderRadius: 20, marginLeft: 50}} 
                        
                        source={user? (
                            {uri: user?.item?.avatar?.uri}
                        ) : (
                            null
                        )}/>
                    </View>

                    <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, alignSelf: 'lelt', marginLeft: 20}}>
                            {user?.item?.last_name + ' ' + user?.item?.first_name}</Text>
                    </View>

                    <TouchableOpacity style={{alignSelf: 'center', marginRight: 10}}>
                        <FontAwesome5 name="phone" size={24} color={Colors.Green} />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigater]);
    

    return (
        <View>
            
        </View>
    )
}