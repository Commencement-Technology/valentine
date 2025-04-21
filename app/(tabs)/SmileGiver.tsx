import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const SmileGiver = () => {
  const [setup, setSetup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  const router = useRouter();
  const handleback = () => {
    setSetup("");
    setDelivery("");
    router.back();
  };
  const getJoke = async () => {
    setLoading(true);
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
        },
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } else {
      Alert.alert("No Joke", "Please fetch a joke first!");
    }
  };

  return (
    <LinearGradient
      colors={["#7ACBC9", "#BDE0F7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:20}}>
        <TouchableOpacity onPress={getJoke}>
        <LinearGradient
          colors={["#F16886", "#FFCFBA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // Horizontal gradient (90deg)
          style={styles.askButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : setup || delivery ? (
            <Text style={styles.askButtonText}>Tell Me another Joke</Text>
          ) : (
            <Text style={styles.askButtonText}>Tell Me a Joke</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
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
              }}
            >
              <Ionicons name="volume-high-outline" size={28} color="#3498db" />
            </View>
          )}
        </TouchableOpacity>
      )}
      </View>
      

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

      
  

      {!setup && !delivery && !loading && (
        <Text style={styles.placeholderText}>
          Your joke will appear here...
        </Text>
      )}
      <Image
        style={styles.image}
        source={require("../../assets/images/joke.svg")}
      />
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>LoveGiggles</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
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
  image: {
    position: "absolute",
    bottom: 60,
    width: 300,
    height: 210,
    marginRight: 8,
  },
 
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  backButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontFamily: "k2dMedium",
    fontSize: 20,
    textAlign: "center",
  },
  speakerButton: {
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
    alignItems: "center",
    justifyContent: "center",
  },
  
  askButton: {
    width: 248,
    padding: 10,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
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
    fontFamily:'k2dMedium',
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
    fontFamily:'k2dMedium',
    textAlign: "center",
  },
});

export default SmileGiver;
