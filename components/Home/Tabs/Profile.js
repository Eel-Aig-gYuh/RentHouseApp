import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';;
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Styles from '../../../constants/styles/Styles';
import { Colors } from '../../../constants/color/Colors'


// Icon
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import MyContact from '../../../config/MyContact';
import Comment from './Social/Comment';

import { getToken, removeToken } from '../../../utils/storage';
import APIs, { endpoints } from '../../../config/APIs';

// Currency formatting
import currency from 'currency.js';
import moment from 'moment';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import auth from '../../../firebase.config';

export default function Profile() {
    const navigater = useNavigation();
    const [user, dispatch] = useContext(MyContact) || [{}, () => { }];

    const [loading, setLoading] = useState(false);
    const [isLikedPostClick, setIsLikedPostClick] = useState(true);
    const [activePostMenu, setActivePostMenu] = useState(null);
    const [activeComment, setActiveComment] = useState(null);
    const [activeCommentPost, setActiveCommentPost] = useState([]);

    const [data, setData] = useState([]);
    const [feed, setFeed] = useState([]);
    const [savedPosts, setSavedPosts] = useState(user?.user?.saved_posts || []);

    useEffect(() => {
        setSavedPosts(user?.user?.saved_posts);
    }, [user])

    const logout = async () => {
        try {
            // Clear user data from global state
            dispatch({ type: "logout" });
    
            // Remove authentication tokens from AsyncStorage
            await removeToken();
            await signOut(auth);
    
            // Reset navigation to Login screen
            navigater.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
    
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                logout();
            }
        });
    
        return () => unsubscribe(); // Cleanup listener khi component unmount
    }, []);

    const renderSavePosts = ({ item }) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: "white", minHeight: 100, maxHeight: 150, borderRadius: 15,
                marginBottom: 5, marginTop: 5,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                elevation: 7,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[{
                        height: 100, width: 100, backgroundColor: "white", margin: 5, borderRadius: 10,
                        borderColor: Colors.LightGray, borderWidth: 3,
                    }]}>
                        <Image style={{ width: 95, height: 95, borderRadius: 10, alignSelf: 'center' }}
                            source={data && isLikedPostClick ? (
                                { uri: item?.images[0] }
                            ) : (
                                require('./../../../assets/images/house3.png')
                            )} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item?.title.length > 35 ? item?.title.slice(0, 35) + "..." : item?.title}</Text>
                        <Text style={{ fontSize: 10 }}>Mô tả: {item?.content.length > 35 ? item?.content.slice(0, 35) + "..." : item?.content}</Text>
                        <Text style={{ fontWeight: 'bold', color: Colors.SearchButton }}>
                            Giá: {currency(item.price, { separator: ',', symbol: "", decimals: 0 }).format().replace('.00', '')}₫ / tháng
                        </Text>

                        <Text style={{ fontSize: 10, fontStyle: 'italic' }}>Ngụ tại: {item?.ward + ', ' + item?.district + ', ' + item?.city}</Text>

                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ width: '20%' }}>
                                <TouchableOpacity style={[{
                                    height: 30, width: 30, backgroundColor: "white", margin: 5, borderRadius: 10,
                                    borderColor: Colors.LightGray, borderWidth: 3
                                }]}>
                                    <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }}
                                        source={item?.user?.avatar_url ? (
                                            { uri: item?.user?.avatar_url }
                                        ) : (
                                            require('./../../../assets/images/avatar1.png')
                                        )} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '50%' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text>{item?.user ? item?.user?.first_name + " " + item?.user?.last_name : "Tên User"}</Text>
                                    <Text style={{ fontSize: 10 }}>Số tin đăng</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => toggleSavePost(item.id)}  // Toggle save for this specific post
                                style={{  }}
                            >
                                {savedPosts?.includes(item.id) ? (
                                    <AntDesign style={{ marginTop: 10 }} name="heart" size={24} color="tomato" />
                                ) : (
                                    <AntDesign style={{ marginTop: 10 }} name="hearto" size={24} color="tomato" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    const renderSocialFeed = ({ item }) => {
        console.info("feed is call ", data);
        return (
            <View style={[Styles.post, { position: 'relative' }]}>
                <View style={{ height: 30, marginTop: 15 }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}>
                        {/* Avatar user create post */}
                        <View>
                            <Image
                                source={item?.user?.avatar_url ? (
                                    { uri: item?.user?.avatar_url }
                                ) : (
                                    require('./../../../assets/images/avatar1.png')
                                )}
                                style={[Styles.avatar, { marginLeft: 0, marginTop: 0, padding: 20 }]} />
                        </View>


                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '500' }}>
                                {item?.user?.first_name + ' ' + item?.user?.last_name}
                            </Text>
                            <Text style={{ fontSize: 10 }}>
                                {moment(item.created_at).fromNow()}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => togglePostMenu(item.id)}>
                            <View style={{ alignSelf: 'flex-end', paddingRight: 10 }}>
                                <Entypo name="dots-three-horizontal" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                        {/* Pop-up menu only shows if the post's id matches the activePostMenu */}
                        {activePostMenu === item.id && <PopUpMenuPost isVisible={true} onClose={() => togglePostMenu(item.id)} />}
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
                                >{item.title}</Text>
                            </View>

                            {/* Location & Price */}
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 2, width: '60%' }]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 10, color: Colors.Blue }}
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    >{item.detail_address + ', ' + item.ward + ', ' + item.district + ', ' + item.city}</Text>
                                </View>

                                <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 2, }]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 10, color: Colors.Red }}>
                                        Giá mong muốn:
                                    </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 10, color: Colors.Red }}>
                                        {currency(item.price, { separator: ',', symbol: "", decimals: 0 }).format().replace('.00', '')} ₫
                                    </Text>
                                </View>
                            </View>

                            {/* Content */}
                            <View style={[Styles.contentPost, { paddingLeft: 10, paddingRight: 20, paddingBottom: 0, paddingTop: 0 }]}>
                                <Text style={{ fontStyle: 'italic' }}
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                >{item.content}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 10 }}>
                    <View style={{ width: 40 }}></View>
                    <View>
                        <View>
                            <View style={{ flexDirection: 'row', padding: 1 }}>
                                <TouchableOpacity style={[{ marginLeft: 10 }]} onPress={() => toggleComment(item)}>
                                    <FontAwesome5 name="comment-alt" size={20} color="black" />
                                </TouchableOpacity>

                                {console.info(item)}

                                {activeComment === item.id &&
                                    <Comment
                                        isVisible={true}
                                        onClose={() => toggleComment(item)}
                                        post={activeCommentPost} />}

                                <Text style={Styles.txt_count}>{item.commentsCount}</Text>
                                <TouchableOpacity style={[{ marginLeft: 10 }]} onPress={() => toggleSavePost(item.id)}>
                                    <MaterialCommunityIcons name="vector-link" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const getData = async () => {
        const token = await getToken();

        if (isLikedPostClick) {
            setLoading(true);
            setData(null);
            try {
                let res = await APIs.get(endpoints['rental-post-savePosts'], {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                // console.info(res.data);
                setData(res.data);

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
        else {
            setLoading(true);
            setData(null);
            try {
                let res = await APIs.get(endpoints['find-room-post/my-find-room-post'], {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        timeout: 5000,
                    }
                });
                // console.info(res.data);
                setFeed(res.data);

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    const toggleSavePost = async (postId) => {
        const token = await getToken();

        try {
            let updatedSavedPosts;

            if (savedPosts?.includes(postId)) {
                await APIs.delete(endpoints['rental-post-delete_savePosts'](postId), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedSavedPosts = savedPosts.filter(id => id !== postId); // Remove postId from savedPosts
                getData();
            } else {
                await APIs.post(endpoints['rental-post-save_savePosts'], { post_id: postId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedSavedPosts = [...savedPosts, postId]; // Add postId to savedPosts
                getData();
            }

            setSavedPosts(updatedSavedPosts); // Update state after API call succeeds
        } catch (ex) {
            console.error("Error saving post", ex);
        }
    };

    const toggleComment = (post) => {
        if (activeComment === post.id) {
            setActiveComment(null);
            setActiveCommentPost(null);
        } else {
            setActiveComment(post.id);
            setActiveCommentPost(post);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if(user?.user?.role==="Nguoi_Thue_Tro")
                getData();
        }, [])
    );

    useEffect(() => {
        if(user?.user?.role==="Nguoi_Thue_Tro")
            getData();
    }, [isLikedPostClick]);


    return (
        <View style={{ height: '100%', backgroundColor: "white", paddingTop: 30, paddingLeft: 10, paddingRight: 15 }}>

            <View style={{ height: '30%' }}>
                <View style={{
                    display: 'flex', flexDirection: 'row', alignContent: 'center',
                }}>
                    <Text style={{
                        flex: 1,
                        textAlign: 'left', marginRight: 10,
                        fontSize: 20, fontWeight: 'bold'
                    }}>{user ? user?.user?.email : "User Email"}</Text>



                    <TouchableOpacity
                        onPress={() => navigater.navigate('CreatePost')}
                    >
                        <Feather name="plus-square" size={24} color="black"
                            style={{ textAlign: 'right', }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={logout}
                    >
                        <AntDesign name="logout" size={24} color="tomato" backgroundColor="#fee2e2"
                            style={{ textAlign: 'right', marginLeft: 15, borderRadius: 99 }} />
                    </TouchableOpacity>

                </View>

                <View style={{flexDirection: 'row'}}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Image source={user?.user?.avatar_url ? { uri: user?.user?.avatar_url } : (
                                require('./../../../assets/images/avatar1.png')
                            )}
                                style={Styles.avatar} />

                            <TouchableOpacity
                                onPress={() => navigater.navigate('ProfileDetail')}>
                                <FontAwesome6 name="pen-to-square" size={15} color="black" style={Styles.editIcon} />
                            </TouchableOpacity>

                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', paddingLeft: 10 }}>
                                {user ? user?.user?.first_name + ' ' + user?.user?.last_name : "Full Name"}
                            </Text>
                        </View>
                    </View>

                    <View style={{alignSelf: 'center', marginRight: 20, padding: 7, backgroundColor: user?.user.role==="Chu_Nha_Tro"? Colors.Green: Colors.Blue, borderRadius: 10}}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>{user?.user.role==="Chu_Nha_Tro"? "Chủ Nhà Trọ" : "Người Thuê Trọ"}</Text>
                    </View>
                </View>
            </View>

            <View style={{ height: '20%', paddingTop: 40, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        onPress={() => setIsLikedPostClick(false)}
                    >
                        <FontAwesome5 name="list" size={24} style={{ color: (!isLikedPostClick ? "black" : "lightgrey") }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsLikedPostClick(true)}
                    >
                        <MaterialIcons name="favorite" size={24} style={{ color: (isLikedPostClick ? Colors.Red : "lightgrey") }} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Posts in social */}

            {/* Posts are liked */}
            {/* {console.info("isLidke:  ", isLikedPostClick)} */}
            <View style={{ height: '70%' }}>
                <View style={{ backgroundColor: Colors.SearchButton, height: '80%', borderRadius: 15, marginTop: -15 }}>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.White} style={{ marginTop: 10 }} />
                    ) : (
                        <FlatList
                            data={isLikedPostClick ? data : feed} // Ensure `data` is always an array
                            renderItem={isLikedPostClick ? renderSavePosts : renderSocialFeed}
                            keyExtractor={(item) => item.id?.toString()} // Ensure key is a string
                            refreshing={loading}
                            onRefresh={user?.user.role==='Nguoi_Thue_Tro'?getData: null}
                            ListEmptyComponent={() => (
                                <Text style={{ textAlign: 'center', color: Colors.White, marginTop: 20 }}>
                                    No posts available.
                                </Text>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }} // Add bottom padding here
                        />
                    )}
                </View>
            </View>
        </View>
    );
}