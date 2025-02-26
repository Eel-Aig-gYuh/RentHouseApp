import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Styles from '../../../../constants/styles/Styles';
import Colors from '../../../../constants/color/Colors';

// icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Octicons from '@expo/vector-icons/Octicons';

export default function Discover(){

    const navigater = useNavigation();
    const onPickImage = async () => {

    }

    useEffect(()=>{
            navigater.setOptions({
                headerShown: false
            })
        }, [])

    return (
        <View style={{backgroundColor: "white"}}>
            <View style={[{flexDirection: 'row', marginTop: 20, marginLeft: 20, justifyContent: 'space-between'}]}>
                <TouchableOpacity onPress={()=>{navigater.goBack()}}>
                    <AntDesign name="back" size={24} color="black" 
                        style={[Styles.buttonBack, {padding: 2}]}
                    />
                </TouchableOpacity>

                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginLeft: -20}}>
                    Profile Detail
                </Text>

                <View></View>
            </View>

            <View style={{padding: 20}}> 
                <View style={{flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
                    <View style={{width: '100%'}}>
                        <View></View>

                        <Image source={require('./../../../../assets/images/avatar1.png')} 
                        style={[Styles.avatar, {alignSelf: 'center', width: '100%', marginLeft: 0, marginTop: 0}]}/>

                        <TouchableOpacity
                            onPress={() => navigater.navigate(onPickImage)}>
                                <Feather name="camera" size={20} color="black" style={[Styles.editIcon, {marginLeft: 70}]}/>
                        </TouchableOpacity>

                        <Text style={{marginTop: 0, fontSize: 15, fontWeight: 'bold', textAlign: 'center', paddingLeft: 0, marginLeft: -20}}>Full Name</Text>
                    
                        <View style={{paddingTop: 20, marginLeft: -10, fontSize: 14}}> 
                            <Text style={{color: "gray"}}>Please Fill Your Infomation</Text>

                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name="person-outline" size={24} color="gray"
                                style={{marginTop: 13, marginLeft: '10' }}/>
                                <TextInput
                                    placeholder='Enter Your Name'
                                    style={[Styles.input, {marginLeft: -40, width: '100%', paddingLeft: 50}]}
                                />
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <SimpleLineIcons name="phone" size={24} color="gray"
                                style={{marginTop: 13, marginLeft: '10' }}/>
                                <TextInput
                                    placeholder='Enter Your Phone Number'
                                    style={[Styles.input, {marginLeft: -40, width: '100%', paddingLeft: 50}]}
                                />
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <Octicons name="location" size={24} color="gray"
                                style={{marginTop: 13, marginLeft: '14' }}/>
                                <TextInput
                                    placeholder='Enter Your Address'
                                    style={[Styles.input, {marginLeft: -40, width: '100%', paddingLeft: 50}]}
                                />
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top" 
                                    placeholder='Enter Your Bio'
                                    style={[Styles.input,
                                        {marginLeft: -5, width: '100%', paddingLeft: 15, paddingBottom: 50}]}
                                />
                            </View>

                            <TouchableOpacity style={[Styles.button, {marginTop: 0, marginLeft: 10, marginRight: 10}]}
                                onPress={() => navigater.goBack()}
                            >
                                <Text style={{color: "white", fontWeight: 'bold', textAlign: 'center'}}>Update Your Infomation</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        
    );
}