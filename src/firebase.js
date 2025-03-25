// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // 🔥 Import Firebase Auth

const firebaseConfig = {
  apiKey: "AIzaSyC4ZbBxxe0WDPG8SKuwMJrEABs0DgGzdQw",
  authDomain: "educycle-61a74.firebaseapp.com",
  projectId: "educycle-61a74",
  storageBucket: "educycle-61a74.appspot.com", // fixed typo in your original (should be .app**spot**.com)
  messagingSenderId: "731237756631",
  appId: "1:731237756631:web:d7bc1e166069c91c760a92",
  measurementId: "G-B65NWQKVQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ✅ Initialize Auth

export { auth }; // ✅ Export for use in Login.jsx
