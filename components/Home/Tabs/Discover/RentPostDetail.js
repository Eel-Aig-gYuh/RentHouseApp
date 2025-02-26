import { View, Text, Image, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Animated } from 'react-native'
import React, { act, useContext, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import Styles from '../../../../constants/styles/Styles';
import { Colors } from '../../../../constants/color/Colors';

// icon
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import APIs, { endpoints } from '../../../../config/APIs';
import { getToken } from '../../../../utils/storage';

// Currency formatting
import currency from 'currency.js';
import moment from "moment-timezone";
import MyContact from '../../../../config/MyContact';
import PopUpMenuPostDetail from './PopUpMenuPostDetail';

// firestore 
import { doc, updateDoc, arrayUnion, query, getDoc, getDocs, where, setDoc } from "firebase/firestore";
import { db, userRef } from '../../../../firebase.config';
import { getRoomId } from '../../../../utils/common';

export default function PostDetail({ }) {
    const route = useRoute();
    const [user, dispatch] = useContext(MyContact);

    const navigater = useNavigation();
    const { rentalPostId } = route.params;
    const [savedPosts, setSavedPosts] = useState(route.params.savedPosts);

    const [rentalPostDetail, setRentalPostDetail] = useState(null);
    const [userPost, setUserPost] = useState(null);
    const [topImage, setTopImage] = useState(null);

    const [activePostMenu, setActivePostMenu] = useState(null);

    const togglePostMenu = () => {
        setActivePostMenu(!activePostMenu);
    };

    // const [savedPosts, setSavedPosts] = useState(user?.user?.saved_posts || []);

    const [scrollY] = useState(new Animated.Value(0)); // Track scroll position

    const formatToVietnamTime = (utcDateString) => {
        return moment.utc(utcDateString)
            .tz("Asia/Ho_Chi_Minh")
            .format("[ngày] D [tháng] M [năm] YYYY");
    };

    const chooseAndShowImg = (uri) => {
        uri ? setTopImage(uri) : null
    }

    const toggleSavePost = async (postId) => {
        const token = await getToken();

        try {
            let updatedSavedPosts;

            if (savedPosts.includes(postId)) {
                await APIs.delete(endpoints['rental-post-delete_savePosts'](postId), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedSavedPosts = savedPosts.filter(id => id !== postId);
            } else {
                await APIs.post(endpoints['rental-post-save_savePosts'], { post_id: postId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedSavedPosts = [...savedPosts, postId];
            }

            const updatedUser = { ...user.user, saved_posts: updatedSavedPosts };

            dispatch({
                type: "SET_USER",  // Ensure this action updates the whole user object
                payload: updatedUser,
            });

            // Dispatch action to update global state
            dispatch({
                type: "UPDATE_SAVED_POSTS",
                payload: updatedSavedPosts
            });

            setSavedPosts(updatedSavedPosts);

            console.log('Updated Saved Posts:', updatedSavedPosts);

        } catch (ex) {
            console.error("Error saving post", ex);
        }
    };


    const [users, setUsers] = useState([]);


    const getUsers = async (emailPostUser) => {
        try {


            // Query all users except the one whose email matches `emailPostUser`
            const q = query(userRef, where("email", "==", emailPostUser));

            const querySnapShot = await getDocs(q);

            let data = [];
            querySnapShot.forEach(doc => {
                data.push({ ...doc.data(), id: doc.id });
            });

            setUsers(data); // Update state with filtered users
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    const gotoMessage = async (currentUserId, selectedUserId) => {

        // console.info('Current uid: ', currentUserId);
        // console.info(selectedUserId);

        getUsers(selectedUserId.email);

        if (users[0]){
            createRoomIfNotExists(currentUserId, users[0]?.userId);
        }
    };

    const createRoomIfNotExists = async (currentUserId, selectedUserId) => {
        // room id
        let roomId = getRoomId(currentUserId, selectedUserId);

        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    useEffect(() => {
        navigater.setOptions({
            headerShown: false
        });
        // console.info(route.params.savedPosts);
        loadDetail();
    }, [!activePostMenu]);

    const data = [
        // More Images
        {
            type: 'images',
            images: rentalPostDetail ? rentalPostDetail.images : null,
        },
        // Title
        { type: 'title', text: rentalPostDetail ? rentalPostDetail.title : null },
        // Price
        { type: 'price', text: rentalPostDetail ? rentalPostDetail.price : null },
        // Location
        {
            type: 'location',
            text: rentalPostDetail
                ? `${rentalPostDetail.detail_address}, ${rentalPostDetail.ward}, ${rentalPostDetail.district}, ${rentalPostDetail.city}`
                : null,
        },
        // Updated at
        {
            type: 'updated_at', text: rentalPostDetail ?
                `Cập nhật lần cuối vào ${formatToVietnamTime(rentalPostDetail.updated_at)}`
                : null
        },
        // Description
        { type: 'description', text: rentalPostDetail ? rentalPostDetail.content : null },
    ];

    const loadDetail = async () => {
        try {
            const accessToken = await getToken();
            let res = await APIs.get(endpoints['rental-post-detail'](user.user.role === "Admin" ? route.params.rentalPostDetail : rentalPostId), {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setRentalPostDetail(res.data);
            setUserPost(res.data?.user);

        } catch (ex) {
            console.error(ex);
        }
    }

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'images':
                return (
                    <View style={{ height: 130, backgroundColor: Colors.Green, padding: 5, paddingLeft: 10 }}>
                        <FlatList
                            data={item.images}
                            horizontal
                            keyExtractor={(image, index) => index.toString()}
                            renderItem={({ item: image }) => (
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        height: 102, width: 102,
                                        alignSelf: 'center', alignContent: 'center',
                                        marginRight: 10, borderRadius: 10,
                                    }}
                                >
                                    <TouchableOpacity onPress={() => chooseAndShowImg(image)}>
                                        <Image
                                            source={{ uri: image }}
                                            style={{
                                                width: 100, height: 100,
                                                borderRadius: 10,
                                                alignSelf: 'center', marginTop: 1,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                );
            case 'title':
                return (
                    <Text
                        style={{
                            flex: 1,
                            marginLeft: 10, marginTop: 10,
                            fontSize: 25, fontWeight: 'bold',
                        }}
                    >
                        {item.text}
                    </Text>
                );
            case 'price':
                return (
                    <Text
                        style={{
                            flex: 1,
                            marginLeft: 10, marginTop: 10,
                            fontSize: 20, fontWeight: 'bold', fontStyle: 'italic',
                            color: Colors.Red,
                        }}
                    >
                        Giá: {currency(item.text, { separator: ',', symbol: "", decimals: 0 }).format().replace('.00', '')}₫ / tháng
                    </Text>
                );
            case 'location':
                return (
                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                        <Entypo name="location" size={20} color="grey" />
                        <Text style={{ marginLeft: 10 }}>{item.text}</Text>
                    </View>
                );
            case 'updated_at':
                return (
                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10 }}>
                        <Entypo name="back-in-time" size={20} color="grey" />
                        <Text style={{ marginLeft: 10 }}>{item.text}</Text>
                    </View>
                );
            case 'description':
                return (
                    <>
                        <Text
                            style={{
                                flex: 1,
                                marginLeft: 10, marginBottom: 10, marginTop: 10,
                                fontSize: 20, fontWeight: 'bold',
                            }}
                        >
                            Mô tả
                        </Text>
                        <Text style={{ paddingLeft: 10, paddingRight: 20, textAlign: 'justify' }}>{item.text}</Text>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Animated.View
                style={{
                    height: scrollY.interpolate({
                        inputRange: [0, 300], // Khi cuộn từ 0 đến 250px
                        outputRange: ['55%', '20%'], // Hình ảnh sẽ thu nhỏ từ 55% xuống 20% chiều cao của màn hình
                        extrapolate: 'clamp',
                    }),
                    opacity: scrollY.interpolate({
                        inputRange: [0, 100], // Khi cuộn từ 0 đến 100px
                        outputRange: [1, 0.2], // Hình ảnh sẽ mờ dần từ 1 đến 0 khi cuộn
                        extrapolate: 'clamp',
                    }),
                }}
            >
                <View style={{
                    height: '55%',

                }}>
                    <Image source={topImage ? { uri: topImage } : { uri: rentalPostDetail?.images[0] }}
                        style={[Styles.imgs]}
                    />
                    <SafeAreaView style={{
                        flex: "absolute", flexDirection: 'row', top: 40, marginLeft: 10,
                        width: '90%', position: 'absolute'
                    }}>

                        <View
                            style={{ flexDirection: 'row', flex: 1 }}>

                            <TouchableOpacity style={{ flex: 1 }} onPress={() => { navigater.setParams({ savedPosts }); navigater.goBack(); }}>
                                <AntDesign name="back" size={24} color="black"
                                    style={[Styles.buttonBack, { padding: 2, backgroundColor: Colors.Green, color: "white", }]}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => togglePostMenu()}
                                style={{}}>
                                <Entypo name="dots-three-horizontal" size={24} color="black"
                                    style={[Styles.buttonBack, { paddingLeft: 3, paddingTop: 4, backgroundColor: Colors.Green, color: "white", }]}
                                />
                            </TouchableOpacity>

                            {/* {console.info(rentalPostDetail)} */}
                            {activePostMenu ? (
                                <PopUpMenuPostDetail isVisible={true} onClose={() => togglePostMenu()}
                                    authorID={rentalPostDetail.user.id}
                                    post={rentalPostDetail}
                                />
                            ) : (
                                null
                            )}

                        </View>
                    </SafeAreaView>

                </View>
            </Animated.View>

            <Animated.FlatList
                data={data}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 50 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                nestedScrollEnabled={true} // Enables smooth scrolling for nested lists
                ListHeaderComponent={() => (
                    <View style={{
                        backgroundColor: "white",
                        borderTopRightRadius: 20, borderTopLeftRadius: 20,
                        paddingVertical: 10
                    }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={{
                                height: 40, width: 40, backgroundColor: "white",
                                borderRadius: 10, borderColor: Colors.LightGray, borderWidth: 3
                            }}>
                                <Image
                                    style={{ width: 40, height: 40, borderRadius: 10, alignSelf: 'center' }}
                                    source={userPost ? {
                                        uri: userPost.avatar_url
                                            ? userPost.avatar_url
                                            : require('./../../../../assets/images/avatar1.png'),
                                    } : null}
                                />
                            </TouchableOpacity>

                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                    {userPost ? (() => {
                                        const fullName = `${userPost.first_name} ${userPost.last_name}`;
                                        return fullName.length > 11 ? fullName.slice(0, 11) + "..." : fullName;
                                    })() : null}
                                </Text>
                                <Text style={{ fontSize: 13 }}>Số tin đăng</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginLeft: '10' }}>
                                <TouchableOpacity style={{
                                    flexDirection: 'row', backgroundColor: Colors.Green,
                                    height: 35, borderRadius: 5, paddingHorizontal: 10, alignItems: 'center'
                                }}>
                                    <Feather name="phone-call" size={20} color="white" />
                                    <Text style={{ color: "white", fontWeight: 'bold', marginLeft: 5 }}>Gọi</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => gotoMessage(user?.user?.uid, userPost)}

                                    style={{
                                        flexDirection: 'row', backgroundColor: "white",
                                        height: 35, borderRadius: 5, borderWidth: 1.3,
                                        paddingHorizontal: 10, alignItems: 'center', marginLeft: 8
                                    }}>
                                    <MaterialCommunityIcons name="message-text-outline" size={20} color={'black'} />
                                    <Text style={{ color: "black", fontWeight: 'bold', marginLeft: 5 }}>Chats</Text>
                                </TouchableOpacity>
                            </View>

                            {user.user.role === "Admin" ? (
                                null
                            ) : (
                                <TouchableOpacity
                                    onPress={() => toggleSavePost(rentalPostDetail?.id)}  // Toggle save for this specific post
                                    style={{ marginLeft: 10, marginTop: -5 }}
                                >
                                    {savedPosts.includes(rentalPostDetail?.id) ? (
                                        <AntDesign style={{ marginTop: 10 }} name="heart" size={24} color="tomato" />
                                    ) : (
                                        <AntDesign style={{ marginTop: 10 }} name="hearto" size={24} color="tomato" />
                                    )}
                                </TouchableOpacity>
                            )}

                        </View>
                    </View>
                )}
            />

        </View>
    )
}