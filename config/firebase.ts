import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_OWhpMZ9pemfqMJmZ_hv30cFksLlg6lU",
  authDomain: "truvamate-e3b97.firebaseapp.com",
  projectId: "truvamate-e3b97",
  storageBucket: "truvamate-e3b97.firebasestorage.app",
  messagingSenderId: "693226652314",
  appId: "1:693226652314:web:1d814042d754194131d523",
  measurementId: "G-G3DN3Z6Y60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
