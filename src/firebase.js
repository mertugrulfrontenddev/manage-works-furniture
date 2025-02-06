// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // collection ve addDoc'u içe aktardık

const firebaseConfig = {
  apiKey: "AIzaSyAu5VCHZacIt7uULzNJexC-ppWq6obSdr4",
  authDomain: "furnituredatabase-b83e8.firebaseapp.com",
  projectId: "furnituredatabase-b83e8",
  storageBucket: "furnituredatabase-b83e8.firebasestorage.app",
  messagingSenderId: "1041708294499",
  appId: "1:1041708294499:web:29b8318f137859c11f7356",
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore referansı oluştur
const db = getFirestore(app); // Firestore referansını aldık

export { db, addDoc, collection }; // collection fonksiyonunu da dışa aktardık
