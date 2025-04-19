import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../supabaseClient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DateGenerator() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mood, setMood] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // For toggling between Generate and Try Again
  const router = useRouter();
  const moods = ["romantic", "chaotic", "funny"];
  const fetchIdea = async () => {
    if (!mood) return;
  
    setLoading(true); // Start loading spinner
  
    // Get a random offset within the total number of available ideas for the selected mood
    const { count } = await supabase
      .from("date_ideas")
      .select("idea", { count: "exact" })
      .eq("mood", mood);
  
    if (count) {
      const randomOffset = Math.floor(Math.random() * count); // Random offset
  
      const { data, error } = await supabase
        .from("date_ideas")
        .select("idea")
        .eq("mood", mood)
        .range(randomOffset, randomOffset) // Fetch one random idea by using range
        .limit(1);
  
      if (error) {
        console.error("Error fetching idea:", error);
        setIdea("Something went wrong!");
      } else if (data && data.length > 0) {
        setIdea(data[0].idea); // Update with new idea
      } else {
        setIdea("No ideas found for this mood.");
      }
    }
  
    setLoading(false); // End loading spinner
    setIsGenerating(true); // Set generating to true to show Try Again button
  };
  
  const tryAgain = async () => {
    // Reset the current idea and fetch a new one
    setIdea("");
    await fetchIdea(); // Fetch a new idea
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const handleback = () => {
    setDate(new Date());
    setMood("");
    setIdea("");
    setIsGenerating(false);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Perfect Date Generator 📆</Text>

      <TouchableOpacity
        style={[styles.input, styles.dateInput]}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.dateText}>
          {`Selected Date: ${date.toLocaleDateString()}`}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.moodLabel}>Select Mood:</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMood(m)}
            style={[styles.moodButton, mood === m && styles.selectedMood]}
          >
            <Text
              style={[styles.moodText, mood === m && styles.selectedMoodText]}
            >
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {!isGenerating && (
        <TouchableOpacity
          onPress={fetchIdea}
          style={[
            styles.generateButton,
            (!date || !mood) && styles.disabledButton, // Disable button if no date or mood is selected
          ]}
          disabled={!date || !mood || loading} // Disable the button if either date or mood isn't selected or if loading
        >
          <Text style={styles.generateButtonText}>
            {loading ? "Loading..." : "Generate Date Idea"}
          </Text>
        </TouchableOpacity>
      )}

      {isGenerating && (
        <TouchableOpacity onPress={tryAgain} style={styles.tryAgainButton}>
          <Text style={styles.tryAgainText}>Try Again</Text>
        </TouchableOpacity>
      )}

      {idea !== "" && (
        <View style={styles.ideaContainer}>
          <Text style={styles.ideaHeader}>Idea:</Text>
          <Text style={styles.ideaText}>{idea}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    justifyContent: "center",
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  moodButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    margin: 5,
  },
  selectedMood: {
    backgroundColor: "#4C8BF5",
  },
  moodText: {
    fontSize: 14,
    color: "#333",
  },
  selectedMoodText: {
    color: "#fff",
  },
  generateButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0", // Disabled button color
  },
  generateButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  tryAgainButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  tryAgainText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  ideaContainer: {
    backgroundColor: "#FFEB3B",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  ideaHeader: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  ideaText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
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
