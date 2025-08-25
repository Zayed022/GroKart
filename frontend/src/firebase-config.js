// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc12jr9Gq90G6-3lCf2QiPESBBSDNPLyQ",
  authDomain: "grokart-2002.firebaseapp.com",
  projectId: "grokart-2002",
  storageBucket: "grokart-2002.firebasestorage.app",
  messagingSenderId: "285629310516",
  appId: "1:285629310516:web:b170777c6127d52e010c61",
  measurementId: "G-MX2BNWN3K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);