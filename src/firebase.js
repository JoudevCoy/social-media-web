import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBszfQqPMubYnmBzaGGfgHSgrXhXfUUTMg",
  authDomain: "joudev-belajar-firebase1-4ec96.firebaseapp.com",
  databaseURL: "https://joudev-belajar-firebase1-4ec96-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "joudev-belajar-firebase1-4ec96",
  storageBucket: "joudev-belajar-firebase1-4ec96.appspot.com",
  messagingSenderId: "91843824903",
  appId: "1:91843824903:web:8b58df2a7a3b222cc0c9a2",
  measurementId: "G-42FB2239BV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth}