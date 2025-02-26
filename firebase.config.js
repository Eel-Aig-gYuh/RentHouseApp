// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXIcSJvCEsuR86K-JYNZLSDMhL9SCPedg",
  authDomain: "renthouseappv3.firebaseapp.com",
  projectId: "renthouseappv3",
  storageBucket: "renthouseappv3.firebasestorage.app",
  messagingSenderId: "734617815625",
  appId: "1:734617815625:web:85061c5476a232b7f2cd98",
  measurementId: "G-KNKYNVKLYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Check if Analytics is supported before initializing
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.warn("Firebase Analytics is not supported in this environment.");
  }
});

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const userRef = collection(db, "users");
export const roomRef = collection(db, "rooms");

export default auth;