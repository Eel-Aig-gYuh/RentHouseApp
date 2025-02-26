import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, SafeAreaView, SafeAreaViewBase } from 'react-native';
import React from 'react'
import { useState } from 'react';
import { Alert } from 'react-native';

import PopUpMenuCity from './PopUpMenuCity';

// icon 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

import PopUpMenuNearMe from './PopUpMenuNearMe';

export default function PopUpMenuLocation({ isVisible, onClose, onQuerySubmit }) {
    const [isNearMeClick, setIsNearMeClick] = useState(false);
    const [isMenuCityClick, setIsMenuCityClick] = useState(false);

    const [type, setType] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    
    const [query, setQuery] = useState([{
        "city": "",
        "district": "",
        "ward": "",
    }]);

    const toggleNearMeMenu = () => setIsNearMeClick(!isNearMeClick);
    const toggleCityMenu = () => { setIsMenuCityClick(!isMenuCityClick) }

    const handleSelectCity = (value) => {

        // console.log('Selected Role:', value); // Log the selected value
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

    const changed = (field, value) => {
        setQuery(current => {
            // [field] : lấy giá trị của first_name bỏ vô, nếu không có [] thì nó lấy chữ field.
            // [] : array destructering.
            return { ...current, [field]: value }
        })
    }

    const sendQuery = async () => {
        try {
            // console.info(query);
            if (onQuerySubmit) {
                onQuerySubmit(query); // Send query to parent
                setQuery([{ city: "", district: "", ward: "" }]);
            }
            onClose(); // Close the modal after submitting
        } catch (ex) {
            console.error("Lỗi send Query tìm kiếm: " + ex);
        }
    }

    const showConfirmDialog = (onConfirm) => {
        Alert.alert(
            "Bạn có chắc chắn không?",
            "Bạn có muốn hủy thao tác lọc không?",
            [
                {
                    text: "Có",
                    onPress: () => {
                        onConfirm(); // Call the reset function when confirmed
                    },
                },
                {
                    text: "Không",
                    style: "cancel",
                },
            ]
        );
    };
    
    const cancelQuery = async () => {
        showConfirmDialog(() => {
            setQuery([{ city: "", district: "", ward: "" }]);
            setSelectedWard("");
            setSelectedDistrict("");
            setSelectedCity("");
        });
    };


    return (
        <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
            <Pressable onPress={onClose} style={Styles.overlay} />
            <View style={[Styles.popupMenuFilter, { left: 90 }]}>
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome6 name="location-crosshairs" size={15} color="black" />
                        <Text style={{ margin: 5, fontWeight: 'bold' }}>Tìm kiếm quanh bạn</Text>
                    </View>

                    <View>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", borderColor: "lightgrey", borderWidth: 1, padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 10 }}
                            onPress={toggleNearMeMenu}
                        >
                            <View>
                                <Text style={{ color: "grey" }}>Nhập vị trí và khoảng cách</Text>
                            </View>
                            <AntDesign name="caretright" size={15} color="lightgray" style={{ marginLeft: 20 }} />
                        </TouchableOpacity>
                        <PopUpMenuNearMe
                            isVisible={isNearMeClick}
                            onClose={toggleNearMeMenu}
                        />

                    </View>


                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialCommunityIcons name="office-building-marker-outline" size={15} color="black" />
                        <Text style={{ margin: 5, fontWeight: 'bold' }}>Tìm kiếm theo khu vực</Text>
                    </View>



                    <TouchableOpacity
                        style={[{
                            borderWidth: 1.2, marginBottom: 5, height: 30, borderRadius: 10,
                            borderColor: "lightgrey", marginRight: 5, marginLeft: 5, padding: 5
                        }]}
                        onPress={() => { setType("city"); toggleCityMenu(); }}
                    >
                        <Text>{selectedCity ? selectedCity : "Chọn thành phố, tỉnh thành"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[{
                            borderWidth: 1.2, marginBottom: 5, height: 30, borderRadius: 10,
                            borderColor: "lightgrey", marginRight: 5, marginLeft: 5, padding: 5
                        }]}
                        disabled={selectedCity ? false : true}
                        onPress={() => { setType("district"); toggleCityMenu(); }}
                    >
                        <Text style={{ color: selectedCity ? "black" : "gray" }}>{selectedDistrict ? selectedDistrict : "Chọn quận, huyện"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[{
                            borderWidth: 1.2, marginBottom: 5, height: 30, borderRadius: 10,
                            borderColor: "lightgrey", marginRight: 5, marginLeft: 5, padding: 5
                        }]}
                        disabled={selectedDistrict ? false : true}
                        onPress={() => { setType("ward"); toggleCityMenu(); }}
                    >
                        <Text style={{ color: selectedDistrict ? "black" : "gray" }}>{selectedWard ? selectedWard : "Chọn khu vực"}</Text>
                    </TouchableOpacity>

                    <PopUpMenuCity
                        isVisible={isMenuCityClick}
                        onClose={toggleCityMenu}
                        onOptionSelect={handleSelectCity}
                        type={type}
                        selectedCity={selectedCity}
                        selectedDistrict={selectedDistrict}

                    />



                    <View style={{ flexDirection: "row", alignSelf: 'flex-end' }}>

                        <TouchableOpacity style={{
                            alignItems: 'center', alignContent: 'center', alignSelf: 'flex-end', borderColor: "black", borderWidth: 0.7,
                            flexDirection: 'row', backgroundColor: "white", borderRadius: 5, padding: 4, paddingLeft: 5, paddingRight: 5, marginTop: 5,
                        }}
                            onPress={cancelQuery}
                        >

                            <Text style={{ color: "black", marginRight: 5, fontWeight: 'bold', justifyContent: 'center' }}>Xóa lọc</Text>
                        </TouchableOpacity>



                        <TouchableOpacity style={{
                            alignItems: 'center', alignSelf: 'flex-end',
                            flexDirection: 'row', backgroundColor: "tomato", borderRadius: 5, padding: 4, paddingLeft: 5, paddingRight: 5, marginTop: 5, marginLeft: 10,
                        }}
                            onPress={sendQuery}
                        >

                            <Text style={{ color: "white", marginRight: 5, fontWeight: 'bold' }}>Xác nhận</Text>
                        </TouchableOpacity>



                    </View>
                </View>
            </View>

        </Modal>
    );
}