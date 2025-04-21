import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Dimensions,
  Modal,
} from "react-native";

const { width } = Dimensions.get("window");

const TruthOrDareGame = () => {
  const [numPlayers, setNumPlayers] = useState("");
  const [players, setPlayers] = useState<number[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const [currentAngle, setCurrentAngle] = useState(0);

  const handleStart = () => {
    const num = parseInt(numPlayers);
    if (!isNaN(num) && num > 1) {
      const arr = Array.from({ length: num }, (_, i) => i + 1);
      setPlayers(arr);
      setSelectedPlayer(null);
      setShowPopup(false);
      spinValue.setValue(0);
      setCurrentAngle(0);
    }
  };

  const spinArrow = () => {
    const anglePerPlayer = 360 / players.length;
    const extraSpins = Math.floor(Math.random() * 3) + 4; // 4 to 6 full spins
    const randomFinalAngle = Math.random() * 360;
    const totalAngle = 360 * extraSpins + randomFinalAngle;

    const duration = Math.floor(Math.random() * 2000) + 3000;

    Animated.timing(spinValue, {
      toValue: currentAngle + totalAngle,
      duration,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      const finalAngle = (currentAngle + totalAngle) % 360;

      const playerIndex =
        Math.round(finalAngle / anglePerPlayer) % players.length;

      setCurrentAngle((prev) => prev + totalAngle);
      setSelectedPlayer(players[playerIndex]);
      setShowPopup(true);
    });
  };

  const handleCompleted = () => {
    setShowPopup(false);
    setSelectedPlayer(null);
  };

  const rotateArrow = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const renderPlayers = () => {
    const radius = 120;

    return players.map((num, index) => {
      const angle = (2 * Math.PI * index) / players.length;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      return (
        <View
          key={index}
          style={[
            styles.playerCircle,
            {
              top: y + radius + 30,
              left: x + radius + 30,
              backgroundColor: num === selectedPlayer ? "#FF4E4E" : "#0BFDA6",
            },
          ]}
        >
          <Text style={styles.playerText}>{num}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {players.length === 0 ? (
        <>
          <Text style={styles.title}>Enter number of players:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={numPlayers}
            onChangeText={setNumPlayers}
            placeholder="e.g. 4"
          />
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.circleContainer}>
            {renderPlayers()}
            <Animated.View
              style={[
                styles.arrow,
                {
                  transform: [{ rotate: rotateArrow }],
                },
              ]}
            >
              <View style={styles.arrowTip} />
            </Animated.View>
          </View>
          <TouchableOpacity style={styles.spinButton} onPress={spinArrow}>
            <Text style={styles.buttonText}>Spin</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>
              Player {selectedPlayer}: Truth or Dare?
            </Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={handleCompleted}
            >
              <Text style={styles.popupButtonText}>Completed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TruthOrDareGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFECEC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    borderRadius: 10,
    padding: 12,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#7E8EFF",
    padding: 15,
    borderRadius: 12,
  },
  spinButton: {
    backgroundColor: "#FF7755",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  circleContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 20,
  },
  arrow: {
    width: 10,
    height: 140,
    backgroundColor: "#444",
    position: "absolute",
    top: 10,
    zIndex: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 5,
  },
  arrowTip: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 20,
    borderTopColor: "#0BFDA6",
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    marginTop: -10,
  },
  playerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  playerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
  },
  popupButton: {
    backgroundColor: "#7E8EFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
