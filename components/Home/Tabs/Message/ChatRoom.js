import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatRoomHeader from './ChatRoomHeader';
import MessageList from './MessageList';

// icon 
import FontAwesome from '@expo/vector-icons/FontAwesome';

import CustomKeyboardView from './CustomKeyboardView';
import MyContact from '../../../../config/MyContact';
import { getRoomId } from '../../../../utils/common';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase.config';

// Format date
import moment from 'moment';
import 'moment/locale/vi';
import { Colors } from '../../../../constants/color/Colors';
import { Keyboard } from 'react-native';

export default function ChatRoom({ route }) {
    const item = route.params;

    const [user, dispatch] = useContext(MyContact);
    // console.info('From Chat room: ', user?.user?.uid);


    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createRoomIfNotExists();

        let roomId = getRoomId(user?.user?.uid, item?.item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc=>{
                return doc.data();
            });
            setMessages([...allMessages]);
        });

        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )
        return () => {
            unsub();
            KeyboardDidShowListener.remove();
        }
    }, []); 

    useEffect(() => {
        updateScrollView();
    }, [messages]);

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({animated: true});
        }, 100);
    }

    const createRoomIfNotExists = async() => {
        // room id
        let roomId = getRoomId(user?.user?.uid, item?.item?.userId);

        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    // console.info('user info: ', user?.user?.avatar_url);

    const handleSendMessage = async() => {
        let message = textRef.current.trim();

        if (!message){
            return;
        }

        try{
            let roomId = getRoomId(user?.user?.uid, item?.item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if (inputRef){
                inputRef?.current?.clear();
            }

            const newDoc = await addDoc(messagesRef, {
                userId: user?.user?.uid,
                text: message,
                profileUrl: user?.user?.avatar_url,
                senderName: user?.user?.last_name + ' ' + user?.user?.first_name,
                createdAt: Timestamp.fromDate(new Date())
            });

            console.log('new message id: ', newDoc?.id);

        } catch (ex) {
            Alert.alert('Message', ex.message);
        }
    }

    // console.info('message: ', messages);

    return (
        <CustomKeyboardView inChat={true}>
            <View style={{ flex: 1, backgroundColor: Colors.Red }}>
                <ChatRoomHeader user={item} />
                
                <View style={{ flex: 1 }}>
                    <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user?.user} />
                </View>

                
                
                <View style={{ }}>
                    <View style={{
                        borderWidth: 2, borderColor: "lightgray", borderRadius: 15, margin: 5,
                        backgroundColor: 'white', minHeight: 45, maxHeight: 90, flexDirection: 'row'
                    }}>
                        <TextInput style={{ fontSize: 14, flex: 1, }}
                            ref={inputRef}
                            onChangeText={t => textRef.current = t}
                            placeholder='Aaa ...'
                            multiline={true}
                            numberOfLines={3}
                        />

                        <TouchableOpacity onPress={handleSendMessage}
                        
                        style={{
                            alignSelf: 'center', marginRight: 10, backgroundColor: 'lightgrey', width: 30, height: 30, borderRadius: 20,
                            justifyContent: 'center',
                        }}>
                            <FontAwesome name="send-o" size={20} color="gray" style={{ padding: 2 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}