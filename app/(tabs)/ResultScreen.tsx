import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

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
  const nameRegex = /^[A-Za-z]{3,15}$/;

  const handleSubmit = () => {
    if(name1&&!name2){
      setName2Error(
        "Give Your Crush name."
      );
    }else if(!name1&&name2){
      setName1Error(" Give your name.");
    }else{
      let valid = true;

    if (!nameRegex.test(name1)) {
      setName1Error("Plaese give valid name.");
      valid = false;
    } else {
      setName1Error("");
    }

    if (!nameRegex.test(name2)) {
      setName2Error(
        "Plaese give valid name."
      );
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
      {!showResult ? (
        <>
          <Text style={styles.title}>🔥 FLAMES 🔥</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name1}
            onChangeText={(text) => {
              setName1(text);
              if (name1Error) setName1Error(""); // clear error while typing
            }}
          />
          {name1Error ? (
            <Text style={styles.errorText}>{name1Error}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Enter crush's name"
            value={name2}
            onChangeText={(text) => {
              setName2(text);
              if (name2Error) setName2Error(""); // clear error while typing
            }}
          />
          {name2Error ? (
            <Text style={styles.errorText}>{name2Error}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Check 🔮</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text style={styles.title}>FLAMES Match</Text>
          <Text style={styles.names}>
            {name1} ❤️ {name2}
          </Text>

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
              <Text style={styles.resultText}>🔥 You both are {result} 🔥</Text>
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

          <TouchableOpacity
            style={[styles.button, !result && styles.disabledButton]}
            onPress={handleTryAgain}
            disabled={!result}
          >
            <Text style={styles.buttonText}>Try with New Names</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
  },
  
  title: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
    color: "#FF7755",
  },
  input: {
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
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#7E8EFF",
    fontWeight: "600",
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
    borderColor: "#FF7755",
    borderRadius: 8,
    margin: 5,
    padding: 10,
    width: 45,
    alignItems: "center",
  },
  letterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
});
