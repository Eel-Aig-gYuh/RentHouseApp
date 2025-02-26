import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

// icon
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Import các màn hình
import Discover from './Tabs/Discover';
import Profile from './Tabs/Profile';
import Social from './Tabs/Social';
import Message from './Tabs/Message';
import HomePage from './Tabs/HomePage';

const Home = () => {
    const navigation = useNavigation();
    const Tabs = createBottomTabNavigator();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // Tắt header trên màn hình chính
        });
    }, []);

    return (
        <Tabs.Navigator
            initialRouteName="HomePage" // Set tab mặc định khi mở
            screenOptions={{
                headerShown: false, // Tắt header trên từng tab
                tabBarActiveTintColor: 'tomato', // Màu tab đang chọn
                tabBarInactiveTintColor: 'gray', // Màu tab không được chọn
            }}
        >

            <Tabs.Screen
                name="HomePage"
                component={HomePage} // Sử dụng component từ file HomePage.js
                options={{
                    tabBarLabel: 'HomePage',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="apartment" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Discover"
                component={Discover} // Sử dụng component từ file Discover.js
                options={{
                    tabBarLabel: 'Discover',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6 name="earth-americas" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Social"
                component={Social} // Sử dụng component từ file Social.js
                options={{
                    tabBarLabel: 'Social',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => (
                        <SimpleLineIcons name="social-github" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Message"
                component={Message} // Sử dụng component từ file Message.js
                options={{
                    tabBarLabel: 'Message',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="message-text-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="Profile"
                component={Profile} // Sử dụng component từ file Profile.js
                options={{
                    tabBarLabel: 'Profile',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="profile" size={24} color={color} />
                    ),
                }}
            />
        </Tabs.Navigator>
    );
};

export default Home;