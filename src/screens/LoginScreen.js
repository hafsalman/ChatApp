import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text
        style={{ marginTop: 15, color: "blue" }}
        onPress={() => navigation.navigate("Signup")}
      >
        Create new account
      </Text>
    </View>
  );
}