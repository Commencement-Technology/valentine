import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const buttonSize = (width - 60) / 2; // Two columns with 20px margin

const HomeScreen = () => {
  const router = useRouter();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setName1("");
      setName2("");
    }, [])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Dashboard</Text>
        
        <View style={styles.grid}>
          <DashboardButton
            icon={<FontAwesome5 name="heart" size={30} color="#fff" />}
            label="Love Match"
            onPress={() =>
              router.push({ pathname: "/(tabs)/ResultScreen", params: { name1, name2 } })
            }
          />
          <DashboardButton
            icon={<Ionicons name="stats-chart" size={30} color="#fff" />}
            label="Love %"
            onPress={() =>
              router.push({ pathname: "/(tabs)/Percentage", params: { name1, name2 } })
            }
          />
          <DashboardButton
            icon={<MaterialIcons name="emoji-emotions" size={30} color="#fff" />}
            label="Pickup Line"
            onPress={() => router.push("/(tabs)/PickupLineScreen")}
          />
          <DashboardButton
            icon={<FontAwesome5 name="user-clock" size={30} color="#fff" />}
            label="Age Guesser"
            onPress={() => router.push("/(tabs)/AgePredictionScreen")}
          />
          {/* <DashboardButton
            icon={<Entypo name="cycle" size={30} color="#fff" />}
            label="Coin Toss"
            onPress={() => router.push("/(tabs)/CoinTossScreen")}
          />
          <DashboardButton
            icon={<Entypo name="cycle" size={30} color="#fff" />}
            label="Truth or Dare"
            onPress={() => router.push("/(tabs)/TruthOrDare")}
          /> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const DashboardButton = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.squareButton} onPress={onPress}>
    {icon}
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding:20
  },
  scroll: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  squareButton: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: "#7E8EFF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
