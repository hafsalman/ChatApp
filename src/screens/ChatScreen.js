import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { auth } from "../config/firebase";
import { sendMessage, subscribeMessages } from "../services/chatService";

export default function ChatScreen({ route, navigation }) {
  const { user } = route.params;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const insets = useSafeAreaInsets();
  const flatListRef = useRef();

  const chatId =
    auth.currentUser.uid > user.uid
      ? auth.currentUser.uid + "_" + user.uid
      : user.uid + "_" + auth.currentUser.uid;

  // 🔥 HEADER
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
              backgroundColor: "#25D366",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {user.name?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {user.name}
            </Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>online</Text>
          </View>
        </View>
      ),
      headerStyle: { backgroundColor: "#075E54" },
      headerTintColor: "#fff"
    });
  }, []);

  // 🔥 REALTIME + AUTOSCROLL
  useEffect(() => {
    const unsubscribe = subscribeMessages(chatId, (msgs) => {
      setMessages(msgs);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage(chatId, {
      text: message,
      sender: auth.currentUser.uid,
      createdAt: new Date()
    });

    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60} // ✅ FIXED (pehle 80 tha)
    >
      <View style={{ flex: 1 }}>

        {/* MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf:
                  item.sender === auth.currentUser.uid
                    ? "flex-end"
                    : "flex-start",
                backgroundColor:
                  item.sender === auth.currentUser.uid
                    ? "#DCF8C6"
                    : "#E5E5E5",
                padding: 10,
                borderRadius: 10,
                marginBottom: 8,
                maxWidth: "75%"
              }}
            >
              <Text>{item.text}</Text>
            </View>
          )}
        />

        {/* INPUT AREA */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            paddingBottom: 35 , // ✅ FIXED (no *5)
            borderTopWidth: 1,
            borderColor: "#ddd",
            backgroundColor: "#fff",
            alignItems: "center"
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type message..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 20,
              paddingHorizontal: 12,
              marginRight: 10,
              height: 40
            }}
          />

          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: "#25D366",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 20
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}