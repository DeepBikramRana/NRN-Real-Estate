// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nrn-real-estate.firebaseapp.com",
  projectId: "nrn-real-estate",
  storageBucket: "nrn-real-estate.firebasestorage.app",
  messagingSenderId: "1037701408867",
  appId: "1:1037701408867:web:76ccc5bf8b167df38e7056"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);