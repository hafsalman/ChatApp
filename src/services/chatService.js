import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from "firebase/firestore";

// Send message
export const sendMessage = async (chatId, message) => {
  await addDoc(collection(db, "chats", chatId, "messages"), message);
};

// Listen messages
export const subscribeMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => doc.data());
    callback(msgs);
  });
};