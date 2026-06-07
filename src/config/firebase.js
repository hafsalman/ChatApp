import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "API_key",
  authDomain: "Auth_domain",
  projectId: "Project_id",
  storageBucket: "Storage_bucket",
  messagingSenderId: "Messaging_sender_id",
  appId: "App_id",
};

// initialize
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);