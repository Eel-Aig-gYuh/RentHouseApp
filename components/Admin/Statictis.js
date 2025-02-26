import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';

import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from "react-native-picker-select";

import APIs, { endpoints } from '../../config/APIs';
import { getToken } from '../../utils/storage';

import { Colors } from '../../constants/color/Colors';

export default function Statistics() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filter, setFilter] = useState({
        "month": "",
        "quarter": "",
        "year": "",
    });

    const loadStatistics = async () => {
        const token = await getToken();
        let url = endpoints['user-statictics'];

        if (filter) {
            url = `${url}?month=${filter.month}&quarter=${filter.quarter}&year=${filter.year}`
        }
        try {
            const response = await APIs.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.info(response.data);
            setStats(response.data);


        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatistics();
    }, [filter]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    const data = {
        labels: ['Người Thuê Trọ', 'Chủ Nhà Trọ', 'Tổng người dùng'],
        datasets: [
            {
                data: [stats.nguoi_thue_tro, stats.chu_nha_tro, stats.total_user],
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thống kê người dùng </Text>


            <View style={{ marginTop: 10, marginBottom: 10 }}>
                <View style={[{
                    flexDirection: 'row', backgroundColor: "white", borderRadius: 7, padding: 5,
                    width: '100%'
                }]}>
                    <View style={{ width: '30%', marginRight: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: "gray" }}>Theo tiêu chí: </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 10 }}>
                        <TouchableOpacity style={{ backgroundColor: "lightgray", borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => { setFilter({ month: "", quarter: "", year: "" }); setActiveFilter(null) }}
                        >
                            <Text style={{ color: "black" }}>Hủy</Text>
                        </TouchableOpacity>

                        <View style={{ backgroundColor: Colors.Blue, borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => { setActiveFilter(activeFilter === "month" ? null : "month") }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'space-between' }}>

                                <Picker
                                    selectedValue={filter.month}
                                    style={{ left: 14, width: 40, left: 45, position: 'absolute'}}
                                    onValueChange={(value) => setFilter({ month: value, quarter: "", year: "" })}
                                >
                                    <Picker.Item label="Chọn tháng" value="" />
                                    {[...Array(12)].map((_, i) => (
                                        <Picker.Item key={i + 1} label={`Tháng ${i + 1}`} value={i + 1} />
                                    ))}
                                </Picker>

                                <Text style={{ color: "white", fontWeight: 'bold', marginRight: 0, paddingRight: 20}}>Tháng {filter.month?filter.month: "  "}</Text>
                            </View>
                        </View>


                        <View style={{ backgroundColor: Colors.Green, borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => { setActiveFilter(activeFilter === "quarter" ? null : "quarter") }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'space-between' }}>

                                <Picker
                                    selectedValue={filter.quarter}
                                    style={{ left: 14, width: 25, left: 45, position: 'absolute'}}
                                    onValueChange={(value) => setFilter({ month: "", quarter: value, year: "" })}
                                >
                                    <Picker.Item label="Chọn quý" value="" />
                                    <Picker.Item label="Quý 1 (T1 - T3)" value="1" />
                                    <Picker.Item label="Quý 2 (T4 - T6)" value="2" />
                                    <Picker.Item label="Quý 3 (T7 - T9)" value="3" />
                                    <Picker.Item label="Quý 4 (T10 - T12)" value="4" />
                                </Picker>

                                <Text style={{ color: "white", fontWeight: 'bold', marginRight: 0, paddingRight: 20}}>Quý {filter.quarter? filter.quarter: "  "}</Text>
                            </View>
                        </View>

                        <View style={{ backgroundColor: Colors.Red, borderRadius: 5, padding: 3, marginRight: 5 }}
                            onPress={() => { setActiveFilter(activeFilter === "year" ? null : "year") }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'space-between' }}>

                                <Picker
                                    selectedValue={filter.year}
                                    style={{ left: 14, width: 25, left: filter.year? 75: 45, position: 'absolute'}}
                                    onValueChange={(value) => setFilter({ month: "", quarter: "", year: value })}
                                >
                                    <Picker.Item label="Chọn năm" value="" />
                                    {[...Array(5)].map((_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return <Picker.Item key={year} label={`${year}`} value={year} />;
                                    })}
                                </Picker>

                                <Text style={{ color: "white", fontWeight: 'bold', marginRight: 0, paddingRight: 20}}>Năm {filter.year? filter.year: "  "}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>


            </View>

            <BarChart
                data={data}
                width={Dimensions.get('window').width - 40} // Responsive width
                height={250}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: '#e3e3e3',
                    backgroundGradientFrom: '#f5f5f5',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 10,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#007aff',
                    },
                }}
                style={{
                    marginVertical: 10,
                    borderRadius: 10,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    error: {
        color: 'red',
    },
    picker: {
        width: "20",
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        marginTop: 0,
    },
});

