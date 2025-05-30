import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore"; // ✅ fixed typo

const firebaseConfig = {
  apiKey: "AIzaSyBqzRbuyt-yuf7LvklAd7k-2jm2rBeYFnk",
  authDomain: "hackaton-c1e87.firebaseapp.com",
  projectId: "hackaton-c1e87",
  storageBucket: "hackaton-c1e87.appspot.com", // ✅ fixed storage bucket domain
  messagingSenderId: "342076948042",
  appId: "1:342076948042:web:30edc9c2a8951f243d70b3",
  measurementId: "G-L893PHJ2N6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ pass app instance

const colRef = collection(db, 'id'); // references your "id" collection

export { app, auth, db, colRef };
