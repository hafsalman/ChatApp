import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Signup
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    email,
    name
  });
};

// Login
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const logoutUser = () => {
  return signOut(auth);
};