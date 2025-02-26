import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';

// assets
import Styles from '../../constants/styles/Styles';
import { Colors } from '../../constants/color/Colors';

// components
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import PopUpMenuRole from './PopUpMenuRole';

// icon
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import APIs, { endpoints } from '../../config/APIs';

// fire base
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth'
import auth, { db, roomRef } from '../../firebase.config';
import {doc, setDoc} from 'firebase/firestore';


const Register = () => {
    const navigation = useNavigation();
    const navigater = useNavigation();

    const [isFirstNameFocus, setIsFirstNameFocus] = useState(false);
    const [isLastNameFocus, setIsLastNameFocus] = useState(false);
    const [isUsernameFocus, setIsUsernameFocus] = useState(false);
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    const [isPhoneFocus, setIsPhoneFocus] = useState(false);
    const [isConfirmPasswordFocus, setIsConfirmPasswordFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);

    const [isMenuRoleClick, setIsMenuRoleClick] = useState(false);
    const [selectedRole, setSelectedRole] = useState("Nguoi_Thue_Tro");


    const handleRoleSelect = (value) => {
        changed("role", value);
        console.log('Selected Role:', value); // Log the selected value
    };
    
    const toggleRoleMenu = () => {setIsMenuRoleClick(!isMenuRoleClick)}

    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "password": "",
        "confirm_password": "",
        "avatar": "",
        "role": "",
        "phone_number": "",
    });

    const changed = (field, value) => {
        setUser(current => {
            // [field] : lấy giá trị của first_name bỏ vô, nếu không có [] thì nó lấy chữ field.
            // [] : array destructering.
            return {...current, [field]: value}
        })
    }

    const sendImage = async () => {

    }

    const register = async () => {
        let form = new FormData();
        
        for (let key in user) {
            if (key === 'avatar') {
                const { uri, fileName, mimeType } = user[key];
    
                if (uri) {
                    // gói thành 1 cái prop file.
                    form.append('avatar', {
                        uri,  
                        name: fileName || 'avatar.jpg',  
                        type: mimeType || 'image/jpeg',  
                    });
                }
            } else {
                form.append(key, user[key]);
            }
        }
        
        // console.info(form);
    
        // console.info(user);
        if (user.password === user.confirm_password) {
            setIsPasswordError(false);

            try {
                setLoading(true);
                let res = await APIs.post(endpoints['register'],
                    form, {
                    headers: {
                        "Content-Type": 'multipart/form-data',
                        timeout: 5000,
                    }
                });
                // console.info(res.data);
                console.info(res.data.id);
                const datafirebase = await createUserWithEmailAndPassword(auth, 
                    user.email, 
                    user.password, 
                );
                await setDoc(doc(db, "users", datafirebase?.user?.uid), {
                    userId: datafirebase?.user?.uid,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                    role: user?.role? "Nguoi_Thue_Tro" : user?.role,
                });

                
                navigater.navigate("Login");
            } catch (ex) {
                // console.error("Lỗi: ", ex);
                
                if (ex.message.includes('(auth/invalid-email)')) ex.message = 'Email không khả dụng.';
                if(ex.response.data);
                    Alert.alert('Lỗi điền thông tin tài khoản', 'Vui lòng điền đầy đủ thông tin.');
            } finally {
                setLoading(false); // Stop loading
            }
        } else {
            setIsPasswordError(true);
        }
        
    }

    const picker = async () => {
        // xin quyền truy cập ảnh.
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted')
            alert("Permission Denied !");
        else {
            let res = await ImagePicker.launchImageLibraryAsync();
            
            if(!res.canceled){
                changed('avatar', res.assets[0]);
            }
        }
    }

    useEffect(()=>{
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    return (
        <View style={{padding: 20, marginTop: 30, flex: 1, backgroundColor: "whitesmoke"}}>
            <View style={{maxHeight: '10%',
                flex: 1, flexDirection: "row", alignSelf: 'center'
            }}>
                <TouchableOpacity
                onPress={()=> navigater.goBack()}>
                    <AntDesign name="back" size={24} color="black" />   
                </TouchableOpacity>

                <Text style={[Styles.txt_title, {textAlign: 'left', marginLeft: 20, marginTop: -15,
                    fontSize: 25,
                    alignSelf: 'center'
                }]}>
                    Create A New Account
                </Text>             
            </View>

            <View style={{flex: 1, marginTop: 10, height: '100%'}}>

                <ScrollView style={{}}>

                    {/* Avatar */}
                    <TouchableOpacity style={[{height: '120', width: '120',
                        backgroundColor: "white", 
                        padding: 10, marginBottom: 10, 
                        borderRadius: 20,
                        alignSelf: 'center',
                    }, Styles.shadow]}
                        onPress={picker}
                    >
                        
                        {user.avatar?
                            <Image style={{width: '100', height: '100', alignContent: 'center', borderRadius: 10}}
                                source={{uri: user.avatar.uri}}
                            />
                        
                        : 
                            <Image style={{width: '100', height: '100', alignContent: 'center', borderRadius: 10}}
                                source={require('./../../assets/images/avatar1.png')}
                            />
                        }

                        
                        <TouchableOpacity onPress={picker}>
                            <FontAwesome6 name="pen-to-square" size={15} color="black" style={[Styles.editIcon, {top: -20}]} />
                        </TouchableOpacity>

                    </TouchableOpacity>



                    {/* Information */}
                    <View style={[{minHeight: '20%', backgroundColor: "white", 
                        padding: 10, marginBottom: 10, 
                        borderRadius: 20
                    }, Styles.shadow]}>
                        <Text>
                            Last Name
                        </Text>
                        <TextInput value={user.first_name} onChangeText={t => changed("first_name", t)}
                            onFocus={() => setIsFirstNameFocus(true)}
                            onBlur={() => setIsFirstNameFocus(false)}

                            inputMode='text' placeholder='Nhập họ và chữ lót ...'
                            style={[Styles.input, {marginBottom: 5, borderColor: (!isFirstNameFocus)? "lightgrey": Colors.Red}]}></TextInput>

                        <Text>
                            First Name
                        </Text>
                        <TextInput value={user.last_name} onChangeText={t => changed("last_name", t)}
                            onFocus={() => setIsLastNameFocus(true)}
                            onBlur={() => setIsLastNameFocus(false)}
                            inputMode='text' placeholder='Nhập tên người dùng ...'
                            style={[Styles.input, {marginBottom: 5, borderColor: (!isLastNameFocus)? "lightgrey": Colors.Red}]}></TextInput>

                        <Text>
                            Select Your Role
                        </Text>
                        <TouchableOpacity style={[Styles.input, {marginBottom: 5, height: 40, borderColor: "lightgrey"}]}
                            onPress={toggleRoleMenu}
                        >
                            <Text>{selectedRole? "Người thuê trọ" : 'Chủ nhà trọ'}</Text>
                        </TouchableOpacity>
                        <PopUpMenuRole
                            isVisible={isMenuRoleClick}
                            onClose={toggleRoleMenu}
                            onOptionSelect={handleRoleSelect}
                        />

                        <Text>
                            Phone Number
                        </Text>
                        <TextInput value={user.phone_number} onChangeText={t => changed("phone_number", t)}
                            onFocus={() => setIsPhoneFocus(true)}
                            onBlur={() => setIsPhoneFocus(false)}
                            inputMode='text' placeholder='Nhập tên số điện thoại ...'
                            style={[Styles.input, { marginBottom: 5, borderColor: (!isPhoneFocus) ? "lightgrey" : Colors.Red }]}></TextInput>

                    </View>


                    {/* Username & Password */}
                    <View style={[{minHeight: '20%', backgroundColor: "white", 
                        padding: 10, marginBottom: 10, 
                        borderRadius: 20
                    }, Styles.shadow]}>
                        <Text>
                            Email
                        </Text>
                        <TextInput value={user.email} onChangeText={t => changed("email", t)}
                            onFocus={() => setIsUsernameFocus(true)}
                            onBlur={() => setIsUsernameFocus(false)}
                            inputMode='email' placeholder='Nhập tài khoản email ...'
                            style={[Styles.input, {marginBottom: 5, borderColor: (!isUsernameFocus)? "lightgrey": Colors.Red}]}></TextInput>

                        <Text>
                            Password
                        </Text>
                        <TextInput value={user.password} onChangeText={t => changed("password", t)}
                            onFocus={() => setIsPasswordFocus(true)}
                            onBlur={() => setIsPasswordFocus(false)}
                            secureTextEntry={true} placeholder='Nhập mật khẩu ...'
                            style={[Styles.input, {marginBottom: 5, borderColor: (!isPasswordFocus && !isPasswordError)? "lightgrey": Colors.Red}]}></TextInput>

                        <Text>
                            Confirm Password
                        </Text>
                        <TextInput value={user.confirm_password} onChangeText={t => changed("confirm_password", t)}
                            onFocus={() => setIsConfirmPasswordFocus(true)}
                            onBlur={() => setIsConfirmPasswordFocus(false)}
                            secureTextEntry={true} placeholder='Xác nhận mật khẩu ...'
                            style={[Styles.input, {marginBottom: 0, borderColor: (!isPasswordError && !isConfirmPasswordFocus) ? "lightgrey": Colors.Red}]}></TextInput>

                        {isPasswordError? (
                            <View>
                                <Text style={{fontSize: 11, fontWeight: 'bold', color: Colors.Red,
                                    marginTop: 5, marginLeft: 5
                                }}>Mật khẩu không trùng khớp !</Text>
                            </View>
                        ) : (
                            null
                        )}
                    </View>


                    {/* Button */}
                    <View style={[{minHeight: '20%', backgroundColor: "white", 
                        padding: 10, marginBottom: 10, 
                        borderRadius: 20
                    }, Styles.shadow]}>
                        <TouchableOpacity
                            style={[Styles.button, { marginBottom: 10, marginTop: 10 }]}
                            onPress={register}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.White} />
                            ) : (
                                <Text style={{ textAlign: 'center', color: Colors.White, fontWeight: 'bold' }}>
                                    Create An Account
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ backgroundColor: Colors.White, borderWidth: 1, borderRadius: 15, padding: 10, marginLeft: 20, marginRight: 20 }}
                            onPress={() => navigater.navigate('Login')}
                            disabled={loading}
                        >
                            <Text style={{ textAlign: 'center', color: Colors.Primary, fontWeight: 'bold' }}>
                                Sign In
                            </Text>

                        </TouchableOpacity>
                    </View>

                    <View style={[{minHeight: '25%', backgroundColor: "white", 
                        padding: 10, marginBottom: 10, 
                        borderRadius: 20
                    }, Styles.shadow]}>
                        
                    </View>


                </ScrollView>

            </View>
        </View>
    );
    
}

export default Register;