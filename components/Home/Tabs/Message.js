import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';;
import { useNavigation } from '@react-navigation/native';
import Styles from '../../../constants/styles/Styles';
import { Colors } from '../../../constants/color/Colors';


// Icon
import AntDesign from '@expo/vector-icons/AntDesign';
import MyContact from '../../../config/MyContact';
import Chat from './Message/Chat';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { userRef } from '../../../firebase.config';


export default function Profile() {

    const [user, dispatch] = useContext(MyContact);
    const [isFocused, setIsFocused] = useState(false);
    const navigater = useNavigation();
    const [messages, setMessages] = useState([]);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // console.log("hello");
        console.info(user?.user);
        if (user?.user?.uid){
            getUsers();
        }
    }, []);


    const getUsers = async() => {
        // query tất cả user trừ chính bản thân.

        const q = query(userRef, where('userId', '!=', user?.user?.uid));

        const querySnapShot = await getDocs(q);
        // console.info('snap shot: ', querySnapShot);

        let data = [];
        querySnapShot.forEach(t => {
            data.push({...t.data()});
        });
        // console.log('got users ', data);

        setUsers(data);
    }


    return (
        <View style={{ height: '100%', backgroundColor: "white", paddingTop: 15 }}>
            <View style={[{
                backgroundColor: "white", height: "10%", borderBottomLeftRadius: 15, borderBottomRightRadius: 15
            }, Styles.shadow]}>
                <View>
                    <View style={{
                        display: 'flex', flexDirection: 'row', alignContent: 'center', width: '100%',
                    }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{
                                textAlign: 'left', marginRight: 10, marginTop: 10, marginLeft: 10,
                                fontSize: 20, fontWeight: 'bold'
                            }}>Đoạn chat</Text>
                        </View>


                        <View style={{ width: '35%' }}>
                            <TouchableOpacity
                                onPress={() => navigater.navigate("Notification")}
                            >
                                <AntDesign name="hearto" size={24} color={"black"}
                                    style={{ textAlign: 'right', marginLeft: '48%', marginTop: 15 }} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[{
                            height: 30, width: 30, backgroundColor: "white", borderRadius: 10,
                            borderColor: Colors.LightGray, borderWidth: 3, marginTop: 10, marginLeft: 15
                        }]}
                            onPress={() => navigater.navigate('Profile')}>
                            <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }}
                                source={user?.user?.avatar_url ? (
                                    { uri: user?.user?.avatar_url }
                                ) : (
                                    require('./../../../assets/images/avatar1.png')
                                )} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ height: '90%', }}>
                <View style={{ flexDirection: 'row', height: '100%' }}>
                    <View style={[{ width: '70%', backgroundColor: Colors.SearchButton, height: '100%', borderTopLeftRadius: 15, marginTop: 10, borderBottomLeftRadius: 10, marginRight: 5 }, Styles.shadowRight]}>

                        {
                            users?.length > 0 ? (
                                <Chat users={users} currentUser={user?.user} />
                            ) : (
                                <View style={{marginTop: 30, flexDirection: 'row', width: '100%'}}>
                                    <ActivityIndicator size='small' color='white' marginTop='10' marginLeft='20' />
                                    
                                    <Text style={{color: "white", fontWeight: 'bold',
                                        justifyContent: 'center', alignSelf: 'center', 
                                        fontStyle: 'italic', fontSize: 20, marginLeft: 20,
                                    }}>Chưa có tin nhắn...</Text>
                                </View>
                            )
                        }
                    </View>



                    <View style={{ width: '20%', backgroundColor: 'white', height: '100%', padding: 10, borderTopRightRadius: 15, marginTop: 10 }}>

                    </View>
                </View>
            </View>
        </View>
    );
}