import React, { useEffect, useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';;
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
import MyContact from '../../../../config/MyContact';

import APIs, { endpoints } from '../../../../config/APIs';
import PopUpMenuCity from '../Discover/PopUpMenuCity';

// Style and Colors
import Styles from './../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

// Icon
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { RichTextEditor } from './RichTextEditor';
import { getToken } from '../../../../utils/storage';

const CreatePost = () => {

    const navigater = useNavigation();
    const [user, dispatch] = useContext(MyContact);

    const [isMenuCityClick, setIsMenuCityClick] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState([]);

    const toggleCityMenu = () => { setIsMenuCityClick(!isMenuCityClick) }

    const handleSelectCity = (value) => {

        console.log('Selected Role:', value); // Log the selected value
        if (type === "city") {
            setSelectedCity(value); // Update the selected value
            setSelectedDistrict("");
            changed("city", value);
        }
        else if (type === "district") {
            setSelectedDistrict(value);
            setSelectedWard("");
            changed("district", value);
        }
        else {
            setSelectedWard(value);
            changed("ward", value);
        }
    };

    const [post, setPost] = useState({
        "user_id": user.user.id,

        "title": "",
        "content": "",
        "price": "",
        "city": "",
        "district": "",
        "ward": "",
        "detail_address": "",
        "is_active": true,
    });

    const changed = (field, value) => {
        setPost(current => {
            // [field] : lấy giá trị của first_name bỏ vô, nếu không có [] thì nó lấy chữ field.
            // [] : array destructering.
            return { ...current, [field]: value }
        })
    }

    const postFindRoom = async () => {
        let form = new FormData();

        // 'in' là duyệt qua từng key
        // 'of' là duyệt qua từng value
        for (let key in post) {
            form.append(key, post[key]);
        }

        console.info(post);

        try {
            setLoading(true);
            const token = await getToken();
            let res = await APIs.post(endpoints['find-room-post'], form, {
                // đối với upload tập tin cần phải có content type.
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                },
                timeout: 5000,

            });

            navigater.goBack();
        } catch (ex) {
            if (ex?.response?.data)
                Alert.alert("Lỗi điền thông tin", "Vui lòng nhập đầy đủ thông tin còn trống !");
            setError(ex?.response?.data);
        } finally {
            setLoading(false); // Stop loading
        }
    }

    useEffect(() => {
        navigater.setOptions({
            headerShown: false, // Tắt header trên màn hình chính
        });
    }, []);


    return (
        <View style={{ backgroundColor: "white" }}>
            <View style={[{ flexDirection: 'row', marginTop: 30, marginLeft: 20, justifyContent: 'space-between' }]}>
                <TouchableOpacity onPress={() => { navigater.goBack() }}>
                    <AntDesign name="back" size={24} color="black"
                        style={[Styles.buttonBack, { padding: 2 }]}
                    />
                </TouchableOpacity>

                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginLeft: -20 }}>
                    Create Post
                </Text>

                <View></View>
            </View>

            <ScrollView>
                <View>
                    <View style={{ padding: 20, maxHeight: '30%', justifyContent: 'flex-start', }}>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10 }}>
                            <View>
                                <Image source={user ?
                                    (
                                        { uri: user.user.avatar_url }
                                    ) : (
                                        require('./../../../../assets/images/avatar1.png')
                                    )}
                                    style={[Styles.avatar, { width: '100%', marginLeft: 0, marginTop: 0, padding: 20 }]} />
                            </View>

                            <View>
                                <Text style={{ fontWeight: '500' }}>
                                    {user ? user.user.first_name + ' ' + user.user.last_name : "User Name"}
                                </Text>

                                <Text style={{ fontSize: 10 }}>
                                    Public
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 20, fontWeight: 'bold', marginBottom: 10 }}>Nhập thông tin bài đăng:</Text>
                        <FontAwesome5 name="slack-hash" size={18} color={Colors.Red} style={{ marginLeft: 10 }} />
                    </View>
                    <View style={{ justifyContent: 'space-between' }}>
                        <TextInput value={post.title} onChangeText={t => changed("title", t)}
                            style={[Styles.inputBorder, {
                                marginRight: 20, marginLeft: 20,
                                borderColor: post?.title || error?.title ? "red" : "lightgrey",
                            }]}
                            placeholder="Tiêu đề tin đăng ..."
                        />
                        <TextInput value={post.content} onChangeText={t => changed("content", t)}
                            style={[Styles.richBar, { margin: 20, marginRight: 20, 
                                borderColor: post?.content || error?.content? "red" : "lightgray", 
                            }]}
                            placeholder="Mô tả ..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginTop: 10, marginLeft: 20, fontWeight: 'bold' }}>Nhập giá phòng bạn mong muốn:</Text>
                        <FontAwesome5 name="slack-hash" size={18} color={Colors.Red} style={{ marginLeft: 10, marginTop: 10 }} />
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 20 }}>
                        <View style={{ width: 150, marginRight: 15, marginLeft: 20 }}>
                            <TextInput value={post.price} onChangeText={t => changed("price", t)}
                                style={[Styles.inputBorder, { paddingLeft: 10, borderColor: post?.price || error?.price? "red" : "lightgrey" }]} placeholder='Giá'></TextInput>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginTop: 10, marginLeft: 20, fontWeight: 'bold' }}>Nhập địa chỉ bạn muốn tìm phòng:</Text>
                        <FontAwesome5 name="slack-hash" size={18} color={Colors.Red} style={{ marginLeft: 10, marginTop: 10 }} />
                    </View>

                    <TouchableOpacity style={[Styles.input, { marginBottom: 5, height: 40, borderColor: post?.city || error?.city? "red" : "lightgrey", marginRight: 15, marginLeft: 20 }]}
                        onPress={() => { setType("city"); toggleCityMenu(); }}
                    >
                        <Text>{selectedCity ? selectedCity : "Chọn thành phố, tỉnh thành"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[Styles.input, { marginBottom: 5, height: 40,borderColor: post?.district || error?.district? "red" : "lightgrey", marginRight: 15, marginLeft: 20 }]}
                        disabled={selectedCity ? false : true}
                        onPress={() => { setType("district"); toggleCityMenu(); }}
                    >
                        <Text style={{ color: selectedCity ? "black" : "gray" }}>{selectedDistrict ? selectedDistrict : "Chọn quận, huyện"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[Styles.input, { marginBottom: 5, height: 40, borderColor: post?.ward || error?.ward? "red" : "lightgrey", marginRight: 15, marginLeft: 20 }]}
                        disabled={selectedDistrict ? false : true}
                        onPress={() => { setType("ward"); toggleCityMenu(); }}
                    >
                        <Text style={{ color: selectedDistrict ? "black" : "gray" }}>{selectedWard ? selectedWard : "Chọn khu vực"}</Text>
                    </TouchableOpacity>

                    <View style={{}}>
                        <TextInput value={post.detail_address} onChangeText={t => changed("detail_address", t)}
                            style={[Styles.input, { paddingLeft: 10, marginLeft: 20, marginRight: 15, borderColor: post?.detail_address || error?.detail_address? "red" : "lightgrey" }]} placeholder='Nhập địa chỉ cụ thể'></TextInput>
                    </View>

                    <PopUpMenuCity
                        isVisible={isMenuCityClick}
                        onClose={toggleCityMenu}
                        onOptionSelect={handleSelectCity}
                        type={type}
                        selectedCity={selectedCity}
                        selectedDistrict={selectedDistrict}
                    />


                    <TouchableOpacity
                        onPress={postFindRoom}
                    >

                        <View style={[Styles.button, { justifyContent: 'flex-end' }]}>
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.White} />
                            ) : (
                                <Text style={{
                                    color: Colors.White, fontSize: 15, fontWeight: 'bold',
                                    textAlign: 'center',
                                }}>Post</Text>
                            )}
                        </View>
                    </TouchableOpacity>


                    <View style={{ padding: 20, height: 100 }}>

                    </View>
                </View>
            </ScrollView>

        </View>
    );
}

export default CreatePost;