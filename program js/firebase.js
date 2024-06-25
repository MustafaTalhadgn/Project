// Import the functions you need from the SDKs you need
import {
  getApp,
  getApps,
  initializeApp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyDMHAjxUIGNYJfiN4-I_6riX9UjebSOM",
  authDomain: "gorevler-47350.firebaseapp.com",
  projectId: "gorevler-47350",
  storageBucket: "gorevler-47350.appspot.com",
  messagingSenderId: "1039990050808",
  appId: "1:1039990050808:web:dc4687f9690e7366d8100d",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
