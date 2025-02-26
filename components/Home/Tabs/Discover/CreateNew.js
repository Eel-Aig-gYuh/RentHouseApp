import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Style and Colors
import Styles from './../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

// Icon
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import PopUpMenuCity from './PopUpMenuCity';
import * as ImagePicker from 'expo-image-picker';

// currency
import currency from 'currency.js';
import { getToken } from '../../../../utils/storage';
import APIs, { endpoints } from '../../../../config/APIs';

const CreateNew = () => {
    const navigater = useNavigation();

    useEffect(() => {
        navigater.setOptions({
            headerShown: false,
        });

    }, []);

    // image
    const [isImage, setIsImage] = useState(true);
    const [image, setImage] = useState([]);

    const [loading, setLoading] = useState(false);
    const [isMenuCityClick, setIsMenuCityClick] = useState(false);

    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [type, setType] = useState("");

    const toggleCityMenu = () => {setIsMenuCityClick(!isMenuCityClick)}

    const handleSelectCity = (value) => {
        
        console.log('Selected Role:', value); // Log the selected value
        if (type==="city") {
            setSelectedCity(value); // Update the selected value
            setSelectedDistrict("");
            changed("city", value);
        }
        else if (type==="district"){
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
        "city": "",
        "district": "",
        "ward": "",
        "detail_address": "",
        "price": "",
        "area": "",
        "title": "",
        "content": "",
        "images": [],
        "max_occupants": "",
        "status": "Pending",
    });

    const changed = (field, value) => {
        setPost(current => {
            // [field] : lấy giá trị của first_name bỏ vô, nếu không có [] thì nó lấy chữ field.
            // [] : array destructering.
            return { ...current, [field]: value }
        })
    }

    // image 
    const updateImages = (newImages) => {
        setPost(current => ({
            ...current,
            images: [...current.images, ...newImages],
        }));
    };

    const removeImage = (imageUri) => {
        setPost((current) => ({
            ...current,
            images: current.images.filter((img) => img !== imageUri),
        }));
    };
    
    const picker = async () => {
        // xin quyền truy cập ảnh.
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted')
            alert("Permission Denied !");
        else {
            let res
            if (isImage){
                res = await ImagePicker.launchImageLibraryAsync({
                    allowsMultipleSelection: true,
                });
            }
            else {
                res = await ImagePicker.launchCameraAsync({
                    allowsMultipleSelection: true,
                });
            }

            if (!res.canceled) {
                const selectedImages = res.assets.map((asset) => ({
                    uri: asset.uri,
                }));
                updateImages(selectedImages);
                console.info(post.images);
            }
        }
    }

    const renderSelectedImages = () => (
        <FlatList
            data={post.images}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={{ backgroundColor: 'white', height: 102, width: 102, marginRight: 10, borderRadius: 10 }}>
                    <Image
                        source={{ uri: item?.uri }}
                        style={{
                            width: 100, height: 100,
                            borderRadius: 10,
                            alignSelf: 'center', marginTop: 1,
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => removeImage(item)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            borderRadius: 50,
                        }}
                    >
                        <AntDesign name="closesquare" size={20} color={Colors.Red} backgroundColor="white" />
                    </TouchableOpacity>
                </View>
            )}
        />
    );

    const postThePost = async () => {
        let form = new FormData();
                
        for (let key in post) {
            if (key === 'images') {
                // Handle multiple images
                if (Array.isArray(post.images)) {
                    post.images.forEach((image, index) => {
                        const { uri, fileName, mimeType } = image;
    
                        if (uri) {
                            form.append(`images[${index}]`, {
                                uri,
                                name: fileName || `image_${index + 1}.jpg`,
                                type: mimeType || 'image/jpeg',
                            });
                        }
                    });
                }
            } else {
                form.append(key, post[key]);
            }
        }

        console.info(form);

        console.info(post);

        try {
            setLoading(true);
            const token = await getToken();

            let res = await APIs.post(endpoints['rental-post'],
                form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data',
                    timeout: 5000,
                }
            });
            console.info(res.data);

            navigater.goBack();
        } catch (ex) {
            // console.error("Lỗi: ", ex);

            // console.info("loi post: ", ex.status);

            // console.info("loi hinh: ", );

            if (ex.response?.data?.images) {
                Alert.alert('Sai quy định !', ex.response?.data?.images.toString());
            }
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const renderContent = () => (
        <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{marginTop: 10, marginLeft: 20, fontWeight: 'bold'}}>Nhập Địa Chỉ:</Text>
                <FontAwesome5 name="slack-hash" size={18} color={Colors.Red} style={{ marginLeft: 10, marginTop: 9 }} />
            </View>

            <TouchableOpacity style={[Styles.input, { marginBottom: 5, height: 40, borderColor: "lightgrey", marginRight: 15, marginLeft: 20}]}
                onPress={() => { setType("city"); toggleCityMenu(); }}
            >
                <Text>{selectedCity? selectedCity: "Chọn thành phố, tỉnh thành"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[Styles.input, { marginBottom: 5, height: 40, borderColor: "lightgrey", marginRight: 15, marginLeft: 20}]}
                disabled={selectedCity? false: true}
                onPress={() => { setType("district"); toggleCityMenu(); }}
            >
                <Text style={{color: selectedCity? "black" : "gray"}}>{selectedDistrict? selectedDistrict: "Chọn quận, huyện"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[Styles.input, { marginBottom: 5, height: 40, borderColor: "lightgrey", marginRight: 15, marginLeft: 20}]}
                disabled={selectedDistrict? false: true}
                onPress={() => { setType("ward"); toggleCityMenu(); }}
            >
                <Text style={{color: selectedDistrict? "black" : "gray"}}>{selectedWard? selectedWard: "Chọn khu vực"}</Text>
            </TouchableOpacity>

            <View style={{ }}>
                <TextInput value={post.detail_address} onChangeText={t => changed("detail_address", t)}
                    style={[Styles.input, { paddingLeft: 10, marginLeft: 20, marginRight: 15, borderColor: "lightgrey"}]} placeholder='Nhập địa chỉ cụ thể'></TextInput>
            </View>
            
            <PopUpMenuCity
                isVisible={isMenuCityClick}
                onClose={toggleCityMenu}
                onOptionSelect={handleSelectCity}
                type={type}
                selectedCity={selectedCity}
                selectedDistrict={selectedDistrict}
            />
            

            <View style={{flexDirection: 'row'}}>
                <Text style={{marginTop: 10, marginLeft: 20, fontWeight: 'bold'}}>Nhập Giá Và Diện Tích:</Text>
                <FontAwesome5 name="slack-hash" size={18} color={Colors.Red} style={{ marginLeft: 10, marginTop: 9 }} />
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{width: 100, marginRight: 15, marginLeft: 20}}>
                    <TextInput value={post.price} onChangeText={t => changed("price", t)}
                        style={[Styles.inputBorder, {paddingLeft: 10}]} placeholder='Giá'></TextInput>
                </View>

                <View style={{width: 100, flexDirection: 'row'}}>
                    <TextInput value={post.area} onChangeText={t => changed("area", t)}
                        style={[Styles.inputBorder, {paddingLeft: 10}]} placeholder='Diện tích'></TextInput>
                    <Text style={{alignSelf: 'center', marginRight: 15, fontStyle: 'italic', fontWeight : 'bold', color: 'gray'}}> / m² </Text>
                </View>

            </View>

            <View style={{ width: 'auto', marginTop: 10, marginRight: 15, marginLeft: 20 }}>
                <TextInput value={post.max_occupants} onChangeText={t => changed("max_occupants", t)}
                    style={[Styles.inputBorder, { paddingLeft: 10 }]} placeholder='Số người ở tối đa'></TextInput>
            </View>

            <View style={{flexDirection: 'row'}}>
                <Text style={{marginTop: 10, marginLeft: 20, fontWeight: 'bold'}}>Nhập Nội Dung Tin Đăng:</Text>
                <FontAwesome5 name="slack-hash" size={18} color={Colors.Red} style={{ marginLeft: 10, marginTop: 9 }} />
            </View>

            <View style={{ marginTop: 10, justifyContent: 'space-between' }}>
                <TextInput value={post.title} onChangeText={t => changed("title", t)}
                    style={[Styles.inputBorder, { marginRight: 20, marginLeft: 20 }]}
                    placeholder="Tiêu đề tin đăng ..."
                />
                <TextInput value={post.content} onChangeText={t => changed("content", t)}
                    style={[Styles.richBar, { margin: 20, marginRight: 20, borderColor: "lightgray" }]}
                    placeholder="Mô tả ..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>

            

            <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 15, borderColor: Colors.LightGray,
                marginLeft: 20, marginRight: 20,
            }}>
                <Text
                    style={[
                        { paddingTop: 10, paddingBottom: 10, flex: 1, paddingLeft: 10 },
                        { textAlign: 'left', fontWeight: 'bold' },
                    ]}
                >
                    Thêm ít nhất 3 hình hoặc video
                </Text>
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={() => {setIsImage(true); picker();}}>
                        <Feather name="camera" size={24} color="black" style={{ marginTop: 10, marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setIsImage(true); picker();}}>
                        <FontAwesome6 name="images" size={24} color="black" style={{ marginTop: 10, marginRight: 20}} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{marginTop: 20, marginLeft: 15}}>
                {post.images.length > 0 && renderSelectedImages()}
            </View>

            <TouchableOpacity onPress={postThePost}>
                <View style={[Styles.button, { justifyContent: 'flex-end' }]}>
                    {loading? (
                        <ActivityIndicator size="small" color={Colors.White} />
                    ) : (
                        <Text style={{ color: Colors.White, fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>
                            Post
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={[{ flexDirection: 'row', marginTop: 30, marginLeft: 20, justifyContent: 'space-between' }]}>
                <TouchableOpacity onPress={() => navigater.goBack()}>
                    <AntDesign
                        name="back"
                        size={24}
                        color="black"
                        style={[Styles.buttonBack, { padding: 2 }]}
                    />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginLeft: -20 }}>Đăng tin</Text>
                <View />
            </View>

            <FlatList
                data={[{}]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderContent}
            />
        </View>
    );
};

export default CreateNew;
