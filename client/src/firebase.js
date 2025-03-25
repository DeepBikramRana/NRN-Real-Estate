// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqTnOslCoKHjnkO5WW9T3UUcThK82Z_u4",  // Note the quotes around the API key
  authDomain: "nrn-real-estate.firebaseapp.com",
  projectId: "nrn-real-estate",
  storageBucket: "nrn-real-estate.firebasestorage.app",
  messagingSenderId: "1037701408867",
  appId: "1:1037701408867:web:76ccc5bf8b167df38e7056"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Add this line to export auth