import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";

const SmileGiver = () => {
  const [setup, setSetup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [laughText, setLaughText] = useState("");
 const router=useRouter();
  const handleback =()=>{
    setSetup("");
    setDelivery("");
    setLaughText("");
    router.back();
 }
  const getJoke = async () => {
    setLoading(true);
    setLaughText("");
    setSetup("");
    setDelivery("");
    try {
      const response = await axios.get(
        "https://v2.jokeapi.dev/joke/Any?blacklistFlags=sexist&type=twopart"
      );
      if (response.data && response.data.setup && response.data.delivery) {
        setSetup(response.data.setup);
        setDelivery(response.data.delivery);
      } else {
        setSetup("Could not fetch a joke at the moment.");
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
      setSetup("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const playJoke = () => {
    if (setup || delivery) {
      setSpeaking(true);
      setLaughText("");

      const endings = [
        "hehehe",
        "gotcha!",
        "classic!",
        "that was a good one!",
        "lol",
        "hahaha",
      ];

      const randomEnding = endings[Math.floor(Math.random() * endings.length)];
      
      const fullJoke = `${setup}... ${delivery}... ${randomEnding}`;

      Speech.speak(fullJoke, {
        language: "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          setSpeaking(false);
          setLaughText(randomEnding);
        },
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
        
      });
      
    } else {
      Alert.alert("No Joke", "Please fetch a joke first!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>😂 Smile Giver</Text>

      <TouchableOpacity style={styles.askButton} onPress={getJoke}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.askButtonText}>Tell Me a Joke</Text>
        )}
      </TouchableOpacity>

      {(setup || delivery) && (
        <View style={styles.chatContainer}>
          {setup ? (
            <View style={styles.messageRowLeft}>
              <Text style={styles.avatar}>👤</Text>
              <View style={styles.messageBubbleLeft}>
                <Text style={styles.messageText}>{setup}</Text>
              </View>
            </View>
          ) : null}
          {delivery ? (
            <View style={styles.messageRowRight}>
              <View style={styles.messageBubbleRight}>
                <Text style={styles.messageText}>{delivery}</Text>
              </View>
              <Text style={styles.avatar}>😄</Text>
            </View>
          ) : null}
        </View>
      )}

      {setup && delivery && (
        <TouchableOpacity
          onPress={playJoke}
          disabled={speaking}
          style={styles.speakerButton}
          activeOpacity={0.7}
        >
          {speaking ? (
            <ActivityIndicator size={28} color="#3498db" />
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                gap: 10,
              }}
            >
              <Ionicons name="volume-high-outline" size={28} color="#3498db" />
              <Text style={styles.speakerLabel}>Listen</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {laughText !== "" && <Text style={styles.laughText}>{laughText}</Text>}

      {!setup && !delivery && !loading && (
        <Text style={styles.placeholderText}>
          Your joke will appear here...
        </Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  speakerLabel: {
    fontSize: 14,
    color: "#3498db",
    marginTop: 6,
    textAlign: "center",
  },
  laughText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#e67e22", // Fun orange
    textAlign: "center",
    fontStyle: "italic",
    transform: [{ rotate: "-2deg" }],
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButtonText: {
    color: "#444",
    fontSize: 16,
    textAlign: "center",
  },
  speakerButton: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#2C3E50",
  },
  askButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  askButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    marginTop: 30,
    width: "100%",
  },
  messageRowLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  messageRowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avatar: {
    fontSize: 24,
    marginHorizontal: 8,
    marginTop: 4,
  },
  messageBubbleLeft: {
    maxWidth: "75%",
    backgroundColor: "#ecf0f1",
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
  },
  messageBubbleRight: {
    maxWidth: "75%",
    backgroundColor: "#d1f7c4",
    padding: 12,
    borderRadius: 12,
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  speakerIcon: {
    marginTop: 20,
  },
  placeholderText: {
    marginTop: 40,
    fontSize: 16,
    color: "#7f8c8d",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default SmileGiver;
