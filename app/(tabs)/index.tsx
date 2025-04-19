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
import { Ionicons, FontAwesome5, MaterialIcons, Entypo, Fontisto, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const buttonSize = (width - 60) / 2; // Two columns with 20px margin

const HomeScreen = () => {
  const router = useRouter();
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Dashboard</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        
        <View style={styles.grid}>
          <DashboardButton
            icon={<FontAwesome5 name="heart" size={30} color="#fff" />}
            label="Love Match"
            onPress={() => router.push("/(tabs)/ResultScreen")}
            />
          <DashboardButton
            icon={<Ionicons name="stats-chart" size={30} color="#fff" />}
            label="Love %"
            onPress={() => router.push("/(tabs)/Percentage")}
          />
          <DashboardButton
            icon={<MaterialIcons name="emoji-emotions" size={30} color="#fff" />}
            label="Pickup Line"
            onPress={() => router.push("/(tabs)/PickupLineScreen")}
          />
          
          {/* <DashboardButton
            icon={<MaterialCommunityIcons name="zodiac-cancer" size={30} color="#fff" />}
            label=" Zodiac Love Match"
            onPress={() => router.push("/(tabs)/StarMatchScreen")}
          />
          <DashboardButton
            icon={<FontAwesome5 name="user-clock" size={30} color="#fff" />}
            label="Age Guesser"
            onPress={() => router.push("/(tabs)/AgePredictionScreen")}
          />
          <DashboardButton
            icon={<Entypo name="cycle" size={30} color="#fff" />}
            label="Coin Toss"
            onPress={() => router.push("/(tabs)/CoinTossScreen")}
          />
          <DashboardButton
            icon={<Entypo name="cycle" size={30} color="#fff" />}
            label="Truth or Dare"
            onPress={() => router.push("/(tabs)/TruthOrDare")}
          /> */}
           <DashboardButton
            icon={<FontAwesome5 name="file-contract"  size={30} color="#fff" /> }
            label="Love Agreement"
            onPress={() => router.push("/(tabs)/LoveAgreementScreen")}
          />
          <DashboardButton
            icon={<Fontisto name="date" size={30} color="#fff" /> }
            label="Date Generator"
            onPress={() => router.push("/(tabs)/DateGenerator")}
          />
          <DashboardButton
            icon={<FontAwesome6 name="face-smile-wink" size={30} color="#fff" /> }
            label="Smile Giver"
            onPress={() => router.push("/(tabs)/SmileGiver")}
          />
        </View>
        
      </ScrollView><View style={styles.btncontainer}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/FeedbackScreen")}>
      <MaterialIcons name="feedback" size={24} color="#fff" />
        <Text style={styles.text}>Feedback</Text>
      </TouchableOpacity>
    </View>
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
  btncontainer: {
    alignItems: 'center',
    marginTop: 20
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10
  },
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
    marginTop:20
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
