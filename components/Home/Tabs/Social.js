import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Styles from '../../../constants/styles/Styles';
import { Colors } from '../../../constants/color/Colors';

// Icon imports
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Components
import PopUpMenuPost from './Social/PopUpMenuPost';
import Comment from './Social/Comment';
import APIs, { endpoints } from '../../../config/APIs';
import { getToken } from '../../../utils/storage';
import MyContact from '../../../config/MyContact';

// Format date
import moment from 'moment';
import 'moment/locale/vi';

// Currency formatting
import currency from 'currency.js';

export default function Social() {
    const navigater = useNavigation();
    const [user, dispatch] = useContext(MyContact);
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activePostMenu, setActivePostMenu] = useState(null);
    const [activeComment, setActiveComment] = useState(null);
    const [activeCommentPost, setActiveCommentPost] = useState(null);

    const [hasMore, setHasMore] = useState(false);
    const [nextPage, setNextPage] = useState('');


    const togglePostMenu = (postId) => {
        setActivePostMenu(activePostMenu === postId ? null : postId);
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

    const [followedPost, setFollowedPost] = useState([]);

    const toggleFollowPost = async (post) => {
        console.info("Toggling follow for user:", post?.user_id);

        const token = await getToken();
        const isFollowing = followedPost[post.id] || false;

        try {
            console.info("Is Following:", isFollowing);
            const endpoint = isFollowing ? endpoints['post-unfollow'] : endpoints['post-follow'];

            const response = await APIs.post(endpoint,
                { followed: post?.user_id }, // Only send `followed`, backend sets `follower`
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.status === 201) { // Check if backend returns 201 (Created)
                setFollowedPost((prevState) => ({
                    ...prevState,
                    [post.id]: !prevState[post.id], // Toggle follow state
                }));
            } else {
                console.warn("Failed to toggle follow state, status:", response.status);
            }
        } catch (error) {
            console.error("Error while toggling follow state:", error.response?.data || error.message);
        }
    };



    const loadFindPost = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            let res = await APIs.get(endpoints['find-room-post'], {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });



            if (res?.data?.results) {
                setFeed(res?.data?.results);

                setNextPage(res?.data?.next);
                console.info(res.data.next);
            } else {
                console.log("Không có rental post nào thỏa điều kiện !");
            }

            // console.info(feed);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        try {
            setHasMore(true);
            const token = await getToken();
            console.info(nextPage.split('?')[1]);
            let url = `${endpoints['find-room-post']}?${nextPage.split("?")[1]}`

            const res = await APIs.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    timeout: 5000,
                }
            });

            if (res?.data?.results) {
                setFeed((prev) => {
                    const newPosts = res.data.results.filter(newPost => !prev.some(prevPost => prevPost.id === newPost.id));
                    return [...prev, ...newPosts];
                });
                setNextPage(res?.data?.next);
            }
            else { setNextPage(null) }
            
            setHasMore(false);
        } catch (ex) {
            setHasMore(false);
            console.info(ex.status);
        }
    }

    useEffect(() => {
        loadFindPost();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadFindPost();
        }, [])
    );

    const renderPost = ({ item }) => {
        return (
            <View style={[Styles.post, {}]}>
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
                        {/* {console.log(item?.user?.role)} */}
                        <View style={{ marginLeft: -30, marginTop: 33, marginRight: 10 }}>
                            {item?.user?.role === "Chu_Nha_Tro" ? (
                                <TouchableOpacity onPress={() => toggleFollowPost(item)}>
                                    {followedPost[item.id] ? (
                                        <Entypo name="circle-with-minus" size={15} color="black" />
                                    ) : (
                                        <Entypo name="circle-with-plus" size={15} color="black" />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={{ padding: 9 }}></View>
                            )}
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

                        {activePostMenu === item.id && <PopUpMenuPost isVisible={true} findPost={item} onClose={() => togglePostMenu(item.id)} />}
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
    };

    return (
        <View style={{ maxHeight: '100%', maxWidth: '100%', height: '100%', paddingTop: 10, marginTop: 10, paddingLeft: 15, paddingRight: 10 }}>
            <View style={[{ backgroundColor: "white", height: "10%", borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }, Styles.shadow]}>
                <View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', width: '100%' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'left', marginRight: 10, marginTop: 10, marginLeft: 10, fontSize: 20, fontWeight: 'bold' }}>Rent House</Text>
                        </View>
                        <View style={{ alignSelf: 'flex-end', flexDirection: 'row', marginRight: 10 }}>
                            {/* Create a post */}
                            {user?.user?.role === "Nguoi_Thue_Tro" ? (
                                <TouchableOpacity
                                    style={{ alignItems: 'center', alignSelf: 'flex-end', marginLeft: 10 }}
                                    onPress={() => navigater.navigate('CreatePost')}
                                >
                                    <Feather name="plus-square" size={24} color="black" />
                                </TouchableOpacity>
                            ) : null}
                            {/* Notifications */}
                            <TouchableOpacity onPress={() => navigater.navigate("Notification")}>
                                <AntDesign name="hearto" size={24} color={"black"} style={{ textAlign: 'right', marginTop: 15, marginLeft: 10 }} />
                            </TouchableOpacity>
                            {/* Profile */}
                            <TouchableOpacity onPress={() => navigater.navigate('Profile')}
                                style={[{ height: 30, width: 30, backgroundColor: "white", borderRadius: 10, borderColor: "lightgrey", borderWidth: 3, marginTop: 10, marginLeft: 10 }]}>

                                <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }} source={user?.user?.avatar_url ? ({ uri: user?.user?.avatar_url }) : require('./../../../assets/images/avatar1.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={feed}
                    renderItem={renderPost}
                    keyExtractor={(item, index) => item?.id ? `post-${item.id}` : `fallback-${index}`}
                    style={{ marginTop: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={loadFindPost}
                            colors={["#ff6347", "#32cd32", "#1e90ff"]}
                            tintColor="#ff6347"
                            title="Đang tải..."
                            titleColor="#ff6347"
                        />
                    }
                    onEndReachedThreshold={1}
                    onEndReached={() => {
                        if (nextPage) {
                            loadMore();
                        }
                    }}
                    ListFooterComponent={() => {
                        if (!nextPage && !hasMore) {
                            return (
                                <Text style={{ textAlign: 'center', color: 'black', marginVertical: 10, fontSize: 16 }}>
                                    --- Hết danh sách ---
                                </Text>
                            )
                        }
                        else{
                            return (
                                <ActivityIndicator size='small' color='black' />
                            )
                        }
                    }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
