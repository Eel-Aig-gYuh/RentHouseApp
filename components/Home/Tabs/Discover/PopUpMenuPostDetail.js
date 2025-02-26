import { View, Text, Modal, Pressable, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';


// icon 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MyContact from '../../../../config/MyContact';
import { getToken } from '../../../../utils/storage';
import APIs, { endpoints } from '../../../../config/APIs';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


export default function PopUpMenuPostDetail({ isVisible, onClose, onOptionSelect, authorID, post }) {
    const [user, dispatch] = useContext(MyContact);
    const [followedUser, setFollowedUser] = useState([]);
    const navigater = useNavigation();

    const handleOptionSelect = (value) => {
        onOptionSelect(value); // Pass the selected value to the parent
        onClose(); // Close the modal if needed
    };


    useEffect(() => {
            setFollowedUser(user?.user?.following);
        }, [user]);
    
        const toggleFollowUser = async (user_cmt_id) => {
            const token = await getToken();
    
            try {
                let updatedFollowUsers;
    
                if (followedUser.includes(user_cmt_id)) {
                    console.info("Unfollow is called");
                    response = await APIs.post(endpoints['post-unfollow'], { followed: user_cmt_id }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    updatedFollowUsers = followedUser.filter(id => id !== user_cmt_id); // Remove postId from savedPosts
                } else {
                    console.info("Follow is called");
                    response = await APIs.post(endpoints['post-follow'], { followed: user_cmt_id }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
    
                    if (response.status === 201) { // Change to 201 if follow API creates a new record
                        console.info("Follow success");
                        setFollowedUser(prevState => [...prevState, user_cmt_id]); // Add user to list
                    }
                    
                    updatedFollowUsers = [...user?.user.following, user_cmt_id]; // Add postId to savedPosts
                }
    
                const updatedUser = { ...user.user, following: updatedFollowUsers };
                console.info(updatedUser);
    
                dispatch({
                    type: "SET_USER",  // Ensure this action updates the whole user object
                    payload: updatedUser,
                });
    
    
                dispatch({
                    type: "UPDATE_FOLLOW_USERS",
                    payload: updatedFollowUsers
                });
    
                setFollowedUser(updatedFollowUsers);
    
            } catch (ex) {
                console.error("Error saving post", ex);
            }
        };

    const showConfirmDialog = () => {
        Alert.alert(
            "Bạn có chắc chắn không?",
            "Bạn có muốn xóa bài đăng này không?",
            [
                {
                    text: "Có",
                    onPress: () => {
                        deleteRentalPost(); // Call the reset function when confirmed
                        console.info(post.id);
                    },
                },
                {
                    text: "Không",
                    style: "cancel",
                },
            ]
        );
    };

    const deleteRentalPost = async () => {
        console.info(post?.user.id);

        const token = await getToken();
        if (!post?.id) {
            console.error("Invalid post ID");
            return;
        }

        try {
            let res = await APIs.delete(endpoints['rental-post-detail'](post.id), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // console.info(endpoints['delete-comment'](post.id));

            // console.info("Post deleted successfully", res.data);
            Alert.prompt("Thành công!", `Đã xóa post: ${post.title} thành công! `);

            
        } catch (ex) {
            console.error("Error deleting post: ", ex.status);
        }
    }

    const handleDeleteRentalPost = () => {
        showConfirmDialog(deleteRentalPost);
    };

    return (
        <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}

        >
            <Pressable onPress={onClose} style={[Styles.overlay, { height: '100%' }]} />
            <View style={[{
                width: '100%', backgroundColor: "lightgrey", minHeight: '30%', maxHeight: '70%',
                paddingTop: 20, paddingLeft: 20, paddingRight: 20,
                borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: -20

            }]}>

                <View style={{
                    height: 5, width: 50, backgroundColor: "gray", alignSelf: 'center',
                    borderRadius: 20, marginBottom: 10,
                }}>

                </View>

                <View style={{
                    alignItems: "center",
                    borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white",
                    padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row", alignItems: "center",
                            borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                            marginBottom: 5, borderRadius: 15
                        }}>
                        <View style={{ flex: 1, padding: 5 }}>
                            <Text style={{ color: 'black', fontWeight: '700' }}>Không quan tâm</Text>
                        </View>
                        <Feather name="eye-off" size={20} color="black" style={{ paddingRight: 10 }} />
                    </TouchableOpacity>

                    {user?.user.role === "Nguoi_Thue_Tro" ? (
                        (followedUser?.includes(authorID)) ? (
                            <TouchableOpacity onPress={() => toggleFollowUser(authorID)}
                                style={{
                                    flexDirection: "row", alignItems: "center",
                                    borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                                    marginBottom: 10, borderRadius: 15
                                }}>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <Text style={{ color: Colors.Red, fontWeight: '700' }}>Bỏ theo dõi</Text>
                                </View>
                                <MaterialIcons name="person-off" size={20} color={Colors.Red} style={{ paddingRight: 10 }} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => toggleFollowUser(authorID)}
                                style={{
                                    flexDirection: "row", alignItems: "center",
                                    borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                                    marginBottom: 10, borderRadius: 15
                                }}>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <Text style={{ color: Colors.Green, fontWeight: '700' }}>Theo dõi</Text>
                                </View>
                                <MaterialIcons name="person-off" size={20} color={Colors.Green} style={{ paddingRight: 10 }} />
                            </TouchableOpacity>
                        )
                    ) : (
                        null
                    )}
                </View>



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


                {user?.user?.id === post?.user_id ? (
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
                                <Text style={{ color: "black", fontWeight: '700' }}>Chỉnh sửa bài đăng</Text>
                            </View>
                            <MaterialIcons name="person-off" size={20} color="black" style={{ paddingRight: 10 }} />
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => handleDeleteRentalPost()}
                            style={{
                                flexDirection: "row", alignItems: "center",
                                borderColor: "lightgrey", borderBottomWidth: 1, backgroundColor: "white",
                                marginBottom: 5, borderRadius: 15
                            }}>
                            <View style={{ flex: 1, padding: 5 }}>
                                <Text style={{ color: Colors.Red, fontWeight: '700' }}>Xoá bài đăng</Text>
                            </View>
                            <MaterialCommunityIcons name="alert-box-outline" size={20} color={Colors.Red} style={{ paddingRight: 10 }} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    null
                )}

                {/* {console.info(user.user.following)}
                {console.info(followedUser)}
                {console.info(authorID)} */}

                <View style={{
                    alignItems: "center",
                    borderColor: "lightgrey", borderWidth: 1, backgroundColor: "white",
                    padding: 5, marginTop: 5, marginBottom: 5, borderRadius: 15
                }}>
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