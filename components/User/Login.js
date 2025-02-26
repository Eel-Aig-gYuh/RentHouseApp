import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Styles from '../../constants/styles/Styles';
import { Colors } from '../../constants/color/Colors';
import { useNavigation } from '@react-navigation/native';
import APIs, { authApi, endpoints } from '../../config/APIs';

import * as Google from 'expo-auth-session/providers/google';

import * as Facebook from 'expo-facebook';
import MyContact from '../../config/MyContact';
import { getRefreshToken, getToken, storage, storeToken } from './../../utils/storage';
import * as AuthSession from 'expo-auth-session';

// firebase
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// icon
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import app from '../../firebase.config';
import auth from '../../firebase.config';

const Login = () => {

    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, dispatch] = useContext(MyContact);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isShowed, setIsShowed] = useState(false);

    // Traditional login
    const login = async () => {
        setLoading(true);
        try {
            // Gửi yêu cầu đăng nhập tới Django backend
            const res = await APIs.post(endpoints['login'], {
                grant_type: "password",
                username,
                password,
                client_id: "z4cfxQY8g8SYTJ6bGwUU3QaMsu4svbzIOPrYbqQu",
                client_secret: "aRdXxnBuXdpLuJmsodqE3ddJR0EUaIsi28OVKYUiA9kWNVFULrUII1qCmVGujeDLBm3egr4UI7biEoLVkb5329nO46loHuIx1s3jNCv0G17cXRVlnviQh2w3XRNYjEjC"
            });

            // Lấy thông tin người dùng từ backend Django
            const userRes = await authApi(res.data.access_token).get(endpoints['current-user']);

            // Đăng nhập Firebase (nếu Firebase user đã đăng xuất)
            let firebaseUser = auth.currentUser;
            let firebaseToken = null;

            if (!firebaseUser) {
                // console.warn("Firebase user đã đăng xuất, đăng nhập lại...");
                const datafirebase = await signInWithEmailAndPassword(auth, username, password);
                firebaseUser = datafirebase.user;
            }

            console.info('token: ', await getToken());

            // Lấy Firebase token
            firebaseToken = await firebaseUser.getIdToken();

            // Lưu tất cả token vào AsyncStorage
            await storeToken(res.data.access_token, res.data.refresh_token, firebaseToken);

            // Cập nhật Redux state
            dispatch({ type: "login", payload: { ...userRes.data, uid: firebaseUser.uid } });

            // Chuyển hướng người dùng theo vai trò
            navigation.navigate(userRes.data.role === 'Admin' ? 'AdminPage' : 'Home');

        } catch (error) {
            // console.error("Login error:", error);
            setIsError(true);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };


    // Google Login
    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    //     // // androidClientId: "693389980643-6efuakf4hurvf0s5tkvig57jqgvq5cs4.apps.googleusercontent.com",
    //     clientId: "693389980643-si4j3froooc7lob05nhmav98d9juncfp.apps.googleusercontent.com",

    //     scopes: ["profile", "email"],

    //     redirectUri: AuthSession.makeRedirectUri({
    //         useProxy: true
    //     })
    //     // redirectUri: 'https://localhost:8081',


    //     // client_id:	"693389980643-si4j3froooc7lob05nhmav98d9juncfp.apps.googleusercontent.com",
    //     // project_id:	"renthouse-443709",
    //     // auth_uri:	"https://accounts.google.com/o/oauth2/auth",
    //     // token_uri:	"https://oauth2.googleapis.com/token",
    //     // auth_provider_x509_cert_url:	"https://www.googleapis.com/oauth2/v1/certs",

    // });

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "734617815625-2rojkps65qren0u6uv9eqvncra38kg90.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        redirectUri: AuthSession.makeRedirectUri({
            useProxy: true
        })
        // redirectUri: 'https://renthouseapiv2-production.up.railway.app/account/login/google-oauth2',
    });
    useEffect(() => {

        const handleGoogleLogin = async () => {
            console.info(request.redirectUri);
            if (response?.type === "success") {
                try {
                    const { id_token } = response.params;

                    // Fetch user info from Google API using Axios
                    const userInfoResponse = await APIs.get(
                        'https://www.googleapis.com/oauth2/v3/userinfo',
                        { headers: { Authorization: `Bearer ${id_token}` } }
                    );
                    console.log("Google User Info:", userInfoResponse.data);

                    // Send token to backend for authentication
                    const loginResponse = await APIs.post(
                        endpoints["loginWithGoogle"],
                        { access_token: id_token },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (loginResponse.data?.access_token) {
                        console.log("Google login successful:", loginResponse.data);

                        // Store token securely
                        await storeToken(loginResponse.data.access_token, loginResponse.data.refresh_token);

                        // Navigate only after storing token
                        navigation.navigate("Home");
                    } else {
                        console.error("Google login failed: No access token");
                    }
                } catch (error) {
                    console.error("Google login error:", error);
                }
            }
        };

        handleGoogleLogin();
    }, [response]);
    const signInWithGoogle = async () => {
        await promptAsync();
    };

    // Facebook Login
    // const Facebook_Login = async () => {
    //     try {
    //         await Facebook.initializeAsync({ appId: '1124451982713963' });

    //         const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile', 'email'] });

    //         if (type === 'success') {
    //             const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    //             const user = await response.json();
    //             console.log('Facebook User Info:', user);
    //             await storeToken(token, "");
    //             navigation.navigate('Home');
    //         } else {
    //             console.log('Facebook login was canceled');
    //         }
    //     } catch (error) {
    //         console.error("Facebook login error:", error);
    //     }
    // };


    // lưu state 
    const Facebook_Login = async () => {
        try {
            // Login with Facebook
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                console.log('Login cancelled');
            } else {
                console.log('Login success with permissions: ' + result.grantedPermissions.toString());

                // Get the Facebook access token
                const data = await AccessToken.getCurrentAccessToken();
                if (!data) {
                    console.log("Error getting access token");
                    return;
                }

                // Create a Firebase credential with the Facebook access token
                const credential = FacebookAuthProvider.credential(data.accessToken);

                // Sign in to Firebase with the Facebook credential
                const auth = getAuth(app);
                await signInWithCredential(auth, credential);

                console.log('User signed in with Facebook');
            }
        } catch (error) {
            console.error('Login fail with error: ' + error);
            Alert.alert('Error', error.message);
        }
    }

    // setLoading(false);
    useEffect(() => {
        navigation.setOptions({ headerShown: false });

        const checkLoginStatus = async () => {
            try {
                // Kiểm tra Firebase có user đã đăng nhập không
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        setLoading(true);
                        // console.log("Firebase user đã đăng nhập:", user.uid);

                        const token = await getToken();
                        if (!token) {
                            setLoading(false);
                            throw new Error("Không tìm thấy access token");
                        }

                        let userRes = await authApi(token).get(endpoints['current-user']);

                        // Lấy lại Firebase Token nếu cần
                        const firebaseToken = await user.getIdToken();
                        await storeToken(token, await getRefreshToken(), firebaseToken);

                        dispatch({ type: "login", payload: { ...userRes.data, uid: user.uid } });
                        navigation.navigate(userRes.data.role === 'Admin' ? 'AdminPage' : 'Home');
                    } else {
                        console.log("Firebase user chưa đăng nhập, cần đăng nhập lại!");
                        await handleRefreshToken();
                    }
                });
            } catch (error) {
                // console.error("Lỗi đăng nhập:", error);
                await handleRefreshToken();
                setLoading(false);
            }
        };

        const handleRefreshToken = async () => {
            // setLoading(true);
            try {
                setLoading(true);
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                    setLoading(false);
                    throw new Error("Không tìm thấy refresh token");
                }

                // Làm mới access_token của Django Backend
                const res = await APIs.post(endpoints['login'], {
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    client_id: "z4cfxQY8g8SYTJ6bGwUU3QaMsu4svbzIOPrYbqQu",
                    client_secret: "aRdXxnBuXdpLuJmsodqE3ddJR0EUaIsi28OVKYUiA9kWNVFULrUII1qCmVGujeDLBm3egr4UI7biEoLVkb5329nO46loHuIx1s3jNCv0G17cXRVlnviQh2w3XRNYjEjC"
                });

                if (!res?.data?.access_token) throw new Error("Làm mới token thất bại!");

                let userRes = await authApi(res.data.access_token).get(endpoints['current-user']);

                // Kiểm tra Firebase user
                onAuthStateChanged(auth, async (firebaseUser) => {
                    if (firebaseUser) {
                        setLoading(true);

                        // Lấy lại Firebase token
                        const firebaseToken = await firebaseUser.getIdToken();
                        await storeToken(res.data.access_token, res.data.refresh_token, firebaseToken);

                        dispatch({ type: "login", payload: { ...userRes.data, uid: firebaseUser.uid } });
                        setLoading(false);
                        navigation.navigate(userRes.data.role === 'Admin' ? 'AdminPage' : 'Home');
                    } else {
                        console.warn("Firebase user đã đăng xuất, cần đăng nhập lại!");
                        await removeTokens();
                    }
                });
            } catch (error) {
                // console.error("Error refreshing token:", error);
                setLoading(false);
                await removeTokens();
            }
        };

        checkLoginStatus();
    }, [navigation]);

    return (
        <View style={{ padding: 20, marginTop: 20, flex: 1, backgroundColor: Colors.White, opacity: loading ? 0.5 : 1 }}>
            <View style={{ flex: 1, maxHeight: '30%' }}>
                <Text style={[Styles.txt_title, { textAlign: 'left' }]}>
                    Đăng nhập để bắt đầu
                </Text>

                <Text style={[Styles.txt_content, { textAlign: 'left', marginTop: 20 }]}>
                    Chào mừng trở lại !
                </Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text>
                    Email
                </Text>
                <TextInput value={username} onChangeText={t => setUsername(t)}
                    inputMode='email' placeholder='Enter Email'
                    style={[Styles.input, { borderColor: isError ? Colors.Red : "lightgrey", borderWidth: isError ? 1.3 : 1 }]}>
                </TextInput>

                <Text>
                    Password
                </Text>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput value={password} onChangeText={t => setPassword(t)}
                        secureTextEntry={!isShowed} placeholder='Enter Password'
                        style={[Styles.input, { borderColor: isError ? Colors.Red : "lightgrey", borderWidth: isError ? 1.3 : 1, flex: 1 }]}>
                    </TextInput>

                    <TouchableOpacity style={{ marginRight: 25, marginTop: 15, }}
                        onPress={() => { setIsShowed(!isShowed) }}
                    >
                        {isShowed ? (
                            <FontAwesome5 name="eye-slash" size={20} color="black" />
                        ) : (
                            <FontAwesome5 name="eye" size={20} color="black" />
                        )}


                    </TouchableOpacity>
                </View>

                {isError ? (
                    <View>
                        <Text style={{ fontSize: 11, color: Colors.Red, fontWeight: 'bold', marginTop: -10 }}>
                            Tài khoản hoặc mật khẩu không chính xác, vui lòng thử lại!</Text>
                    </View>
                ) : (
                    null
                )}


                <TouchableOpacity style={Styles.button}
                    onPress={login}
                    disabled={loading}
                >
                    {loading ? (<ActivityIndicator size="small" color={Colors.White} />)

                        : (
                            <Text style={{ textAlign: 'center', color: Colors.White, fontWeight: 'bold' }}>
                                Sign In
                            </Text>
                        )}
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: Colors.White }}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={{ textAlign: 'center', color: Colors.Primary, fontWeight: 'bold' }}>
                        Create An Account ?
                    </Text>

                </TouchableOpacity>


                <TouchableOpacity style={[Styles.buttonNoFill, { borderColor: Colors.SearchButton, borderWidth: 2 }]}
                    onPress={signInWithGoogle} disabled={!request}
                >
                    <Text style={{ textAlign: 'center', color: Colors.SearchButton, fontWeight: 'bold' }}>
                        Sign In With Google
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={[Styles.buttonNoFill, { marginTop: 0, borderColor: Colors.Blue, borderWidth: 2 }]}
                    onPress={Facebook_Login}
                >
                    <Text style={{ textAlign: 'center', color: Colors.Primary, fontWeight: 'bold' }}>
                        Sign In With Facebook
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

export default Login;