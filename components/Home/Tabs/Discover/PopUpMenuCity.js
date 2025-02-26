import { View, Text, Modal, Pressable, TouchableOpacity, FlatList, TextInput } from 'react-native';
import React, { useState } from 'react';
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';


// icon 
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';


export default function PopUpMenuCity({ isVisible, onClose, onOptionSelect, type, selectedCity, selectedDistrict }) {

  const [searchQuery, setSearchQuery] = useState("");

  const options = {
    city: [
      { label: 'Hà Nội', icon: <FontAwesome5 name="house-user" size={20} color="black" /> },
      { label: 'Hồ Chí Minh', icon: <MaterialIcons name="person-search" size={20} color="black" /> },
      { label: 'Đà Nẵng', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
      { label: 'Hải Phòng', icon: <FontAwesome5 name="city" size={20} color="black" /> },
      { label: 'Cần Thơ', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'An Giang', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Bình Dương', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      { label: 'Nghệ An', icon: <MaterialIcons name="explore" size={20} color="black" /> },
      { label: 'Quảng Ninh', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Thái Nguyên', icon: <FontAwesome5 name="city" size={20} color="black" /> },
      { label: 'Lâm Đồng', icon: <MaterialIcons name="place" size={20} color="black" /> },
      { label: 'Bà Rịa-Vũng Tàu', icon: <FontAwesome5 name="location-arrow" size={20} color="black" /> },
      { label: 'Thanh Hóa', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Quảng Ngãi', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      { label: 'Hà Giang', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Phú Yên', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      { label: 'Bắc Giang', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
      { label: 'Bắc Kạn', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      { label: 'Bạc Liêu', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Bến Tre', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Bình Định', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Bình Phước', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      { label: 'Bình Thuận', icon: <MaterialIcons name="place" size={20} color="black" /> },
      { label: 'Cao Bằng', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Cà Mau', icon: <FontAwesome5 name="city" size={20} color="black" /> },
      { label: 'Gia Lai', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Hà Nam', icon: <FontAwesome5 name="location-arrow" size={20} color="black" /> },
      { label: 'Hòa Bình', icon: <MaterialIcons name="explore" size={20} color="black" /> },
      { label: 'Hậu Giang', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Hưng Yên', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      { label: 'Khánh Hòa', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Kiên Giang', icon: <FontAwesome5 name="city" size={20} color="black" /> },
      { label: 'Kon Tum', icon: <MaterialIcons name="place" size={20} color="black" /> },
      { label: 'Lai Châu', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Lào Cai', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Long An', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Nam Định', icon: <MaterialIcons name="explore" size={20} color="black" /> },
      { label: 'Ninh Bình', icon: <FontAwesome5 name="location-arrow" size={20} color="black" /> },
      { label: 'Ninh Thuận', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
      { label: 'Phú Thọ', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      { label: 'Quảng Bình', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Quảng Nam', icon: <MaterialIcons name="place" size={20} color="black" /> },
      { label: 'Quảng Trị', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Sóc Trăng', icon: <FontAwesome5 name="city" size={20} color="black" /> },
      { label: 'Sơn La', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Tây Ninh', icon: <MaterialIcons name="explore" size={20} color="black" /> },
      { label: 'Thái Bình', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Thừa Thiên-Huế', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      { label: 'Tiền Giang', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Trà Vinh', icon: <MaterialIcons name="location-on" size={20} color="black" /> },
      { label: 'Tuyên Quang', icon: <FontAwesome5 name="location-arrow" size={20} color="black" /> },
      { label: 'Vĩnh Long', icon: <Feather name="map-pin" size={20} color="black" /> },
      { label: 'Vĩnh Phúc', icon: <MaterialIcons name="place" size={20} color="black" /> },
      { label: 'Yên Bái', icon: <MaterialIcons name="location-on" size={20} color="black" /> }
    ],
    district: {
      'Hà Nội': [
        { label: 'Ba Đình', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Hoàn Kiếm', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
        { label: 'Đống Đa', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Tây Hồ', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      ],
      'Hồ Chí Minh': [
        { label: 'District 1', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'District 2', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
        { label: 'District 3', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'District 4', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      ],
      'Đà Nẵng': [
        { label: 'Hải Châu', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Thanh Khê', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        { label: 'Ngũ Hành Sơn', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Sơn Trà', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      ],
      'Hải Phòng': [
        { label: 'Ngô Quyền', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Lê Chân', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        { label: 'Hồng Bàng', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Kiến An', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      ],
      'Quảng Ninh': [
        { label: 'Hạ Long', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Cẩm Phả', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Móng Cái', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        { label: 'Uông Bí', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      ],
      'Thanh Hóa': [
        { label: 'Thanh Hóa', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Bỉm Sơn', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Sầm Sơn', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        { label: 'Nghi Sơn', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      ],
      'Nghệ An': [
        { label: 'Vinh', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Cửa Lò', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Thái Hòa', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        { label: 'Hoàng Mai', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
      ],
      'Cần Thơ': [
        { label: 'Ninh Kiều', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
        { label: 'Bình Thủy', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
        { label: 'Cái Răng', icon: <Feather name="map-pin" size={20} color="black" /> },
        { label: 'Ô Môn', icon: <FontAwesome5 name="building" size={20} color="black" /> },
      ],
    },
    ward: {
      'Hà Nội': {
        'Ba Đình': [
          { label: 'Phúc Xá', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Vĩnh Phúc', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Trúc Bạch', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'Điện Biên', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
      },
      'Hồ Chí Minh': {
        'District 1': [
          { label: 'Bến Nghé', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Đa Kao', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Nguyễn Thái Bình', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'Phạm Ngũ Lão', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
      },
      'Đà Nẵng': {
        'Hải Châu': [
          { label: 'Thạch Thang', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Hải Châu I', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Hải Châu II', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'Thanh Bình', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
        'Sơn Trà': [
          { label: 'An Hải Bắc', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Mân Thái', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Nại Hiên Đông', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'Thọ Quang', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
        'Thanh Khê': [
          { label: 'Tân Chính', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Chính Gián', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Vĩnh Trung', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'An Khê', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
      },
      'Cần Thơ': {
        'Ninh Kiều': [
          { label: 'An Bình', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'An Cư', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Cái Khế', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'Xuân Khánh', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
        'Bình Thủy': [
          { label: 'Bình Thủy', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Long Hòa', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Trà Nóc', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'An Thới', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
        'Cái Răng': [
          { label: 'Hưng Phú', icon: <Feather name="map-pin" size={20} color="black" /> },
          { label: 'Hưng Thạnh', icon: <FontAwesome5 name="map-marked-alt" size={20} color="black" /> },
          { label: 'Lê Bình', icon: <MaterialIcons name="location-city" size={20} color="black" /> },
          { label: 'Ba Láng', icon: <FontAwesome5 name="building" size={20} color="black" /> },
        ],
      },
    }
    
  };

  const menuOptions =
    type === "district" && selectedCity
      ? options.district?.[selectedCity] ?? []
      : type === "ward" && selectedCity && selectedDistrict
        ? options.ward?.[selectedCity]?.[selectedDistrict] ?? []
        : options[type] ?? [];

  const handleOptionSelect = (value) => {
    onOptionSelect(value); // Pass the selected value to the parent
    onClose(); // Close the modal if needed
  };

  // Filter the options based on the search query
  const filteredOptions = Array.isArray(menuOptions) ? menuOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())) : [];


  return (
    <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}

    >
      <Pressable onPress={onClose} style={[Styles.overlay, { height: '100%' }]} />
      <View style={[{
        width: '100%', backgroundColor: "lightgrey", minHeight: '30%', maxHeight: '50%',
        paddingTop: 20, paddingLeft: 20, paddingRight: 20,
        borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: -20

      }]}>

        <View style={{
          height: 5, width: 50, backgroundColor: "gray", alignSelf: 'center',
          borderRadius: 20, marginBottom: 10,
        }}>

        </View>

        {/* Search Bar */}
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm kiếm..."
          style={{
            height: 40,
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: 'lightgrey',
          }}
        />

        <FlatList
          data={filteredOptions}
          keyExtractor={(item, index) => index.toString()} // Using index as the key
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(item.label)}
              style={{
                flexDirection: 'row', alignItems: 'center', borderColor: 'lightgrey', borderWidth: 1, backgroundColor: 'white',
                padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15,
              }}
            >
              <View style={{ flex: 1, padding: 5 }}>
                <Text style={{ color: 'black', fontWeight: '700' }}>{item.label}</Text>
              </View>
              <View style={{ paddingRight: 10 }}>{item.icon}</View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} // Optional: add padding at the bottom
        />
      </View>

    </Modal>
  )
}