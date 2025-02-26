import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Colors } from '../../../constants/color/Colors'
import Styles from '../../../constants/styles/Styles'

// Icon
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Notification() {
  return (
    <ScrollView>
      <TouchableOpacity style={{
        backgroundColor: "white", minHeight: 100, maxHeight: 150, borderRadius: 15,
        marginBottom: 5, marginTop: 5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        elevation: 7,

      }}
        onPress={() => navigater.navigate('RentPostDetail')}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[{
            height: 100, width: 100, backgroundColor: "white", margin: 5, borderRadius: 10,
            borderColor: Colors.LightGray, borderWidth: 3,
          }]}>
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
                    source={require('./../../../assets/images/avatar1.png')} />
                </TouchableOpacity>
              </View>

              <View style={{ width: '50%' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text>Tên User</Text>
                  <Text style={{ fontSize: 10 }}>Số tin đăng</Text>
                </View>
              </View>

              <TouchableOpacity>
                <AntDesign style={{ marginTop: 10 }}
                  name="hearto" size={24} color="tomato" />
              </TouchableOpacity>
            </View>
          </View>


        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}