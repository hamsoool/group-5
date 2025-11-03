import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);