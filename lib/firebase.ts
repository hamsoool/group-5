import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2dVmrBS5gcRuVVxBkSphX97wCdfDP8DI",
  authDomain: "cookbot-b4f41.firebaseapp.com",
  projectId: "cookbot-b4f41",
  storageBucket: "cookbot-b4f41.firebasestorage.app",
  messagingSenderId: "270967324187",
  appId: "1:270967324187:web:2621257755ed8d30f482be",
  measurementId: "G-Q9B1KEZ7DD"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
