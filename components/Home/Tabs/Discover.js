import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, FlatList, RefreshControl, } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../../constants/color/Colors';
import Styles from '../../../constants/styles/Styles'

// Icon
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


import PopUpMenuFilter from './Discover/PopUpMenuFilter';
import PopUpMenuLocation from './Discover/PopUpMenuLocation';
import PopUpMenuPrices from './Discover/PopUpMenuPrices';
import PopUpMenuNearMe from './Discover/PopUpMenuNearMe';
import APIs, { endpoints } from '../../../config/APIs';
import { getToken } from '../../../utils/storage';
import MyContact from '../../../config/MyContact';

// Currency formatting
import currency from 'currency.js';

export default function Discover() {
    const [user, dispatch] = useContext(MyContact);
    const navigater = useNavigation();

    const [isFilterClick, setIsFilterClick] = useState(false);
    const [isLocationClick, setIsLocationClick] = useState(false);
    const [isPricesClick, setIsPricesClick] = useState(false);
    const [isNearMeClick, setIsNearMeClick] = useState(false);

    const [savedPosts, setSavedPosts] = useState([]);
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

    const [rentalPost, setRentalPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState('');

    const toggleFilterMenu = () => setIsFilterClick(!isFilterClick);
    const toggleLocationMenu = () => setIsLocationClick(!isLocationClick);
    const togglePricesMenu = () => setIsPricesClick(!isPricesClick);
    const toggleNearMeMenu = () => setIsNearMeClick(!isNearMeClick);

    const handleFilterSubmit = (query) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...Object.fromEntries(Object.entries(query).map(([key, value]) => [key, value ?? ""]))
        }));
    };
    
    const cancelFilter = () => {
        setFilter(defaultFilter);
    }

    const goToRentalPostDetail = (rentalPostId) => {
        console.info(rentalPostId);
        navigater.navigate('RentPostDetail', { rentalPostId, savedPosts });

    };

    const toggleSavePost = async (postId) => {
        const token = await getToken();

        try {
            let updatedSavedPosts;

            if (savedPosts?.includes(postId)) {
                await APIs.delete(endpoints['rental-post-delete_savePosts'](postId), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedSavedPosts = savedPosts.filter(id => id !== postId); // Remove postId from savedPosts
                loadRental();
            } else {
                await APIs.post(endpoints['rental-post-save_savePosts'], { post_id: postId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedSavedPosts = [...savedPosts, postId]; // Add postId to savedPosts
                loadRental();
            }

            const updatedUser = { ...user?.user, saved_posts: updatedSavedPosts };

            dispatch({
                type: "SET_USER",  // Ensure this action updates the whole user object
                payload: updatedUser,
            });


            dispatch({
                type: "UPDATE_SAVED_POSTS",
                payload: updatedSavedPosts
            });

            setSavedPosts(updatedSavedPosts);

        } catch (ex) {
            console.error("Error saving post", ex);
        }
    };

    useEffect(() => {
        setSavedPosts(user?.user?.saved_posts);
    }, [user])


    // console.info(user.user);

    const loadRental = async () => {
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
                setRentalPost(res?.data?.results);
                setNextPage(res?.data?.next);
                // console.info(res.data.next);
            } else {
                console.log("Không có rental post nào thỏa điều kiện !");
            }

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadRental();
    }, [filter]);

    const loadMore = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            console.info(nextPage.split('?')[1]);
            let url = `${endpoints['rental-post']}?${nextPage.split("?")[1]}`

            if (filter) {
                url = `${url}&status=${filter.status}&city=${filter.city}&district=${filter.district}&ward=${filter.ward}&min_price=${filter.min_price}&max_price=${filter.max_price}&min_area=${filter.min_area}&max_area=${filter.max_area}&occupants=${filter.occupants}&address=${filter.address}`
            }

            const res = await APIs.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    timeout: 5000,
                }
            });



            if (res?.data?.results) {
                setRentalPost((prev) => [...prev, ...res?.data?.results]);
                setNextPage(res?.data?.next);
            }
            else { setNextPage(null) }
        } catch (ex) {
            console.info(ex.status);
        }
        finally {
            setLoading(false);
        }
    }


    const renderItem = ({ item: rPost }) => {
        const userInPost = rPost?.user || {}; // Ensure user exists to avoid errors

        return (
            <TouchableOpacity
                key={rPost.id}
                style={{
                    backgroundColor: "white", minHeight: 100, maxHeight: 150, borderRadius: 15,
                    marginBottom: 5, marginTop: 5,
                    shadowRadius: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, elevation: 7,
                }}
                onPress={() => goToRentalPostDetail(rPost.id)}
            >
                <View style={{ flexDirection: "row" }}>


                    {/* Rental post image */}
                    <TouchableOpacity
                        style={{
                            height: 100, width: 100, backgroundColor: "white", margin: 5,
                            borderRadius: 10, borderColor: Colors.LightGray, borderWidth: 3,
                        }}
                    >
                        <Image
                            style={{
                                width: 95, height: 95, borderRadius: 10, alignSelf: "center",
                            }}
                            source={
                                rPost.images.length > 0
                                    ? { uri: rPost.images[0] }
                                    : null
                            }
                        />
                    </TouchableOpacity>

                    {/* {console.info(rPost.status)} */}
                    {user?.user?.role === "Chu_Nha_Tro" ? (
                        <View style={{
                            height: 30, width: 70, backgroundColor: rPost.status === "Pending" ? Colors.Blue : rPost.status === "Allow" ? Colors.Green : Colors.Red, position: 'absolute',
                            alignItems: 'center', justifyContent: 'center',
                            borderRadius: 5
                        }}>
                            <Text style={{ color: "white", fontWeight: 'bold', fontStyle: 'italic' }}>{rPost.status}</Text>
                        </View>
                    ) : (null)}

                    {/* Rental post details */}
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        {/* Title */}
                        <Text style={{ fontWeight: "bold" }}>{rPost.title}</Text>
                        {/* Description */}
                        <Text style={{ fontSize: 10 }}>{rPost.content}</Text>
                        {/* Price */}
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{ fontWeight: "bold", color: Colors.SearchButton, flex: 1 }}
                            >
                                Giá: {currency(rPost.price, { separator: ',', symbol: "", decimals: 0 }).format().replace('.00', '')}₫ / tháng
                            </Text>

                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: 10, alignSelf: 'center', color: Colors.Blue }}>
                                {rPost?.area} / m²
                            </Text>
                        </View>
                        {/* City */}
                        <Text style={{ fontSize: 10 }}>Ngụ tại: {rPost.district + ', ' + rPost.ward + ', ' + rPost.city}</Text>


                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {/* User avatar */}
                            <TouchableOpacity
                                style={{
                                    height: 30, width: 30, backgroundColor: "white", margin: 5,
                                    borderRadius: 10, borderColor: Colors.LightGray, borderWidth: 3,
                                }}
                            >
                                <Image
                                    style={{
                                        width: 30, height: 30, borderRadius: 10, alignSelf: "center",
                                    }}
                                    source={
                                        userInPost?.avatar_url
                                            ? { uri: userInPost?.avatar_url }
                                            : require("./../../../assets/images/avatar1.png")
                                    }
                                />
                            </TouchableOpacity>

                            {/* User details */}
                            <View style={{ marginLeft: 5 }}>
                                <Text>{`${userInPost?.first_name || ""} ${userInPost?.last_name || ""
                                    }`}</Text>
                                <Text style={{ fontSize: 10 }}>Số tin đăng</Text>
                            </View>

                            {/* Save post icon */}
                            {user?.user?.role === "Nguoi_Thue_Tro" ? (
                                <TouchableOpacity
                                    onPress={() => toggleSavePost(rPost.id)}  // Toggle save for this specific post
                                    style={{ marginLeft: "auto", marginRight: 10 }}
                                >
                                    {savedPosts?.includes(rPost.id) ? (
                                        <AntDesign style={{ marginTop: 10 }} name="heart" size={24} color="tomato" />
                                    ) : (
                                        <AntDesign style={{ marginTop: 10 }} name="hearto" size={24} color="tomato" />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                null
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{
            maxHeight: '100%', maxWidth: '100%', height: '100%',
            paddingTop: 10, marginTop: 10, paddingLeft: 15, paddingRight: 10
        }}>
            <View style={[{
                backgroundColor: "white", height: "10%", borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
            }, Styles.shadow]}>
                {/* Header */}
                <View>
                    <View style={{
                        display: 'flex', flexDirection: 'row', alignContent: 'center', width: '100%',
                    }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{
                                textAlign: 'left', marginRight: 10, marginTop: 10, marginLeft: 10,
                                fontSize: 20, fontWeight: 'bold'
                            }}>Thuê phòng</Text>
                        </View>


                        <View style={{ width: '35%' }}>
                            <TouchableOpacity
                                onPress={() => navigater.navigate("Notification")}
                            >
                                <AntDesign name="hearto" size={24} color={"black"}
                                    style={{ textAlign: 'right', marginLeft: '48%', marginTop: 15 }} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[{
                            height: 30, width: 30, backgroundColor: "white", borderRadius: 10,
                            borderColor: Colors.LightGray, borderWidth: 3, marginTop: 10, marginLeft: 15
                        }]}
                            onPress={() => navigater.navigate('Profile')}>
                            <Image style={{ width: 30, height: 30, borderRadius: 10, alignSelf: 'center' }}
                                source={user?.user?.avatar_url ? (
                                    { uri: user?.user?.avatar_url }
                                ) : (
                                    require('./../../../assets/images/avatar1.png')
                                )} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ height: "100%" }}>
                <View style={{
                    padding: 0, backgroundColor: 'lightgray', flexDirection: 'row',
                    borderRadius: 15, marginTop: 10, height: '8%'
                }}>
                    <TextInput
                        onChangeText={t => handleFilterSubmit({ "address": t })}
                        placeholder='Bạn muốn tìm gì?' style={{ marginLeft: 20, width: '77%' }} />

                    <TouchableOpacity style={{ paddingLeft: 5, paddingRight: 13, borderRadius: 15, margin: 3 }}>
                        <Feather name="search" size={24} color={Colors.SearchButton} style={{ marginTop: 5, marginLeft: 5 }} />
                    </TouchableOpacity>
                </View>

                {/* Lọc */}
                <View style={{ height: '12%', justifyContent: 'space-between', marginTop: 5 }}>
                    <View style={[{
                        flexDirection: 'row', backgroundColor: "white", borderRadius: 7, marginTop: 5, padding: 10,
                        width: '100%'
                    }]}>
                        <View style={{ width: '20%' }}>
                            <TouchableOpacity style={{
                                padding: 3, paddingLeft: 2, paddingRight: 5, alignItems: 'center',
                                flexDirection: 'row', backgroundColor: "lightgray", borderRadius: 5, marginRight: 8
                            }}
                                onPress={toggleFilterMenu}
                            >
                                <Feather name="filter" size={20} color="gray" style={{ marginRight: 5 }} />
                                <Text style={{ color: "black" }}>Lọc</Text>
                            </TouchableOpacity>
                            <PopUpMenuFilter
                                isVisible={isFilterClick}
                                onClose={toggleFilterMenu}
                                onQuerySubmit={handleFilterSubmit}
                                filterItem={filter}
                            />
                        </View>


                        <View style={{ width: '29%' }}>
                            <TouchableOpacity style={{
                                padding: 3, paddingLeft: 5, paddingRight: 5, alignItems: 'center', width: '100%',
                                flexDirection: 'row', backgroundColor: "lightgray", borderRadius: 5, marginRight: 8,
                            }}
                                onPress={toggleLocationMenu}
                            >

                                <Text style={{ color: "black", marginRight: 5 }}>Toàn quốc</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>

                            <PopUpMenuLocation
                                isVisible={isLocationClick}
                                onClose={toggleLocationMenu}
                                onQuerySubmit={handleFilterSubmit}
                                filterItem={filter}
                            />
                        </View>


                        <View style={{ width: '18%', marginLeft: 8, marginLeft: 8 }}>
                            <TouchableOpacity style={{
                                padding: 3, paddingLeft: 5, paddingRight: 5, alignItems: 'center',
                                flexDirection: 'row', backgroundColor: "lightgray", borderRadius: 5, marginRight: 8,
                            }}
                                onPress={togglePricesMenu}
                            >

                                <Text style={{ color: "black", marginRight: 5 }}>
                                    Giá
                                </Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>

                            <PopUpMenuPrices
                                isVisible={isPricesClick}
                                onClose={togglePricesMenu}
                                onQuerySubmit={handleFilterSubmit}
                                filterItem={filter}
                            />
                        </View>





                        <View style={{ width: '34%', marginLeft: -8 }}>
                            {user?.user?.role === "Chu_Nha_Tro" ? (
                                <TouchableOpacity style={{
                                    alignItems: 'center', alignSelf: 'flex-end',
                                    flexDirection: 'row', backgroundColor: "tomato", borderRadius: 5, padding: 3, paddingLeft: 5, paddingRight: 5, marginRight: 8
                                }}
                                    onPress={() => user?.user?.role === "Chu_Nha_Tro" ? navigater.navigate('CreateNew') : console.info("Don't have permission !")}
                                >

                                    <Text style={{ color: "white", marginRight: 5, fontWeight: 'bold' }}>Đăng tin</Text>
                                    <FontAwesome5 name="plus-square" size={20} color="white" />

                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: "tomato", borderRadius: 5, padding: 3, marginRight: 5, marginLeft: 10 }}
                                    onPress={toggleNearMeMenu}
                                >
                                    <FontAwesome name="map-signs" size={20} color="white" style={{ marginRight: 5 }} />
                                    <Text style={{ color: "white", fontWeight: 'bold', marginLeft: 5 }}>Gần tôi</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>



                {/* tìm kiếm khu vực */}
                <View style={{ height: '12%', justifyContent: 'space-between', }}>
                    <View style={[{
                        flexDirection: 'row', backgroundColor: "white", borderRadius: 7, padding: 5,
                        width: '100%'
                    }]}>
                        <View style={{ width: '20%', marginRight: 5 }}>
                            <Text style={{ fontWeight: 'bold', color: "gray" }}>Khu vực: </Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 10 }}>
                            <TouchableOpacity style={{ backgroundColor: "lightgray", borderRadius: 5, padding: 3, marginRight: 5 }}
                                onPress={() => cancelFilter()}
                            >
                                <Text style={{ color: "black" }}>Tất cả</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: "lightgray", borderRadius: 5, padding: 3, marginRight: 5 }}
                                onPress={() => handleFilterSubmit({ "city": "Hồ Chí Minh" })}
                            >
                                <Text style={{ color: "black" }}>Tp. Hồ Chí Minh</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: "lightgray", borderRadius: 5, padding: 3, marginRight: 5 }}
                                onPress={() => handleFilterSubmit({ "city": "Hà Nội" })}
                            >
                                <Text style={{ color: "black" }}>Hà Nội</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ backgroundColor: "lightgray", borderRadius: 5, padding: 3, marginRight: 5 }}
                                onPress={() => handleFilterSubmit({ "city": "Đà Nẵng" })}
                            >
                                <Text style={{ color: "black" }}>Đà Nẵng</Text>
                            </TouchableOpacity>
                        </ScrollView>

                        {user?.user?.role === "Chu_Nha_Tro" ? (
                            <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: Colors.Green, borderRadius: 5, padding: 3, marginRight: 5 }}
                                onPress={toggleNearMeMenu}
                            >
                                <FontAwesome name="map-signs" size={20} color="white" style={{ marginRight: 5 }} />
                                <Text style={{ color: "white", fontWeight: 'bold' }}>Gần tôi</Text>
                            </TouchableOpacity>
                        ) : (
                            null
                        )}

                        <PopUpMenuNearMe
                            isVisible={isNearMeClick}
                            onClose={toggleNearMeMenu}
                        />
                    </View>


                </View>

                {user?.user?.role === "Chu_Nha_Tro" ? (
                    <View style={{ marginTop: -20, marginBottom: 20 }}>
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
                ) : (null)}


                {/* Rent Post */}
                <View style={{ backgroundColor: Colors.SearchButton, height: '55%', borderRadius: 15, marginTop: -15 }}>
                    {rentalPost === null ? <ActivityIndicator />
                        :
                        // else
                        <FlatList
                            data={rentalPost}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', color: Colors.White, marginTop: 20, fontWeight: 'bold' }}>
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
                                if (!nextPage) {
                                    return (
                                        <Text style={{ textAlign: 'center', color: 'white', marginVertical: 10, fontSize: 16 }}>
                                            --- Hết danh sách ---
                                        </Text>
                                    )
                                }
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={loadRental}
                                    colors={["#ff6347", "#32cd32", "#1e90ff"]}
                                    tintColor="#ff6347"
                                    title="Đang tải..."
                                    titleColor="#ff6347"
                                />
                            }
                            contentContainerStyle={{ paddingBottom: 20 }} // Add bottom padding here
                        />


                    }
                </View>
            </View>

        </View>
    );
}