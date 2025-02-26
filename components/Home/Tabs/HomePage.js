import { Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, {useContext} from 'react'
import Slider from './HomePage/Slider'
import { useNavigation } from '@react-navigation/native';

import { Colors } from './../../../constants/color/Colors';
import Styles from '../../../constants/styles/Styles';

// Icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Voucher from './HomePage/Voucher';
import MyContact from '../../../config/MyContact';


export default function HomePage() {

    const [user, dispatch] = useContext(MyContact);

    const navigater = useNavigation();

    const loadDiscountPost = () => {
        return (
            <TouchableOpacity style={{ borderRadius: 15, marginBottom: 5, marginR: 5,
                backgroundColor: "white", 
                minHeight: 100, maxHeight: 220, 
                width: 140,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                elevation: 7,
                alignItems: 'center',
                position: 'relative',
                marginRight: 10,
            }}
                
            >
                <View style={{ flexDirection: 'column' }}>
                    <TouchableOpacity style={[{
                        height: 100, width: 100, backgroundColor: "white", margin: 5, borderRadius: 10,
                        borderColor: Colors.LightGray, borderWidth: 3,
                    }]}
                    >
                        <Image style={{ width: 95, height: 95, borderRadius: 10, alignSelf: 'center' }}
                            source={require('./../../../assets/images/house3.png')} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontWeight: 'bold' }}>Tên Phòng Thuê</Text>
                        <Text style={{ fontSize: 10 }}>Mô tả</Text>
                        <Text style={{ fontWeight: 'bold', color: Colors.SearchButton }}>Giá</Text>
                        <Text style={{ fontSize: 10 }}>Địa điểm</Text>

                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ width: '20%' }}>
                                <TouchableOpacity style={[{
                                    height: 30, width: 30, backgroundColor: "white", margin: 5, borderRadius: 10,
                                    borderColor: Colors.LightGray, borderWidth: 3
                                }]}>
                                    <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }}
                                        
                                        source={user?.user?.avatar_url? (
                                            {uri: user?.user?.avatar_url}
                                        ) : (
                                            require('./../../../assets/images/avatar1.png')
                                        )} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '50%' }}>
                            </View>

                            <TouchableOpacity>
                                <AntDesign style={{ marginTop: 10 }}
                                    name="hearto" size={24} color="tomato" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ height: "100%", paddingTop: 20, }}>
            <View style={[{ 
                backgroundColor: "white", marginLeft: 15, marginRight: 10, height: "10%", borderBottomLeftRadius: 15, borderBottomRightRadius: 15
            }, Styles.shadow]}>
                <View>
                    <View style={{ 
                        display: 'flex', flexDirection: 'row', alignContent: 'center', width: '100%',
                    }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{
                                textAlign: 'left', marginRight: 10, marginTop: 10, marginLeft: 10,
                                fontSize: 20, fontWeight: 'bold'
                            }}>Trang chủ</Text>
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
                            onPress={()=> navigater.navigate('Profile')}>
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



            <View style={{ height: '90%' }}>
                <View style={{height: "23%",}}>
                    <Slider />
                </View>

                <View style={{height: "77%", marginTop: -8 }}>

                    <View style={{ height: '33%', backgroundColor: "white", marginLeft: 15, marginRight: 10, borderRadius: 10, marginBottom: 10, paddingTop: 6, alignItems: 'center'}}>
                        <Voucher/>
                    </View>



                    <View style={{ backgroundColor: "white", marginLeft: 15, marginRight: 10, height: '70%', borderRadius: 15, paddingLeft: 5 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 10}}>
                            {loadDiscountPost()}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>

    )
}