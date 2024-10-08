import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5GCCNQ5L33GFWw9qpdXDm7x8_PVupayg",
  authDomain: "collaborative-notes-app-926e6.firebaseapp.com",
  projectId: "collaborative-notes-app-926e6",
  storageBucket: "collaborative-notes-app-926e6.appspot.com",
  messagingSenderId: "877973534471",
  appId: "1:877973534471:web:898168044e0b940f6af7a2",
  measurementId: "G-ZV8F4QXG48",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
