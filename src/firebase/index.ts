// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4MDRel3fTteFDeQsyTtgn0lc4wsrY_1E",
  authDomain: "open-trinity.firebaseapp.com",
  projectId: "open-trinity",
  storageBucket: "open-trinity.appspot.com",
  messagingSenderId: "321708036252",
  appId: "1:321708036252:web:69a370a8c2c33ffc73dd59",
  measurementId: "G-5K87PGGMQS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

if (window.location.hostname === "localhost") {
    console.log('Using emulators for Firebase services on localhost');
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
}
