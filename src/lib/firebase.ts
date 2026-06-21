import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuaKYcvgPLVncNqInMMhyH6pWQ-hoES0k",
  authDomain: "gen-lang-client-0998255849.firebaseapp.com",
  projectId: "gen-lang-client-0998255849",
  storageBucket: "gen-lang-client-0998255849.firebasestorage.app",
  messagingSenderId: "192281156967",
  appId: "1:192281156967:web:11f58aca26ec443ec923c2"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom database ID from firebase-applet-config
export const db = getFirestore(app, "ai-studio-ff2a218f-3fd6-4e75-9299-ca0d3da6bc59");
