import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

export default function PopUpMenuFilter({ isVisible, onClose, onQuerySubmit, filterItem }) {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);

    const [query, setQuery] = useState([{
        "occupants": "",
        "min_area": "",
        "max_area": "",
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
            setQuery([{ occupants: "", min_area: "", max_area: "" }]);
        });
    };



    return (
        <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
            <Pressable onPress={onClose} style={Styles.overlay} />
            <View style={Styles.popupMenuFilter}>
                <View>
                    <Text style={{ margin: 5, fontWeight: 'bold' }}>Diện tích</Text>

                    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "lightgrey", paddingBottom: 10 }}>
                        <TextInput inputMode='numeric' style={[Styles.menuItem, { borderColor: (!isFocused1 && isVisible) ? "lightgrey" : Colors.Red, paddingLeft: 10 }]}
                            onFocus={() => setIsFocused1(true)}
                            onBlur={() => setIsFocused1(false)}
                            onChangeText={t => changed("min_area", t)}
                            placeholder={filterItem?.min_area
                                ? `${filterItem.min_area} m²`
                                : "Giá tối thiểu"}
                        />
                        <Text style={{ padding: 10 }}>-</Text>
                        <TextInput inputMode='numeric' style={[Styles.menuItem, { borderColor: (!isFocused2 && isVisible) ? "lightgrey" : Colors.Red, paddingLeft: 10}]}
                            onFocus={() => setIsFocused2(true)}
                            onBlur={() => setIsFocused2(false)}
                            onChangeText={t => changed("max_area", t)}
                            placeholder={filterItem?.max_area
                                ? `${filterItem.max_area} m²`
                                : "Giá tối thiểu"}
                        />
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{ margin: 5, fontWeight: 'bold', marginTop: 10, flex: 1 }}>Số lượng người ở</Text>

                        <TextInput inputMode='numeric' placeholder='1'
                            onChangeText={t => changed("occupants", t)}
                        style={{width: 100, borderWidth: 1, backgroundColor: '#EEEEEE', 
                            borderRadius: 5, height: 'auto', justifyContent: 'center', alignSelf: 'center', borderColor: 'lightgrey', marginRight: 5, marginTop: 5}}></TextInput>
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
