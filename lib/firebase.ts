import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
  measurementId: "G-QJX3V90F55",
};

// Initialize Firebase
// We check if an app is already initialized to prevent errors during Next.js hot-reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics is only available in the browser (client-side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Export the Firestore database instance
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
