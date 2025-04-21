import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const animationSources: Record<string, any> = {
  love: require("@/assets/animation/love.json"),
  marriage: require("@/assets/animation/marriage.json"),
  friends: require("@/assets/animation/friends.json"),
  affection: require("@/assets/animation/affection.json"),
  enemy: require("@/assets/animation/enemy.json"),
  siblings: require("@/assets/animation/siblings.json"),
  loading: require("@/assets/animation/loading.json"),
};

const flamesMap = [
  "Friends",
  "Love",
  "Affection",
  "Marriage",
  "Enemy",
  "Siblings",
];

const calculateFlamesWithCrosses = (
  name1: string,
  name2: string,
  callback: (eliminatedIndexes: number[], finalResult: string | null) => void
) => {
  let n1 = name1.toLowerCase().replace(/\s/g, "");
  let n2 = name2.toLowerCase().replace(/\s/g, "");

  for (let i = 0; i < n1.length; i++) {
    const char = n1[i];
    const indexInN2 = n2.indexOf(char);
    if (indexInN2 !== -1) {
      n1 = n1.replace(char, "");
      n2 = n2.replace(char, "");
      i--;
    }
  }

  const total = n1.length + n2.length;
  const flames = ["F", "L", "A", "M", "E", "S"];
  let eliminated: number[] = [];
  let remaining = flames.map((_, i) => i);
  let index = 0;

  const interval = setInterval(() => {
    if (remaining.length > 1) {
      index = (index + total - 1) % remaining.length;
      eliminated.push(remaining[index]);
      remaining.splice(index, 1);
      callback([...eliminated], null);
    } else {
      clearInterval(interval);
      callback([...eliminated], flamesMap[remaining[0]]);
    }
  }, 1000);
};

const CombinedFlamesScreen = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [eliminatedIndexes, setEliminatedIndexes] = useState<number[]>([]);
  const [result, setResult] = useState("");
  const flames = ["F", "L", "A", "M", "E", "S"];
  const [name1Error, setName1Error] = useState("");
  const [name2Error, setName2Error] = useState("");
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;

  const handleSubmit = () => {
    if (name1 && !name2) {
      setName2Error("Give Your Crush name.");
    } else if (!name1 && name2) {
      setName1Error(" Give your name.");
    } else {
      let valid = true;

      if (!nameRegex.test(name1)) {
        setName1Error("Plaese give valid name.");
        valid = false;
      } else {
        setName1Error("");
      }

      if (!nameRegex.test(name2)) {
        setName2Error("Plaese give valid name.");
        valid = false;
      } else {
        setName2Error("");
      }

      if (!valid) return;

      setShowResult(true);
      setResult("");
      setEliminatedIndexes([]);
      calculateFlamesWithCrosses(name1, name2, (eliminated, finalResult) => {
        setEliminatedIndexes(eliminated);
        if (finalResult) setResult(finalResult);
      });
    }
  };

  const handleTryAgain = () => {
    setResult("");
    setName1("");
    setName2("");
    setName1Error("");
    setName2Error("");
    setShowResult(false);
    setEliminatedIndexes([]);
  };

  const handleBack = () => {
    setShowResult(false);
    setName1("");
    setName2("");
    setResult("");
    setName1Error("");
    setName2Error("");
    setEliminatedIndexes([]);
    router.back();
  };

  return (
    <LinearGradient
      colors={["#CB8FC2", "#B8A4E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>FLAMES</Text>
        </View>
      </TouchableOpacity>
      {!showResult && (
        <Image
          style={styles.bottomImage}
          source={require("../../assets/images/flames.svg")}
        />
      )}

      {!showResult ? (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={styles.progressInputContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_input.svg")}
            />

            <View style={styles.progressBarInputBackground}>
              <TextInput
                style={styles.progressInput}
                placeholder="Your Name"
                placeholderTextColor="#999"
                value={name1}
                onChangeText={(text) => {
                  setName1(text);
                  if (name1Error) setName1Error(""); // clear error while typing
                }}
              />
            </View>
          </View>

          {name1Error ? (
            <Text style={styles.errorText}>{name1Error}</Text>
          ) : null}
          <Image
            source={require("../../assets/icons/ic_heart.svg")} // your custom SVG
            style={styles.loveIcon}
          />
          <View style={styles.progressInputContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_input.svg")}
            />

            <View style={styles.progressBarInputBackground}>
              <TextInput
                style={styles.progressInput}
                placeholder="Your Crush Name"
                placeholderTextColor="#999"
                value={name2}
                onChangeText={(text) => {
                  setName2(text);
                  if (name1Error) setName2Error(""); // clear error while typing
                }}
              />
            </View>
          </View>
          {name2Error ? (
            <Text style={styles.errorText}>{name2Error}</Text>
          ) : null}
          <TouchableOpacity onPress={handleSubmit}>
            <LinearGradient
              colors={["#F16886", "#FFCFBA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.askButton}
            >
              <Text style={styles.ButtonText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.namesWrapper}>
            <Text style={styles.namesText}>{name1}</Text>

            <Image
              source={require("../../assets/icons/ic_heart.svg")} // your custom SVG
              style={styles.loveIcon}
            />

            <Text style={styles.namesText}>{name2}</Text>
          </View>

          <View style={styles.flamesRow}>
            {flames.map((char, idx) => (
              <View key={idx} style={styles.letterBox}>
                <Text style={styles.letterText}>
                  {eliminatedIndexes.includes(idx) ? "❌" : char}
                </Text>
              </View>
            ))}
          </View>

          {result ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.resultText}>You both are {result}</Text>
              <LottieView
                source={animationSources[result.toLowerCase()]}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.resultText}>Cupid was working...</Text>
              <LottieView
                source={animationSources.loading}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
            </View>
          )}
          <TouchableOpacity onPress={handleTryAgain}>
            <LinearGradient
              colors={["#F16886", "#FFCFBA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.askButton, { marginTop: 10 }]}
            >
              <Text style={styles.ButtonText}>Try with New Names</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

export default CombinedFlamesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: -30, // space between icon and bar
    zIndex: 2,
  },
  progressInput: {
    width: "100%",
    height: "100%",
    color: "#000",
    paddingLeft: 30,
    fontSize: 16,
    fontWeight: "600",
  },
  progressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 16,
    width: "100%",
  },
  loveIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  progressBarInputBackground: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#F16886",
  },
  namesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  bottomImage: {
    width: 250,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
  },

  namesText: {
    fontSize: 20,
    fontFamily: "k2dBold",
    fontWeight: "600",
    color: "white",
    marginHorizontal: 6,
  },
  errorText: {
    color: "red",
    fontFamily: "k2dLight",
    fontSize: 12,
    lineHeight:12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    fontSize: 18,
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
  disabledButton: {
    backgroundColor: "#ccc",
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
  names: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  flamesRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  letterBox: {
    borderWidth: 1,
    borderColor: "#F16886",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 5,
    padding: 10,
    width: 45,
    alignItems: "center",
  },
  letterText: {
    fontSize: 17,
    fontFamily: "K2dBold",
  },
  resultText: {
    fontSize: 22,
    fontFamily: "k2dBold",
    textAlign: "center",
    marginVertical: 20,
  },
});
