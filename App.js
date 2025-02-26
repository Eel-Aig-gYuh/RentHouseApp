import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useState } from 'react';

// gọi component
import SplashScreen from './components/SplashScreen';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Home from './components/Home/Home';
import ProfileDetail from './components/Home/Tabs/Profile/ProfileDetail'
import CreatePost from './components/Home/Tabs/Social/CreatePost'
import RichTextEditor from './components/Home/Tabs/Social/RichTextEditor';
import CreateNew from './components/Home/Tabs/Discover/CreateNew';
import RentPostDetail from './components/Home/Tabs/Discover/RentPostDetail';
import Notification from './components/Home/Tabs/Notification';

import AdminPage from './components/Admin/AdminPage'
import PostReview from './components/Admin/PostReview';
import Statistics from './components/Admin/Statictis';
import ChatRoom from './components/Home/Tabs/Message/ChatRoom';

// gọi tab

// gọi APIs 

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyContact, { AuthProvider } from './config/MyContact';
import MyUserReducer from './reducers/MyUserReducer';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (

    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen}></Stack.Screen>

      <Stack.Screen name="Login" component={Login}></Stack.Screen>
      <Stack.Screen name="Register" component={Register}></Stack.Screen>

      {/* Tabs Components */}
      <Stack.Screen name="Home" component={Home}></Stack.Screen>

      <Stack.Screen name="ProfileDetail" component={ProfileDetail}></Stack.Screen>
      <Stack.Screen name="CreatePost" component={CreatePost}></Stack.Screen>
      <Stack.Screen name="RichTextEditor" component={RichTextEditor}></Stack.Screen>
      <Stack.Screen name="CreateNew" component={CreateNew}></Stack.Screen>
      <Stack.Screen name="RentPostDetail" component={RentPostDetail}></Stack.Screen>
      <Stack.Screen name="Notification" component={Notification}></Stack.Screen>
      <Stack.Screen name="ChatRoom" component={ChatRoom}></Stack.Screen>

      {/* Admin Components */}
      <Stack.Screen name="AdminPage" component={AdminPage}></Stack.Screen>
      <Stack.Screen name="PostReview" component={PostReview}></Stack.Screen>
      <Stack.Screen name="Statistics" component={Statistics}></Stack.Screen>


    </Stack.Navigator>


  );
}


export default function App() {

  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyContact.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </MyContact.Provider>
  );
}
