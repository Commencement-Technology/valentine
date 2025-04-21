import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../supabaseClient";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import loadingAnim from "../../assets/animation/loading.json";
import LottieView from "lottie-react-native";

export default function DateGenerator() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mood, setMood] = useState("romantic");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); 
  const router = useRouter();
  const moods = ["romantic", "chaotic", "funny"];
  const fetchIdea = async () => {
    if (!mood) return;

    setLoading(true); // Start loading spinner

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
    <LinearGradient
      colors={["#E9919B", "#F8C4CC"]}
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
 <Image
        style={styles.bottomImage}
        source={require("../../assets/images/dateidea.svg")}
      />


      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <View style={styles.progressContainer}>
          <Image
            style={styles.icon}
            source={require("../../assets/icons/ic_input.svg")}
          />

          <View style={styles.progressBarBackground}>
            <Text
              style={styles.percentageText}
            >{`${date.toLocaleDateString()}`}</Text>
          </View>
        </View>
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
        <TouchableOpacity onPress={fetchIdea}>
                    <LinearGradient
                      colors={["#F16886", "#FFCFBA"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.askButton}
                    >
                      <Text style={styles.ButtonText}>Get your Date</Text>
                    </LinearGradient>
                  </TouchableOpacity>
        
      )}

      {isGenerating && (
        <TouchableOpacity onPress={tryAgain}>
        <LinearGradient
          colors={["#F16886", "#FFCFBA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.askButton}
        >
          <Text style={styles.ButtonText}>Try Again</Text>
        </LinearGradient>
      </TouchableOpacity>
        
      )}
      {loading &&(
        <LottieView
        source={loadingAnim}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
      )}

      {idea !== "" && (
        <View style={styles.ideaContainer}>
          <Text style={styles.ideaText}>{idea}</Text>
        </View>
      )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    justifyContent: "center",
  },
  bottomImage: {
    width: 250,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
    borderRadius:30,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    paddingLeft: 30,
    marginTop: 4,
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: -30, // space between icon and bar
    zIndex: 2,
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
    backgroundColor: "#B59FA4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    margin: 5,
  },
  selectedMood: {
    backgroundColor: "#F16886",
  },
  moodText: {
    fontFamily:'k2dLight',
    fontSize: 14,
    color: "#fff",
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
    marginTop:20,
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
  ideaHeader: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  ideaText: {
    fontSize: 16,
    fontFamily:'k2dMedium',
    textAlign: "center",
    color: "#333",
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
