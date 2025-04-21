import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import LottieView from "lottie-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const PickupLineScreen = () => {
  const [pickupLine, setPickupLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [save, setsave] = useState(false);
  useFocusEffect(
    useCallback(() => {
      logFavorites();
    }, [])
  );
  const logFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem("pickupFavorites");
      const favorites = stored ? JSON.parse(stored) : [];
      setFavorites(favorites);
    } catch (error) {
      console.error("Failed to load favorites", error);
    }
  };
  const fetchPickupLine = async () => {
    setLoading(true);
    setPickupLine("");
    setCopied(false);
    fadeAnim.setValue(0); // Reset animation
    try {
      const response = await axios.get(
        "https://rizzapi.vercel.app/random/text"
      );
      const data = response.data;
      setPickupLine(data || "No pickup line found 😅");

      // Animate pickup line appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setPickupLine("Oops! Something went wrong.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(pickupLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFavorite = async () => {
    try {
      setsave(true);
      const existingFavorites = await AsyncStorage.getItem("pickupFavorites");
      const parsedFavorites = existingFavorites
        ? JSON.parse(existingFavorites)
        : [];

      if (!parsedFavorites.includes(pickupLine)) {
        const updatedFavorites = [...parsedFavorites, pickupLine];
        await AsyncStorage.setItem(
          "pickupFavorites",
          JSON.stringify(updatedFavorites)
        );
      }
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  const handleback = async () => {
    setPickupLine("");
    setCopied(false);
    fadeAnim.setValue(0); // Reset animation
    setPickupLine("");
    router.back();
  };

  return (
    <LinearGradient
      colors={["#8DABF1", "#D9E4FD"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>Love Line</Text>
        </View>
      </TouchableOpacity>
      {favorites.length > 0 || save ? (
        <TouchableOpacity
          style={styles.rightbackButton}
          onPress={() => router.push("/Favourites")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/icons/ic_heart.svg")}
              style={styles.loveIcon}
            />
            <Text style={styles.rightbackButtonText}>Show Favouries</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {loading ? (
        <LottieView
          source={require("../../assets/animation/loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      ) : (
        pickupLine !== "" && (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.pickupText}>{pickupLine}</Text>

            <View style={styles.actionsRow}>
              {!copied && (
                <TouchableOpacity
                  onPress={handleCopy}
                  style={styles.iconButton}
                >
                  <Feather name="copy" size={22} color="#FF7755" />
                  <Text>Copy</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleSaveFavorite}
                style={styles.iconButton}
              >
                <Feather name="heart" size={22} color="#FF7755" />
                <Text>Save</Text>
              </TouchableOpacity>
            </View>

            {copied && <Text style={styles.copied}>Copied ✅</Text>}
          </Animated.View>
        )
      )}
      <TouchableOpacity onPress={fetchPickupLine}>
        <LinearGradient
          colors={["#F16886", "#FFCFBA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.askButton}
        >
          <Text style={styles.ButtonText}>Get your Pick Line</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Image
        style={styles.bottomImage}
        source={require("../../assets/images/pickline.svg")}
      />
    </LinearGradient>
  );
};

export default PickupLineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  loveIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  bottomImage: {
    width: 250,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 30,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 20,
    maxWidth: "100%",
    alignItems: "center",
  },
  pickupText: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#444",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "NunitoSans-Regular",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: "#FFF0EC",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    gap: 5,
  },
  copied: {
    marginTop: 10,
    fontSize: 14,
    color: "#0BFDA6",
    fontWeight: "600",
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
  ButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  rightbackButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontFamily: "k2dMedium",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  rightbackButton: {
    position: "absolute",
    top: 30,
    right: 20,
    marginTop: 10,
  },
  backButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontFamily: "k2dMedium",
    fontSize: 20,
    textAlign: "center",
  },
});
