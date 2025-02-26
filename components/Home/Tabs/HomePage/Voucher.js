import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Dimensions, FlatList } from 'react-native';

import Styles from '../../../../constants/styles/Styles';

const { width: screenWidth } = Dimensions.get('window');

const Voucher = () => {
    const flatListRef = useRef();

    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    

    const getItemLayout = (data, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
    });


    const localImages = [
        {
            id: "1",
            images: require("../../../../assets/images/voucher2.png")
        },
        {
            id: "2",
            images: require('./../../../../assets/images/voucher3.png'),
        },    
    ];


    const renderItem = ({ item, index }) => (
        <View>
            <Image source={item.images} style={{width: 330, height: '100%', borderRadius: 10, margin: 3}} />
        </View>
    );


    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = prevIndex + 1 < localImages.length ? prevIndex + 1 : 0;

                // Scroll to next index
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });

                return nextIndex; // Update activeIndex
            });
        }, 7000);

        return () => clearInterval(interval); // Clear interval on unmount
    }, [localImages.length]);


    const renderDotIndicators = () => {
        return (
            localImages.map((dot, index) => {
                
                if (activeIndex === index){
                    return (
                        <View key={index}
                            style={{ 
                            backgroundColor: "black", 
                            opacity: 0.5,
                            height: 7, width: 20, 
                            borderRadius: 5,
                            marginHorizontal: 6,
                            marginTop: -17,
                        }}
                        >
                        </View>
                    );
                }
                else {
                    return <View 
                        key={index}
                        style={{ 
                            backgroundColor: "lightgray", 
                            opacity: 0.4,
                            height: 7, width: 20, 
                            borderRadius: 5,
                            marginHorizontal: 6,
                            marginTop: -17,
                        }}>
        
                    </View>
                }
            })
        );
    };

    return (
        <View>
            <FlatList
                data={localImages}
                ref={flatListRef}
                getItemLayout={getItemLayout}
                renderItem={renderItem}
                keyExtractor={(item)=>item.id}
                horizontal={true}
                pagingEnabled={true}
                onScroll={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setActiveIndex(index);
                }}
                scrollEventThrottle={16}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center',
                marginTop: 10,
            }}>
                {renderDotIndicators()} 
            </View>
            
        </View>
    );
};


export default Voucher;