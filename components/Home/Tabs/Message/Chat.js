import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';;
import { useNavigation } from '@react-navigation/native';


// Icon
import MyContact from '../../../../config/MyContact';
import ChatItem from './ChatItem';


export default function Chat({users, currentUser}) {

    const [user, dispatch] = useContext(MyContact);
    const [isFocused, setIsFocused] = useState(false);
    const navigater = useNavigation();
    const [messages, setMessages] = useState([]);

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={users}
                contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
                keyExtractor={item => Math.random()}
                showsVerticalScrollIndicator={false}

                renderItem={({item, index}) => 
                    <ChatItem 
                        item={item} 
                        index={index} 
                        currentUser={currentUser}
                    />}
            />
        </View>
    );
}