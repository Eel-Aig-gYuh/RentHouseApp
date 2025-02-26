import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';


// icon 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import { getToken } from '../../../../utils/storage';
import APIs, { endpoints } from '../../../../config/APIs';
import MyContact from '../../../../config/MyContact';


export default function PopUpMenuComment({ isVisible, onClose, onOptionSelect, commentItem, }) {
    const [user, dispatch] = useContext(MyContact);
    const [loading, setLoading] = useState(false);

    const handleOptionSelect = (value) => {
        onOptionSelect(value); // Pass the selected value to the parent
        onClose(); // Close the modal if needed
    };

    const showConfirmDialog = () => {
        Alert.alert(
            "Bạn có chắc chắn không?",
            "Bạn có muốn xóa comment này không?",
            [
                {
                    text: "Có",
                    onPress: () => {
                        deleteCommentPost(); // Call the reset function when confirmed
                        console.info(commentItem.id);
                    },
                },
                {
                    text: "Không",
                    style: "cancel",
                },
            ]
        );
    };

    const deleteCommentPost = async () => {
        console.info(commentItem.user.id);

        const token = await getToken();
        if (!commentItem?.id) {
            console.error("Invalid post ID");
            return;
        }

        try {
            setLoading(true);
            let res = await APIs.delete(endpoints['delete-comment'](commentItem.id), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.info(endpoints['delete-comment'](commentItem.id));
            setLoading(false);

            console.info("Post deleted successfully", res.data);

            onClose();
        } catch (ex) {
            setLoading(false);
            console.error("Error deleting post: ", ex.status);
        }
    }

    const handleDeleteCommentPost = () => {
        showConfirmDialog(deleteCommentPost);
    };

    useEffect(() => {
        console.info(commentItem);
        console.info(commentItem.id);
        console.info(user.user.id);

    }, []);

    return (
        <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}

        >
            <Pressable onPress={onClose} style={[Styles.overlay, { height: '100%' }]} />
            {loading? (
                <ActivityIndicator size='small' color='white' />
            ) : (
                null
            )}
            <View style={[{
                width: '100%', backgroundColor: "lightgrey", minHeight: '30%', maxHeight: '50%',
                paddingTop: 20, paddingLeft: 20, paddingRight: 20,
                borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: -20,
            }]}>

                <View style={{
                    height: 5, width: 50, backgroundColor: "gray", alignSelf: 'center',
                    borderRadius: 20, marginBottom: 10,
                }}>

                </View>

                <TouchableOpacity 
                    style={{
                        flexDirection: "row", alignItems: "center",
                        borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white",
                        padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15
                    }}>
                    <View style={{ flex: 1, padding: 5 }}>
                        <Text style={{ color: "black", fontWeight: '700' }}>Không quan tâm</Text>
                    </View>

                    <Feather name="eye-off" size={20} color="black" style={{ paddingRight: 10 }} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{
                        flexDirection: "row", alignItems: "center",
                        borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white",
                        padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15
                    }}>
                    <View style={{ flex: 1, padding: 5 }}>
                        <Text style={{ color: "black", fontWeight: '700' }}>Sao chép liên kết</Text>
                    </View>
                    <FontAwesome6 name="link" size={20} color="black" style={{ paddingRight: 10 }} />

                </TouchableOpacity>

                <View style={{
                    alignItems: "center",
                    borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white",
                    padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15
                }}>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row", alignItems: "center",
                            borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                            marginBottom: 10, borderRadius: 15
                        }}>
                        <View style={{ flex: 1, padding: 5 }}>
                            <Text style={{ color: Colors.Red, fontWeight: '700' }}>Chặn</Text>
                        </View>
                        <MaterialIcons name="person-off" size={20} color={Colors.Red} style={{ paddingRight: 10 }} />
                    </TouchableOpacity>


                    {user?.user?.id === commentItem?.user.id ? (
                        <TouchableOpacity onPress={() => handleDeleteCommentPost()}
                            style={{
                                flexDirection: "row", alignItems: "center",
                                borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                                marginBottom: 5, borderRadius: 15
                            }}>
                            <View style={{ flex: 1, padding: 5 }}>
                                <Text style={{ color: Colors.Red, fontWeight: '700' }}>Xóa bài đăng</Text>
                            </View>
                            <AntDesign name="delete" size={20} color={Colors.Red} style={{ paddingRight: 10 }} />
                        </TouchableOpacity>
                    ) : (
                        null
                    )}


                    <TouchableOpacity 
                        style={{
                            flexDirection: "row", alignItems: "center",
                            borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                            marginBottom: 5, borderRadius: 15
                        }}>
                        <View style={{ flex: 1, padding: 5 }}>
                            <Text style={{ color: Colors.Red, fontWeight: '700' }}>Báo cáo</Text>
                        </View>
                        <MaterialCommunityIcons name="alert-box-outline" size={20} color={Colors.Red} style={{ paddingRight: 10 }} />
                    </TouchableOpacity>
                </View>

            </View>

        </Modal>
    )
}