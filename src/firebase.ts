// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAk-I6YSOBwOpnt3NWln88XDxWdUeeb_0",
  authDomain: "ravi-872c7.firebaseapp.com",
  databaseURL: "https://ravi-872c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ravi-872c7",
  storageBucket: "ravi-872c7.appspot.com",
  messagingSenderId: "124991265238",
  appId: "1:124991265238:web:3b2468620db6dc04c46c77",
  measurementId: "G-KCZ4D9FQM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const messaging = getMessaging(app);



export { database, messaging };
