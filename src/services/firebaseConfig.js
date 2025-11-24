// Firebase Configuration
// TODO: Replace with your Firebase project credentials
// Get these from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAw1daCEmonGBR5gZVgMJFU_CBPwQkGJXE",
    authDomain: "myvoca-f56a2.firebaseapp.com",
    projectId: "myvoca-f56a2",
    storageBucket: "myvoca-f56a2.firebasestorage.app",
    messagingSenderId: "73368485578",
    appId: "1:73368485578:web:edec071c8db4c188f5be33",
    measurementId: "G-QXKESL77RQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
