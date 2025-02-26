import { View, Text, Modal, Pressable, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

// icon 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// components
import PopUpMenuPost from './PopUpMenuPost';
import MessageList from '../Message/MessageList';

// Format date
import moment from 'moment';
import 'moment/locale/vi';

// Currency formatting
import currency from 'currency.js';
import { ScrollView } from 'react-native-gesture-handler';
import MyContact from '../../../../config/MyContact';
import { getToken } from '../../../../utils/storage';
import APIs, { endpoints } from '../../../../config/APIs';
import PopUpMenuComment from './PopUpMenuComment';

export default function Comment({ isVisible, onClose, onOptionSelect, post }) {
    const [user, dispatch] = useContext(MyContact);
    const [activePostMenu, setActivePostMenu] = useState(null);
    const [activeCommentMenu, setActiveCommentMenu] = useState(false);
    const [followedUser, setFollowedUser] = useState([]);
    const [commentsInPost, setCommentsInPost] = useState([]);

    const [cmt, setCmt] = useState({
        "content": "",
        "content_type": "findroompost",
        "object_id": post?.id,
        "image": "",

        "user_id": user?.user?.id,
    });

    const [isSending, setIsSending] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const loadComment = async() => {
        try {
            setLoading(true);
            const token = await getToken();
            const url = endpoints['find-room-post/postId'](post.id);
            // console.info(url);

            let res = await APIs.get(url, {
                headers: { Authorization: `Bearer ${token}`, }
            });

            // console.info(res.data);
            
            setCommentsInPost(res.data?.comments);
        
        } catch (ex) {
            console.error('Loi load comment: ', ex);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComment();
    }, [isSending, activeCommentMenu]);
    

    const changed = (field, value) => {
        setCmt(current => {
            // [field] : lấy giá trị của first_name bỏ vô, nếu không có [] thì nó lấy chữ field.
            // [] : array destructering.
            return { ...current, [field]: value }
        })
    }


    useEffect(() => {
        setFollowedUser(user?.user.following);
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

    // const toggleFollowUser = async (user_cmt_id) => {
    //     try {
    //         const token = await getToken();
    //         const isAlreadyFollowing = followedUser.includes(user_cmt_id);
    
    //         let response;
    //         if (isAlreadyFollowing) {
    //             console.info("Unfollow is called");
    //             response = await APIs.post(endpoints['post-unfollow'], { followed: user_cmt_id }, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    
    //             if (response.status === 200) {
    //                 console.info("Unfollow success");
    //                 setFollowedUser(prevState => prevState.filter(id => id !== user_cmt_id)); // Remove user from list
    //             }
    //         } else {
    //             console.info("Follow is called");
    //             response = await APIs.post(endpoints['post-follow'], { followed: user_cmt_id }, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    
    //             if (response.status === 201) { // Change to 201 if follow API creates a new record
    //                 console.info("Follow success");
    //                 setFollowedUser(prevState => [...prevState, user_cmt_id]); // Add user to list
    //             }
    //         }
    
    //         // Optionally, update global user state for consistency
    //         dispatch({
    //             type: "UPDATE_FOLLOWING",
    //             payload: isAlreadyFollowing
    //                 ? user.user.following.filter(id => id !== user_cmt_id)
    //                 : [...user.user.following, user_cmt_id]
    //         });
    
    //     } catch (error) {
    //         console.error("Error in toggling follow status:", error.status);
    //     }
    // };


    const togglePostMenu = (postId) => {
        setActivePostMenu(activePostMenu === postId ? null : postId);
    };

    const toggleCommentMenu = (cmtID) => {
        setActiveCommentMenu(activeCommentMenu == cmtID ? null : cmtID);
    }


    const sendComment = async () => {
        console.info("is Click!");
        setIsSending(true);
        let form = new FormData();

        for (let key in cmt) {
            form.append(key, cmt[key]);
        }

        try {
            const token = await getToken();
            let res = await APIs.post(endpoints['comment'], form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                },
            });

        } catch (ex) {
            console.error('Loi send comment: ', ex);
        } finally {
            setCmt({"content": ""})
            setIsSending(false);
        }
    }


    const renderComment = ({ item }) => (
        item && item.user ? (
            <View style={[Styles.contentPost, Styles.shadow, {
                paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 10,
                backgroundColor: "white", borderRadius: 5,
            }]}>

                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Image style={[Styles.avatar, { marginLeft: 0, marginTop: 0, padding: 20, }]}
                            source={item?.user?.avatar_url ? (
                                { uri: item?.user?.avatar_url }
                            ) : (
                                require('./../../../../assets/images/avatar1.png')
                            )}
                        />
                    </View>
                    {/* {console.log("Thong tin user comment", item.user)} */}
                    <View style={{ marginLeft: -30, marginTop: 33, marginRight: 10 }}>
                        <TouchableOpacity>
                            {item.user?.role === "Chu_Nha_Tro" && user.user.role === "Nguoi_Thue_Tro" ? (
                                <TouchableOpacity onPress={() => toggleFollowUser(item.user.id)}>
                                    {followedUser.includes(item.user.id) ? (
                                        <Entypo name="circle-with-minus" size={15} color="black" />
                                    ) : (
                                        <Entypo name="circle-with-plus" size={15} color="black" />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={{ padding: 9 }}></View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={{flex: 1}}>
                        <Text style={{ fontWeight: 'bold' }}>{item.user?.first_name} {item.user?.last_name}</Text>
                        <Text style={{ fontSize: 10 }}>{moment(item.created_at).fromNow()}</Text>
                        <Text>{item.content}</Text>
                    </View>

                    <TouchableOpacity onPress={() => toggleCommentMenu(item.id)}>
                        <View style={{ alignSelf: 'flex-end', paddingRight: 10 }}>
                            <Entypo name="dots-three-horizontal" size={20} color="black" />
                        </View>
                    </TouchableOpacity>

                    {activeCommentMenu == item.id && <PopUpMenuComment isVisible={true} commentItem={item} onClose={() => toggleCommentMenu(item.id)} />}
                            
                </View>
            </View>
        ) : (
            <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'gray' }}>Hãy là người đầu tiên bình luận về post!</Text>
            </View>
        )
    );


    return (
        <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <Pressable onPress={onClose} style={[Styles.overlay, { height: '100%' }]} />
            <View style={[{
                width: '100%', backgroundColor: "white", minHeight: '100%', maxHeight: '100%',
                paddingTop: 20, paddingLeft: 20, paddingRight: 20,
                marginTop: -20

            }]}>
                <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row', top: -15, width: 80, borderRadius: 5, left: -10 }}>
                    <Entypo name="chevron-left" size={20} color="black" />
                    <Text style={{ fontWeight: "bold" }}>Quay lại</Text>
                </TouchableOpacity>


                {/* Post Header */}
                <View style={[Styles.post, {}]}>
                    {/* {console.info(post)} */}
                    <View style={{ height: 30, marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}>
                            {/* Avatar user create post */}
                            <View>
                                <Image
                                    source={post?.user?.avatar_url ? (
                                        { uri: post?.user?.avatar_url }
                                    ) : (
                                        require('./../../../../assets/images/avatar1.png')
                                    )}
                                    style={[Styles.avatar, { marginLeft: 0, marginTop: 0, padding: 20 }]} />
                            </View>

                            <View style={{ marginLeft: -30, marginTop: 33, marginRight: 10 }}>
                                <TouchableOpacity>
                                    {post.user?.role === "Chu_Nha_Tro" ? (
                                        <TouchableOpacity onPress={() => toggleFollowUser(item.user.id)}>
                                            {followedUser.includes(post.user.id) ? (
                                                <Entypo name="circle-with-minus" size={15} color="black" />
                                            ) : (
                                                <Entypo name="circle-with-plus" size={15} color="black" />
                                            )}
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{ padding: 9 }}></View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '500' }}>
                                    {post.user.first_name + ' ' + post.user.last_name}
                                </Text>
                                <Text style={{ fontSize: 10 }}>
                                    {moment(post.created_at).fromNow()}
                                </Text>
                            </View>

                            <TouchableOpacity>
                                <View style={{ alignSelf: 'flex-end', paddingRight: 10 }}>
                                    <Entypo name="dots-three-horizontal" size={20} color="red" />
                                </View>
                            </TouchableOpacity>
                            {/* Pop-up menu only shows if the post's id matches the activePostMenu */}
                            {activePostMenu === post.id && <PopUpMenuPost isVisible={true} onClose={() => togglePostMenu(post.id)} />}
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10, paddingBottom: 20 }}>
                        <View style={{ width: 40 }}></View>
                        <View>
                            <View>
                                {/* Title */}
                                <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 10 }]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    >{post.title}</Text>
                                </View>

                                {/* Location & Price */}
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 2, width: '60%' }]}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: Colors.Blue }}
                                            multiline={true}
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                        >{post.detail_address + ', ' + post.ward + ', ' + post.district + ', ' + post.city}</Text>
                                    </View>

                                    <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 2, }]}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: Colors.Red }}>
                                            Giá mong muốn:
                                        </Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: Colors.Red }}>
                                            {currency(post.price, { separator: ',', symbol: "", decimals: 0 }).format().replace('.00', '')} ₫
                                        </Text>
                                    </View>
                                </View>

                                {/* Content */}
                                <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 0 }]}>
                                    <Text style={{ fontStyle: 'italic' }}
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    >{post.content}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: '100%', backgroundColor: 'white', height: '90%', padding: 10, borderTopRightRadius: 15, }}>
                    <View style={{ height: '60%', backgroundColor: "", borderRadius: 5 }}>
                        <FlatList
                            data={commentsInPost.slice().reverse()}         // Use the commentsInPost state for the data
                            keyExtractor={(item) => item.id.toString()}   // Ensure unique key for each comment
                            renderItem={renderComment}  // Render each comment using the renderComment function
                            refreshing={loading}
                            onRefresh={loadComment}
                            ListEmptyComponent={
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'gray' }}>Chưa có bình luận nào...</Text>
                                </View>
                            }
                            contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom
                        />
                    </View>
                    <View style={{ height: '20%', width: '85%', }}>
                        <View style={[{ flexDirection: 'row', marginLeft: -8, borderRadius: 15, }, Styles.shadowAll]}>
                            {!isFocused && (
                                <View style={{ width: '10%', flexDirection: 'row', marginTop: 3 }}>
                                    <View >
                                        <Image source={user.user ? (
                                            { uri: user.user.avatar_url }
                                        ) : (
                                            require("./../../../../assets/images/avatar1.png")
                                        )}
                                            style={{ width: 30, height: 30, alignSelf: 'center', marginTop: 5, borderRadius: 20 }}>

                                        </Image>
                                    </View>
                                </View>
                            )}

                            <View style={{ marginLeft: 10, width: isFocused ? '500' : '100%', }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput value={cmt.content} onChangeText={t => changed("content", t)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        placeholder='Aa ...'
                                        multiline={true}
                                        numberOfLines={3}
                                        textAlignVertical='top'
                                        
                                        style={[isFocused && Styles.textInputFocused,
                                        {
                                            backgroundColor: "white",
                                            borderRadius: 15, marginLeft: 5, width: !isFocused ? '100%' : '60%',
                                            minHeight: 30,
                                            maxHeight: 120,
                                        }
                                        ]} />
                                    {isFocused && (
                                        <TouchableOpacity style={[{ width: '10%', marginLeft: -30 }]}
                                            onPress={sendComment}
                                        >
                                            {loading ? (
                                                <ActivityIndicator />
                                            ) : (
                                                <Feather name="send" size={24} color="black" style={{ marginTop: 10 }} />
                                            )}
                                        </TouchableOpacity>
                                    )}

                                </View>
                            </View>

                            {!isFocused && (
                                <TouchableOpacity style={[{ width: '10%', marginLeft: -30 }]}
                                    onPress={sendComment}
                                >
                                    {isSending ? (
                                        <ActivityIndicator />
                                    ) : (
                                        <Feather name="send" size={24} color="black" style={{ marginTop: 10 }} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
