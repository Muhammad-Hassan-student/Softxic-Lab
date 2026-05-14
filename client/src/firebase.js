// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "softxic-labs.firebaseapp.com",
  projectId: "softxic-labs",
  storageBucket: "softxic-labs.firebasestorage.app",
  messagingSenderId: "280722817069",
  appId: "1:280722817069:web:0d98c7f917cc217a0978a4",
  measurementId: "G-3F7THEV0V6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
