import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, SafeAreaView, SafeAreaViewBase } from 'react-native';
import React, { useState } from 'react';
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';


// icon 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function PopUpMenuNearMe({ isVisible, onClose }) {
    const [isLocationFocus, setIsLocationFocus] = useState(false);
    const [isDistanceFocus, setIsDistanceFocus] = useState(false);
    
    return (
        <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
            <Pressable onPress={onClose} style={Styles.overlay} />
            <View style={[Styles.popupMenuFilter, {left: 80}]}>

                <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBlockColor: "gray", marginBottom: 7}}>
                    <FontAwesome6 name="location-crosshairs" size={15} color="black" />
                    <Text style={{ margin: 5, fontWeight: 'bold' }}>Tìm kiếm quanh bạn</Text>
                </View>


                <View>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{ margin: 5, fontWeight: 'bold' }}>Nhập vị trí của bạn</Text>
                    </View>

                    <View>
                        <TextInput style={[{ flexDirection: "row", alignItems: "center", borderColor: "lightgrey", borderWidth: 1, padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 10 },
                            {borderWidth: 1.5, borderColor: (!isLocationFocus && isVisible)? "lightgrey": Colors.Red}
                        ]}
                            placeholder='Nhập địa điểm, tên đường cần tìm.'
                            onFocus={() => setIsLocationFocus(true)}
                            onBlur={() => setIsLocationFocus(false)}
                        >
                        </TextInput>
                    </View>
                    
                    
                    <View style={{flexDirection: "row", marginTop: 10, }}>
                        <Text style={{ margin: 5, fontWeight: 'bold', flex: 1}}>Nhập bán kính tìm kiếm</Text>
                        
                        <TextInput placeholder='10 km' defaultValue='10'
                            style={{
                                borderWidth: 1.3, borderRadius: 5, paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5,
                                minWidth: 50, maxWidth: 70,
                                alignSelf: 'flex-end',
                                borderColor: (!isDistanceFocus && isVisible)? "lightgrey": Colors.Red
                            }}
                            onFocus={() => setIsDistanceFocus(true)}
                            onBlur={() => setIsDistanceFocus(false)}
                        ></TextInput>
                    </View>
                   

        

                    {/* Confirm button */}
                    <TouchableOpacity style={{
                        alignItems: 'center', alignSelf: 'flex-end',
                        flexDirection: 'row', backgroundColor: "tomato", borderRadius: 5, padding: 4, paddingLeft: 5, paddingRight: 5, marginTop: 20,
                    }}

                    >
                        <Text style={{ color: "white", marginRight: 5, fontWeight: 'bold' }}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    )
}