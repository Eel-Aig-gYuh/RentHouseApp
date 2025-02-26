import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, Alert } from 'react-native';
import React from 'react'
import { useState } from 'react';

// icon 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

// Currency formatting
import currency from 'currency.js';

export default function PopUpMenuPrices({ isVisible, onClose, onQuerySubmit, filterItem }) {

    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);

    const [query, setQuery] = useState([{
        "min_price": "",
        "max_price": "",
    }]);

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
            setQuery([{ min_price: "", max_price: "",}]);
        });
    };


    return (
        <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
            <Pressable onPress={onClose} style={Styles.overlay} />
            <View style={Styles.popupMenuFilter}>
                <View>
                    <Text style={{ margin: 5, fontWeight: 'bold' }}>Giá</Text>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextInput inputMode='numeric' style={[Styles.menuItem, { borderColor: (!isFocused1 && isVisible) ? "lightgrey" : Colors.Red, paddingLeft: 10 }]}
                            onFocus={() => setIsFocused1(true)}
                            onBlur={() => setIsFocused1(false)}
                            onChangeText={t => changed("min_price", t)}
                            placeholder={filterItem?.min_price 
                                ? `${currency(filterItem.min_price, { separator: ',', symbol: "", decimals: 0 })
                                    .format()
                                    .replace('.00', '')} ₫` 
                                : "Giá tối thiểu"}
            
                        />
                        <Text style={{ padding: 10 }}>-</Text>
                        <TextInput inputMode='numeric' style={[Styles.menuItem, { borderColor: (!isFocused2 && isVisible) ? "lightgrey" : Colors.Red, paddingLeft: 10 }]}
                            onFocus={() => setIsFocused2(true)}
                            onBlur={() => setIsFocused2(false)}
                            onChangeText={t => changed("max_price", t)}
                            placeholder={filterItem?.max_price 
                                ? `${currency(filterItem.max_price, { separator: ',', symbol: "", decimals: 0 })
                                    .format()
                                    .replace('.00', '')} ₫` 
                                : "Giá tối đa"}
                        />
                    </View>

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