import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { Colors } from '../../constants/color/Colors';
import Styles from '../../constants/styles/Styles';
import { useNavigation } from '@react-navigation/native';

// icon
import AntDesign from '@expo/vector-icons/AntDesign';
import MyContact from '../../config/MyContact';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import auth from '../../firebase.config';
import { removeToken } from '../../utils/storage';

export default function AdminPage() {
    const navigater = useNavigation();
    const [user, dispatch] = useContext(MyContact);

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

    useEffect(() => {
        navigater.setOptions({ 
            title: '',
            headerLeft: () => (
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>

                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={logout}
                        >
                            <AntDesign name="logout" size={24} color="tomato" backgroundColor="#fee2e2"
                                style={{ textAlign: 'right', marginLeft: 15, borderRadius: 99 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        });
    }, [navigater]);
    
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
            <View style={{ height: '10%', backgroundColor: Colors.Yellown, marginBottom: 20, 
                borderRadius: 20, 
             }}>
                <Text style={{fontSize: 20, fontWeight: 'bold',
                    alignSelf: 'center', textAlign: 'center', marginTop: 10,
                    }}>QUẢN TRỊ RENT HOUSE</Text>
            </View>

            <View style={{ borderRadius: 20, backgroundColor: Colors.Yellown, height: '75%'}}>
                <View style={{ flexDirection: 'row', height: 150, marginBottom: 10,}}>


                    <View style={[styles.containerAdmin]}>
                        <TouchableOpacity style={[styles.imgContainer,  Styles.shadow, { backgroundColor: Colors.Dark, alignSelf: 'center' }]}
                            onPress={() => navigater.navigate('Statistics')}
                        >
                            <Text style={{ fontWeight: 'bold', color: "white", textAlign: 'center', marginTop: '40%'}}>Thống Kê</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerAdmin}>
                        <TouchableOpacity style={[styles.imgContainer,  Styles.shadow, { backgroundColor: Colors.Dark, alignSelf: 'center' }]}
                            onPress={() => navigater.navigate('PostReview')}
                        >
                            <Text style={{ fontWeight: 'bold', color: "white", textAlign: 'center', marginTop: '30%'}}>Xét Duyệt</Text>
                            <Text style={{ fontWeight: 'bold', color: "white", textAlign: 'center', marginTop: 10}}>Bài Đăng</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', height: 150, marginBottom: 10 }}>
                    
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerAdmin: {
        width: '50%',
        marginTop: 15,
        padding: 20,
        height: 300,
    },
    imgContainer: {
        height: 130,
        width: 130,
        borderRadius: 15,
    },
    imgAdmin: {
        width: '100%',
        height: 100,
        opacity: 0.5,
        marginTop: -45,
        borderRadius: 10
    }
});
