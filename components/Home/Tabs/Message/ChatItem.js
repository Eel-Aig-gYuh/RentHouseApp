import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';
import { useNavigation } from '@react-navigation/native';
import { getRoomId } from '../../../../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../../firebase.config';

// Format date
import moment from 'moment';
import 'moment/locale/vi';

export default function ChatItem({ item, index, currentUser }) {
    const navigater = useNavigation();
    const [messages, setMessages] = useState(undefined);


    // console.info(item?.userId);
    useEffect(() => {
        
        let roomId = getRoomId(currentUser?.uid, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessages(allMessages[0] ? allMessages[0] : null);
        });

        return unsub;
    }, []);

    // console.log(messages);

    const renderLastMesage = () => {
        if (typeof messages === 'undefined') return 'Loading ...';
        if (messages) {
            if (currentUser?.uid === messages?.userId) {
                return `Bạn: ${messages?.text}`;
            }
            return messages?.text;
        } 
        else {
            return 'Gửi lời chào ...'
        }
    }
    
    const renderTime = () => {
        const timestamp = messages?.createdAt.seconds * 1000 + messages?.createdAt.nanoseconds / 1000000;
        return moment(timestamp).fromNow();
    }


    const openChatRooms = () => {
        navigater.navigate('ChatRoom', { item });
    }

    return (
        <TouchableOpacity onPress={() => openChatRooms()} style={[{ backgroundColor: 'white', width: '100%', height: 50, marginTop: 10, borderTopRightRadius: 15 }, Styles.shadow]}>
            <View style={{ flexDirection: 'row' }}>
                <View style={[{
                    height: 30, width: 30, backgroundColor: "white", borderRadius: 10,
                    borderColor: Colors.LightGray, borderWidth: 3, marginTop: 9, marginLeft: 10
                }]}>
                    <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }}
                        source={item?.avatar?.uri ? (
                            { uri: item?.avatar?.uri }
                        ) : (
                            require('./../../../../assets/images/avatar1.png')
                        )} />
                </View>


                <View style={{ flexDirection: 'column', marginTop: 7, alignContent: 'center', marginLeft: 20, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.last_name + ' ' + item?.first_name}</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'italic' }}>{renderLastMesage()}</Text>
                </View>

                <View style={{ alignSelf: 'center', marginRight: 10}}>
                    <Text style={{ fontSize: 10, }}>{renderTime()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}