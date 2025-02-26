import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Lưu access token và refresh token vào AsyncStorage.
 * @param {string} accessToken 
 * @param {string} refreshToken 
 */
export const storeToken = async (accessToken, refreshToken, firebaseToken = null) => {
  try {
    await AsyncStorage.setItem('auth_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    if (firebaseToken)
      await AsyncStorage.setItem('firebase_token', firebaseToken);

  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Lấy refresh token từ AsyncStorage.
 * @returns {Promise<string | null>}
 */
export const getRefreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    return refreshToken;
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};

/**
 * Lấy refresh token từ AsyncStorage.
 * @returns {Promise<string | null>}
 */
export const getFirebaseToken = async () => {
  try {
    const firebaseToken = await AsyncStorage.getItem('firebase_token');
    return firebaseToken;
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};

/**
 * Lấy access token từ AsyncStorage.
 * @returns {Promise<string | null>}
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

/**
 * Xóa cả access token và refresh token khi đăng xuất.
 */
export const removeToken = async () => {
  try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('firebase_token');

  } catch (error) {
      console.error('Error removing token:', error);
  }
};
