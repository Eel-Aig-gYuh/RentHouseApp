import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/color/Colors';
import { getToken } from '../../utils/storage';
import APIs, { endpoints } from '../../config/APIs';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const PostReview = () => {
    const navigater = useNavigation();

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

    const [nextPage, setNextPage] = useState('');
    const [hasMore, setHasMore] = useState(false);

    const [filter, setFilter] = useState({
        status: "",
        city: "",
        district: "",
        ward: "",
        min_price: "",
        max_price: "",
        min_area: "",
        max_area: "",
        occupants: "",
        address: "",
    });
    const defaultFilter = {
        status: "",
        city: "",
        district: "",
        ward: "",
        min_price: "",
        max_price: "",
        min_area: "",
        max_area: "",
        occupants: "",
        address: "",
    };

    useEffect(() => {
        loadPostReview();
    }, [filter]);

    const cancelFilter = () => {
        setFilter(defaultFilter);
    }

    const handleFilterSubmit = (query) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...Object.fromEntries(Object.entries(query).map(([key, value]) => [key, value ?? ""]))
        }));
    };

    const loadPostReview = async () => {
        setLoading(true);

        let token = await getToken();
        let url = endpoints['rental-post'];

        // console.info("Filter: ", filter);

        if (filter) {
            url = `${url}?status=${filter.status}&city=${filter.city}&district=${filter.district}&ward=${filter.ward}&min_price=${filter.min_price}&max_price=${filter.max_price}&min_area=${filter.min_area}&max_area=${filter.max_area}&occupants=${filter.occupants}&address=${filter.address}`
            console.info(url);
        }
        else {
            url = endpoints['rental-post'];
        }
        // console.info(url);

        try {
            console.info("URL: ", url);
            const res = await APIs.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    timeout: 5000,
                }
            });

            if (res.data.results) {
                setPosts(res?.data?.results);
                setNextPage(res?.data?.next);
                // console.info(res.data.next);
            } else {
                console.log("Không có rental post nào thỏa điều kiện !");
            }
            console.info(nextPage);

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const loadMore = async () => {
        try {
            const token = await getToken();
            let url = `${endpoints['rental-post']}?${nextPage.split("?")[1]}`;
    
            if (filter) {
                url = `${url}&status=${filter.status}&city=${filter.city}&district=${filter.district}&ward=${filter.ward}&min_price=${filter.min_price}&max_price=${filter.max_price}&min_area=${filter.min_area}&max_area=${filter.max_area}&occupants=${filter.occupants}&address=${filter.address}`;
            }
    
            const res = await APIs.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    timeout: 5000,
                }
            });
    
            if (res?.data?.results) {
                // Loại bỏ bài viết trùng ID
                setPosts((prev) => {
                    const newPosts = res.data.results.filter(newPost => !prev.some(prevPost => prevPost.id === newPost.id));
                    return [...prev, ...newPosts];
                });
                setNextPage(res?.data?.next);
            } else {
                setNextPage(null);
            }
        } catch (ex) {
            console.info(ex.status);
        }
    };
    

    useEffect(() => {
        loadPostReview();
    }, [filter]);

    const showConfirmDialog = (statusPost) => {
        return new Promise((resolve) => {
            Alert.alert(
                "Bạn có chắc chắn không?",
                `"Bạn có chắc chắn ${statusPost} bài này không?"`,
                [
                    {
                        text: "Có",
                        onPress: () => resolve(true),
                    },
                    {
                        text: "Không",
                        onPress: () => resolve(false),
                    },
                ]
            );
        });
    };


    const handleStatusPost = async (postId, statusPost) => {

        try {
            const token = await getToken();
            if (!token) {
                console.error("Token không tồn tại hoặc không hợp lệ!");
                Alert.alert("Lỗi", "Bạn cần đăng nhập lại!");
                return;
            }

            const isOK = await showConfirmDialog(statusPost);
            if (!isOK) return;

            let res = await APIs.patch(
                endpoints['rental-post-admin-changedStatus'],
                { post_id: postId, status: statusPost }, // Gửi đúng format mà backend yêu cầu
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.info(`"${statusPost} bài thành công!"`, res.data);
            Alert.alert("Thành công", `"${statusPost} bài thành công!"`);

            // Cập nhật trạng thái của bài viết trong danh sách
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, status: statusPost } : post
                )
            );

        } catch (ex) {
            console.error("Lỗi duyệt bài:", ex);
            Alert.alert("Lỗi", "Không thể duyệt bài. Vui lòng thử lại!");
        }
    };

    const goToRentalPostDetail = (rentalPostDetail) => {
        // console.info(rentalPostDetail);
        navigater.navigate('RentPostDetail', { rentalPostDetail });

    };

    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity onPress={() => goToRentalPostDetail(item.id)}
                style={{
                    backgroundColor: "white", minHeight: 100, maxHeight: 150, borderRadius: 15,
                    marginBottom: 5, marginTop: 5, shadowRadius: 5,
                    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, elevation: 7,
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[{
                        height: 100, width: 100, backgroundColor: "white", margin: 5, borderRadius: 10,
                        borderColor: Colors.LightGray, borderWidth: 3,
                    }]}>
                        <Image style={{ width: 95, height: 95, borderRadius: 10, alignSelf: 'center' }}
                            source={{ uri: item?.images[0] } || require('./../../assets/images/house3.png')} />
                    </TouchableOpacity>

                    <View style={{
                        height: 30, width: 70, backgroundColor: item.status === "Pending" ? Colors.Blue : item.status === "Allow" ? Colors.Green : Colors.Red, position: 'absolute',
                        alignItems: 'center', justifyContent: 'center',
                        borderRadius: 5, marginLeft: 2,
                    }}>
                        <Text style={{ color: "white", fontWeight: 'bold', fontStyle: 'italic' }}>{item.status}</Text>
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.title || "Tên Phòng Thuê"}</Text>
                        <Text style={{ fontSize: 10 }} >{"Mô tả: " + item.content.slice(0, 100) + " ..." || "Mô tả"}</Text>
                        <Text style={{ fontWeight: 'bold', color: Colors.SearchButton }}>{item.price || "Giá"}</Text>
                        <Text style={{ fontSize: 10 }}>{"Địa điểm: " + item.ward + ', ' + item.district + ', ' + item.city || "Địa điểm"}</Text>

                        <View style={{ flexDirection: 'row', }}>
                            <View style={{}}>
                                <TouchableOpacity style={[{
                                    height: 30, width: 30, backgroundColor: "white", margin: 5, borderRadius: 10,
                                    borderColor: Colors.LightGray, borderWidth: 3
                                }]}>
                                    <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }}
                                        source={{ uri: item.user?.avatar_url || './../../assets/images/avatar1.png' }} />
                                </TouchableOpacity>

                            </View>

                            <View style={{ marginTop: 5, width: '75' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text>{item.user?.first_name.slice(0, 10) + ' ' + item.user?.last_name.slice(0, 10) || "Tên User"}</Text>
                                    <Text style={{ fontSize: 10 }}>Số tin đăng</Text>
                                </View>
                            </View>

                            {item.status === "Pending" ? (
                                <TouchableOpacity style={{ alignSelf: 'flex-end' }}
                                    onPress={() => { handleStatusPost(item.id, "Allow") }}
                                >
                                    <View style={{
                                        height: 25, width: 60, backgroundColor: Colors.Green,
                                        alignSelf: 'center', borderRadius: 5, justifyContent: 'center', marginRight: 5,
                                    }}>
                                        <Text style={{
                                            color: "white", fontWeight: 'bold',
                                            fontSize: 14, fontStyle: 'italic', justifyContent: 'center',
                                            alignSelf: 'center', alignItems: 'center'
                                        }}>Duyệt</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                null
                            )}

                            {item.status === "Deny" ? (
                                null
                            ) : (
                                <TouchableOpacity style={{ alignSelf: 'flex-end' }}
                                    onPress={() => { handleStatusPost(item.id, "Deny") }}
                                >
                                    <View style={{
                                        height: 25, width: 60, backgroundColor: Colors.Red,
                                        alignSelf: 'center', borderRadius: 5, justifyContent: 'center',

                                    }}>
                                        <Text style={{
                                            color: "white", fontWeight: 'bold',
                                            fontSize: 14, fontStyle: 'italic', justifyContent: 'center',
                                            alignSelf: 'center', alignItems: 'center'
                                        }}>Hủy</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ marginTop: 10, marginBottom: 10 }}>
                <View style={[{
                    flexDirection: 'row', backgroundColor: "white", borderRadius: 7, padding: 5,
                    width: '100%'
                }]}>
                    <View style={{ width: '25%', marginRight: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: "gray" }}>Trạng thái: </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: "lightgray", borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => cancelFilter()}
                        >
                            <Text style={{ color: "black" }}>Tất cả</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: Colors.Blue, borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => handleFilterSubmit({ "status": "Pending" })}
                        >
                            <Text style={{ color: "white" }}>Pending</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: Colors.Green, borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => handleFilterSubmit({ "status": "Allow" })}
                        >
                            <Text style={{ color: "white" }}>Allow</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: Colors.Red, borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => handleFilterSubmit({ "status": "Deny" })}
                        >
                            <Text style={{ color: "white" }}>Deny</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>


            </View>


            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : `fallback-${index}`)}

                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: 'black', marginTop: 20, fontWeight: 'bold' }}>
                            Không có bài đăng thỏa điều kiện.
                        </Text>
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
                        else {
                            return (
                                <ActivityIndicator size='small' color='black' />
                            )
                        }
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={loadPostReview}
                            colors={["#ff6347", "#32cd32", "#1e90ff"]}
                            tintColor="#ff6347"
                            title="Đang tải..."
                            titleColor="#ff6347"
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }} // Add bottom padding here
                />
            )}
        </GestureHandlerRootView>
    );
}

export default PostReview;
