// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-d815e.firebaseapp.com",
  projectId: "mern-blog-d815e",
  storageBucket: "mern-blog-d815e.appspot.com",
  messagingSenderId: "309427200284",
  appId: "1:309427200284:web:35d702d73e98ec8e1adad9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);