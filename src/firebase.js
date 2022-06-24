// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxmzkT5OpxJ77q5fm-MFnohO0eetNmecE",
  authDomain: "landifit-9af52.firebaseapp.com",
  projectId: "landifit-9af52",
  storageBucket: "landifit-9af52.appspot.com",
  messagingSenderId: "1042897422571",
  appId: "1:1042897422571:web:15404d33f13cc5fbfad6ae",
  measurementId: "G-PZJ7GNCFZ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
