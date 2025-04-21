import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { supabase } from "../supabaseClient";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      if (loginError.message.includes("Invalid login credentials")) {
        // Try sign up
        const { data: signupData, error: signupError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (signupError) {
          Alert.alert("Signup error", signupError.message);
        } else {
          Alert.alert(
            "Signup successful!",
            "Check your email to verify (if required). Now try logging in."
          );
        }
      } else {
        Alert.alert("Login error", loginError.message);
      }
    } else {
      router.push("/(tabs)");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login / Signup" onPress={handleLogin} />
    </View>
  );
}
