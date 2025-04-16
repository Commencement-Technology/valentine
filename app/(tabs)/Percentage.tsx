import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

const LoveCheckerScreen = () => {
  const router = useRouter();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [animationSource, setAnimationSource] = useState(animation84to100);

  const handleSubmit = () => {
    if (name1.trim() && name2.trim()) {
      setLoading(true);
      setShowResult(true);
      const percent = calculateLovePercentage(name1, name2);
      setPercentage(percent);

      if (percent <= 16) setAnimationSource(animation0to16 as any);
      else if (percent <= 33) setAnimationSource(animation17to33 as any);
      else if (percent <= 50) setAnimationSource(animation34to50 as any);
      else if (percent <= 66) setAnimationSource(animation51to66 as any);
      else if (percent <= 83) setAnimationSource(animation67to83 as any);
      else setAnimationSource(animation84to100 as any);

      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const handleReset = () => {
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

  if (showResult) {
    return (
      <View style={styles.container}>
        {loading ? (
          <>
            <LottieView
              source={loadingAnim}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.loadingText}>Calculating your Love... 🔮</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>💘 Love Compatibility 💘</Text>
            <Text style={styles.names}>
              {name1} ❤️ {name2}
            </Text>
            <Text style={styles.percentage}>{percentage}%</Text>
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={styles.animation}
            />
            <TouchableOpacity style={styles.backButton} onPress={handleReset}>
              <Text style={styles.backButtonText}>🔙 Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>🔥 Love Calculator 🔥</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name1}
        onChangeText={setName1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter crush's name"
        value={name2}
        onChangeText={setName2}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Let's Calculate💘</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoveCheckerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#FF7755",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#FF7755",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  names: {
    fontSize: 20,
    marginBottom: 10,
  },
  percentage: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#7E8EFF",
  },
  animation: {
    width: 200,
    height: 200,
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#444",
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
});
