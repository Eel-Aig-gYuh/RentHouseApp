import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, SafeAreaView, SafeAreaViewBase } from 'react-native';
import React, { useState } from 'react';
import Styles from '../../constants/styles/Styles';
import { Colors } from '../../constants/color/Colors';


// icon 
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function PopUpMenuRole({ isVisible, onClose, onOptionSelect }) {

  const handleOptionSelect = (value) => {
    onOptionSelect(value); // Pass the selected value to the parent
    onClose(); // Close the modal if needed
  };


  return (
    <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}

    >
      <Pressable onPress={onClose} style={[Styles.overlay, {height: '100%'}]} />
      <View style={[{ width: '100%', backgroundColor: "lightgrey", minHeight: '30%', maxHeight: '50%',
        paddingTop: 20, paddingLeft: 20, paddingRight: 20,
        borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: -20
        
      }]}>

        <View style={{height: 5, width: 50, backgroundColor: "gray", alignSelf: 'center',
          borderRadius: 20, marginBottom: 10,
        }}>

        </View>

        <TouchableOpacity onPress={() => handleOptionSelect("Nguoi_Thue_Tro")} 
            style={{ flexDirection: "row", alignItems: "center", 
            borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white", 
            padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15 }}>
            <View style={{ flex: 1, padding: 5 }}>
                <Text style={{ color: "black", fontWeight: '700' }}>Người thuê trọ</Text>
            </View>
            <MaterialIcons name="person-search" size={20} color="black" style={{paddingRight: 10}} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOptionSelect('Chu_Nha_Tro')}
          style={{ flexDirection: "row", alignItems: "center", 
          borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white", 
          padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15 }}>
          <View style={{ flex: 1, padding: 5 }}>
            <Text style={{ color: "black", fontWeight: '700' }}>Chủ nhà trọ</Text>
          </View>
          <FontAwesome5 name="house-user" size={20} color="black" style={{paddingRight: 10}} />
        </TouchableOpacity>
      </View>

    </Modal>
  )
}