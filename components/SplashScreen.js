import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Styles from '../constants/styles/Styles';
import { Colors } from '../constants/color/Colors';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen(){

    const navigater = useNavigation();

    return (
        <View >
            <Image style={Styles.imgs} 
            source={require('./../assets/images/house1.png')}></Image>

            <View style={Styles.container}>
                <Text style={Styles.txt_title}> AI Rent House</Text>

                <Text style={[Styles.txt_content, {justifyContent: 'center'}]}>Tìm nhà dễ dàng, thuê nhà nhanh chóng! Ứng dụng thuê nhà với hàng ngàn lựa chọn, bộ lọc thông minh, và hỗ trợ trực tuyến. Chỉ cần vài thao tác, bạn sẽ tìm được nơi ở lý tưởng.</Text>
            
            <TouchableOpacity style={[Styles.button, {marginTop: '25%'}]}
                onPress={()=> navigater.navigate('Login')}    
            >
                <Text style={{textAlign: 'center', color: Colors.White, fontWeight: 'bold'}}>
                    Bắt Đầu !
                </Text>
            </TouchableOpacity>
            
            
            </View>
        </View>
    );
}