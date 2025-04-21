import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Interface for compatibility result
interface MatchResult {
  sign1: string;
  sign2: string;
  score: number;
  message: string;
}

// Get zodiac sign from a date
const getZodiacSign = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius ♒";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
    return "Pisces ♓";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return "Aries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return "Taurus ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return "Gemini ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return "Cancer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return "Virgo ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius ♐";
  return "Capricorn ♑";
};

// Compatibility chart
const compatibilityChart: Record<
  string,
  Record<string, { score: number; message: string }>
> = {
  "Aries ♈": {
    "Gemini ♊": { score: 88, message: "Fire + Air = explosive fun! 💥" },
    "Cancer ♋": {
      score: 45,
      message: "One’s fiery, one’s feelsy. Could be spicy 🌶️",
    },
  },
  "Gemini ♊": {
    "Aries ♈": {
      score: 88,
      message: "Y’all are made for memes & mischief 😈",
    },
  },
};

// Safe compatibility fetcher
const getCompatibility = (
  sign1: string,
  sign2: string
): { score: number; message: string } => {
  const [s1, s2] = [sign1, sign2].sort();
  if (s1 in compatibilityChart && s2 in compatibilityChart[s1]) {
    return compatibilityChart[s1][s2];
  }
  return {
    score: Math.floor(Math.random() * 51) + 30, // 30 to 80
    message: "The stars say it’s a mystery, but sparks could fly! 💫",
  };
};

export default function StarMatchScreen() {
  const [date1, setDate1] = useState<Date>(new Date());
  const [date2, setDate2] = useState<Date>(new Date());
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const router = useRouter();
  const handleMatch = () => {
    const sign1 = getZodiacSign(date1);
    const sign2 = getZodiacSign(date2);
    const match = getCompatibility(sign1, sign2);
    setResult({ sign1, sign2, score: match.score, message: match.message });
  };
  const handleback = () => {
    setDate1(new Date());
    setDate2(new Date());
    setResult(null);
    router.back();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🔮 Star Match</Text>

      <Text style={styles.label}>Your Birthdate</Text>
      <TouchableOpacity
        style={[styles.input, styles.dateInput]}
        onPress={() => setShowDatePicker1(true)}
        accessibilityLabel="Select your birthdate"
        accessibilityRole="button"
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <Text style={styles.dateText}>{date1.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Partner Birthdate</Text>
      <TouchableOpacity
        style={[styles.input, styles.dateInput]}
        onPress={() => setShowDatePicker2(true)}
        accessibilityLabel="Select their birthdate"
        accessibilityRole="button"
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <Text style={styles.dateText}>{date2.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker1 && (
        <DateTimePicker
          value={date1}
          mode="date"
          display="default"
          maximumDate={new Date()} 
          onChange={(event, selectedDate) => {
            setShowDatePicker1(Platform.OS === "ios" ? true : false);
            if (selectedDate && event.type !== "dismissed") {
              setDate1(selectedDate);
            }
          }}
        />
      )}
      {showDatePicker2 && (
        <DateTimePicker
          value={date2}
          mode="date"
          display="default"
          maximumDate={new Date()} 
          onChange={(event, selectedDate) => {
            setShowDatePicker2(Platform.OS === "ios" ? true : false);
            if (selectedDate && event.type !== "dismissed") {
              setDate2(selectedDate);
            }
          }}
        />
      )}

      <TouchableOpacity
        onPress={handleMatch}
        style={styles.button}
        accessibilityLabel="Reveal your zodiac compatibility"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>✨ Reveal Match</Text>
      </TouchableOpacity>

      {!result && (
        <Text style={styles.placeholder}>
          Pick two birthdates to find your star match ✨
        </Text>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultSigns}>
            {result.sign1} + {result.sign2}
          </Text>
          <Text style={styles.resultScore}>{result.score}%</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    color: "#333",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#7E8EFF",
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  placeholder: {
    marginTop: 20,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
  resultContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  resultSigns: {
    fontSize: 20,
  },
  resultScore: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
  },
  resultMessage: {
    fontSize: 16,
    textAlign: "center",
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
