import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";

// Import your Lottie files
import loadingAnim from "../../assets/animation/loading.json";
import animation0to16 from "../../assets/animation/enemy.json";
import animation17to33 from "../../assets/animation/siblings.json";
import animation34to50 from "../../assets/animation/siblings.json";
import animation51to66 from "../../assets/animation/friends.json";
import animation67to83 from "../../assets/animation/love.json";
import animation84to100 from "../../assets/animation/love.json";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

const LoveCheckerScreen = () => {
  const router = useRouter();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [name1Error, setName1Error] = useState("");
  const [name2Error, setName2Error] = useState("");
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;

  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      loadingAnim.setValue(0);
      Animated.loop(
        Animated.timing(loadingAnim, {
          toValue: 100,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    } else {
      loadingAnim.stopAnimation();
    }
  }, [loading]);

  const handleSubmit = () => {
    // Trim inputs to catch empty whitespace entries
    const trimmedName1 = name1.trim();
    const trimmedName2 = name2.trim();

    // Reset previous errors
    setName1Error("");
    setName2Error("");

    // Early validation: check if one name is missing
    if (trimmedName1 && !trimmedName2) {
      setName2Error("Give your crush's name.");
      return;
    }

    if (!trimmedName1 && trimmedName2) {
      setName1Error("Give your name.");
      return;
    }

    // Validate both fields
    let valid = true;

    if (!nameRegex.test(trimmedName1)) {
      setName1Error("Please give a valid name.");
      valid = false;
    }

    if (!nameRegex.test(trimmedName2)) {
      setName2Error("Please give a valid name.");
      valid = false;
    }

    if (!valid) return;

    // Proceed with logic
    setLoading(true);
    setShowResult(true);
    const percent = calculateLovePercentage(trimmedName1, trimmedName2);
    setPercentage(percent);


    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleback = () => {
    setPercentage(0);
    setName1("");
    setName2("");
    setShowResult(false);
    setLoading(false);
    router.back();
  };
  const handleReset = () => {
    setPercentage(0);
    setName1("");
    setName2("");
    setShowResult(false);
    setLoading(false);
  };

  const calculateLovePercentage = (n1: string, n2: string): number => {
    const fullString = `${n1.toLowerCase()}loves${n2.toLowerCase()}`.replace(
      /\s/g,
      ""
    );
    const countMap: { [key: string]: number } = {};
    const countList: number[] = [];

    for (let char of fullString) {
      if (!countMap[char]) {
        const count = fullString.split("").filter((c) => c === char).length;
        countMap[char] = count;
        countList.push(count);
      }
    }

    let current = countList;
    while (current.length > 2) {
      const next: number[] = [];
      let i = 0,
        j = current.length - 1;
      while (i <= j) {
        if (i === j) next.push(current[i]);
        else {
          const sum = current[i] + current[j];
          sum >= 10
            ? next.push(Math.floor(sum / 10), sum % 10)
            : next.push(sum);
        }
        i++;
        j--;
      }
      current = next;
    }

    return parseInt(current.join(""));
  };

  return (
    <LinearGradient
      colors={["#FF9492", "#FFD1BB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="arrowleft" size={24} color="white" />
          <Text style={styles.backButtonText}>Love Calc</Text>
        </View>
      </TouchableOpacity>
      <Image
        style={styles.bottomImage}
        source={require("../../assets/images/Calc.svg")}
      />
      {percentage ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.namesWrapper}>
            <Text style={styles.namesText}>{name1}</Text>

            <Image
              source={require("../../assets/icons/ic_heart.svg")} // your custom SVG
              style={styles.loveIcon}
            />

            <Text style={styles.namesText}>{name2}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_input.svg")}
            />

            <View style={styles.progressBarBackground}>
              {loading ? (
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: loadingAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              ) : (
                <View
                  style={[styles.progressBarFill, { width: `${percentage}%` }]}
                />
              )}
            </View>
          </View>
          {!loading && (
            <View style={styles.percentageBadgeWrapper}>
              <Image
                source={require("../../assets/icons/ic_per.svg")}
                style={styles.percentageBadgeImage}
              />
              <Text style={styles.percentageInBadge}>{percentage}%</Text>
            </View>
          )}

          <TouchableOpacity onPress={handleReset}>
            <LinearGradient
              colors={["#F16886", "#FFCFBA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.askButton}
            >
              <Text style={styles.ButtonText}>Try with New Names</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={styles.progressInputContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_input.svg")}
            />

            <View style={styles.progressBarInputBackground}>
              <TextInput
                style={styles.progressInput}
                placeholder="your name"
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
          
          <View style={styles.progressInputContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_input.svg")}
            />

            <View style={styles.progressBarInputBackground}>
              <TextInput
                style={styles.progressInput}
                placeholder="your Crush name"
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
      )}
    </LinearGradient>
  );
};

export default LoveCheckerScreen;

const styles = StyleSheet.create({
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

  progressBarInputBackground: {
    flex: 1,
    height: 45,
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
    fontWeight: "600",
    color: "white",
    marginHorizontal: 6,
  },

  loveIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  percentageBadgeWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  percentageBadgeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  percentageInBadge: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: -30, // space between icon and bar
    zIndex: 2,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 20,
  },
  progressBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
  },
  progressBarBackground: {
    width: "80%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    marginVertical: 20,
    borderWidth: 3,
    borderColor: "#F16886",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#17BB84", // you can change this to any color you like
    borderRadius: 30,
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
    fontFamily:'k2dMedium',
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    fontFamily: "k2dLight",
    fontSize: 12,
    lineHeight:12,
  }, 
  percentage: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#7E8EFF",
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
});
