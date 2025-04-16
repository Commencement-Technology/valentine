import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const AgePredictionScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [predictedAge, setPredictedAge] = useState<number | null>(null);
  const [predictedGender, setPredictedGender] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePredict = async () => {
    if (name.trim() === "") return; // Handle empty name input

    setLoading(true);
    setPredictedAge(null); // Reset previous age prediction
    setPredictedGender(null); // Reset previous gender prediction
    setError(null); // Reset previous error

    try {
      // Fetch age prediction
      const ageResponse = await axios.get(`https://api.agify.io?name=${name}`);
      setPredictedAge(ageResponse.data.age);

      // Fetch gender prediction
      const genderResponse = await axios.get(
        `https://api.genderize.io/?name=${name}`
      );
      setPredictedGender(genderResponse.data.gender);
    } catch (err) {
      setError("Failed to predict age or gender. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔮 Predict Your Age & Gender 🔮</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>

      {loading && (
        <LottieView
          source={require("../../assets/animation/loading.json")} // Replace with your Lottie file path
          autoPlay
          loop
          style={styles.lottie}
        />
      )}

      {!loading && predictedAge !== null && predictedGender !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>
            The predicted age for <Text style={styles.highlight}>{name}</Text>{" "}
            is <Text style={styles.highlight}>{predictedAge}</Text> years old.
          </Text>
          <Text style={styles.result}>
            The predicted gender for <Text style={styles.highlight}>{name}</Text>{" "}
            is <Text style={styles.highlight}>{predictedGender}</Text>.
          </Text>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#555",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF7755",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FF7755",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  lottie: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  result: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
  },
  highlight: {
    color: "#FF7755",
    fontWeight: "bold",
  },
  error: {
    fontSize: 16,
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
});

export default AgePredictionScreen;