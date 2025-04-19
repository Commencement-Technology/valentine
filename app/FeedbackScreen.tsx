import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { supabase } from "../supabaseClient";
import { useRouter } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const telegramBotToken = process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID;
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  const animationSources: Record<string, any> = {
    loading: require("@/assets/animation/loading.json"),
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("feedback")
        .insert([{ feedback_text: feedback }]);

      if (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
        return;
      }

      const response = await axios.post(telegramUrl, {
        chat_id: telegramChatId,
        text: `New Feedback: ${feedback}`,
      });

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Feedback Sent!",
          text2: "Thanks for your thoughts 🙌",
          position: "top",
        });
        setTimeout(() => {
          setFeedback("");
          router.back();
        }, 1000);
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {loading ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <LottieView
              source={animationSources.loading}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.title}>Sending feedback...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>We value your feedback</Text>

            <TextInput
              placeholder="Write your thoughts here..."
              multiline
              value={feedback}
              onChangeText={setFeedback}
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!feedback.trim()}
              style={[styles.button, { opacity: feedback.trim() ? 1 : 0.5 }]}
            >
              <Text style={styles.buttonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  textInput: {
    height: 140,
    textAlignVertical: "top",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fafafa",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7E8EFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FeedbackScreen;
