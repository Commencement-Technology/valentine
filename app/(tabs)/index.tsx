import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";

const HomeScreen = () => {
  const router = useRouter();
  const [isFeedback, SetIsFeedback] = useState(false);
  const [modalvisible, setmodalvisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const telegramBotToken = process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID;
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const [rating, setRating] = useState<number>(0);

  const handlePress = (index: number) => {
    setRating(index + 1);
  };

  const animationSources: Record<string, any> = {
    success: require("@/assets/animation/success.json"),
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("feedback")
        .insert([{ feedback_text: feedback + rating }]);

      if (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
        return;
      }

      const response = await axios.post(telegramUrl, {
        chat_id: telegramChatId,
        text: `New Feedback: Rating ${rating} ${feedback}`,
      });

      if (response.status === 200) {
        setRating(0);
        setFeedback("");
        setmodalvisible(false), SetIsFeedback(false), setFeedback("");
        Toast.show({
          type: "success",
          text1: "Feedback Sent!",
          text2: "Thanks for your thoughts 🙌",
          position: "top",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };
  const HandleModalClose = () => {
    setmodalvisible(false), SetIsFeedback(false), setFeedback("");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Love Experiments</Text>
      <View style={{ gap: 12 }}>
        <LinearGradient
          colors={["#CB8EC1", "#B8A4E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearContainer}
        >
          <TouchableOpacity
            style={styles.LinearGradientcontent}
            onPress={() => router.push("/(tabs)/ResultScreen")}
          >
            <View style={styles.textcontainer}>
              <Text style={[styles.btntitle]}>FLAMES</Text>
              <Text style={[styles.btnsubtitle]}>Love starts here</Text>
            </View>

            <Image
              style={styles.image}
              source={require("../../assets/images/image1.svg")}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#FF9291", "#FFD1BB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearContainer}
        >
          <TouchableOpacity
            style={styles.LinearGradientcontent}
            onPress={() => router.push("/(tabs)/Percentage")}
          >
            <View style={styles.textcontainer}>
              <Text style={[styles.btntitle]}>Love Calc</Text>
              <Text style={[styles.btnsubtitle]}>
                Check the capacity of love
              </Text>
            </View>

            <Image
              style={styles.image}
              source={require("../../assets/images/image2.svg")}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#8CAAF1", "#DAE5FD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearContainer}
        >
          <TouchableOpacity
            style={styles.LinearGradientcontent}
            onPress={() => router.push("/(tabs)/PickupLineScreen")}
          >
            <View style={styles.textcontainer}>
              <Text style={[styles.btntitle]}>love Line</Text>
              <Text style={[styles.btnsubtitle]}>Pick Line for your love</Text>
            </View>

            <Image
              style={styles.image}
              source={require("../../assets/images/image3.svg")}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#8DC19B", "#70B7E9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearContainer}
        >
          <TouchableOpacity
            style={styles.LinearGradientcontent}
            onPress={() => router.push("/(tabs)/LoveAgreementScreen")}
          >
            <View style={styles.textcontainer}>
              <Text style={[styles.btntitle]}>Love Contract</Text>
              <Text style={[styles.btnsubtitle]}>Make Love Agreement</Text>
            </View>

            <Image
              style={styles.image}
              source={require("../../assets/images/image4.svg")}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#E88F99", "#F8C4CC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearContainer}
        >
          <TouchableOpacity
            style={styles.LinearGradientcontent}
            onPress={() => router.push("/(tabs)/DateGenerator")}
          >
            <View style={styles.textcontainer}>
              <Text style={[styles.btntitle]}>Date Ideas</Text>
              <Text style={[styles.btnsubtitle]}>Explore with your love</Text>
            </View>

            <Image
              style={styles.image}
              source={require("../../assets/images/image5.svg")}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#76C9C6", "#BDE0F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearContainer}
        >
          <TouchableOpacity
            style={styles.LinearGradientcontent}
            onPress={() => router.push("/(tabs)/SmileGiver")}
          >
            <View style={styles.textcontainer}>
              <Text style={[styles.btntitle]}>LoveGiggles</Text>
              <Text style={[styles.btnsubtitle]}>Make your lovedOne smile</Text>
            </View>

            <Image
              style={styles.image}
              source={require("../../assets/images/image6.svg")}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.btncontainer}>
        {!isFeedback && (
          <TouchableOpacity
            style={styles.fbbutton}
            onPress={() => SetIsFeedback(true)}
          >
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_fb.svg")}
            />
          </TouchableOpacity>
        )}
        {isFeedback && (
          <TouchableOpacity
            style={styles.fbbutton}
            onPress={() => setmodalvisible(true)}
          >
            <Image
              style={styles.activeicon}
              source={require("../../assets/icons/ic_fb_active.svg")}
            />
          </TouchableOpacity>
        )}
        <Modal
          visible={modalvisible}
          style={styles.modalContainer}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {loading ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <LottieView
                    source={animationSources.success}
                    autoPlay
                    style={{ width: 200, height: 200 }}
                  />
                  <Text style={styles.title}>Sending feedback...</Text>
                </View>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.modaltitle}>Rate your experience</Text>
                    <TouchableOpacity onPress={HandleModalClose}>
                      <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.starsContainer}>
                    {[...Array(5)].map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handlePress(index)}
                      >
                        <Text
                          style={[
                            styles.star,
                            rating > index && styles.filledStar,
                          ]}
                        >
                          {rating > index ? "⭐️" : "☆"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text
                    style={{
                      fontFamily: "K2d-Medium",
                      fontSize: 16,
                      marginBottom: 20,
                    }}
                  >
                    Thanks,Why is the reason for your rating?
                  </Text>

                  <TextInput
                    placeholder="Add your feedback here..."
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                    style={styles.textInput}
                  />
                  <Text
                    style={{
                      fontFamily: "K2d-Medium",
                      fontSize: 16,
                      marginBottom: 10,
                      color: "#818181",
                    }}
                  >
                    We value your feedback
                  </Text>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!feedback.trim()}
                    style={[
                      styles.button,
                      { opacity: feedback.trim() ? 1 : 0.5 },
                    ]}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
    color: "#ccc",
  },
  filledStar: {
    color: "#FFD700",
  },
  feedbackText: {
    marginTop: 10,
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "absolute",
    bottom: 0,
  },
  modaltitle: {
    fontSize: 20,
    fontFamily: "k2dBold",
  },
  title: {
    fontSize: 30,
    fontFamily: "k2dBold",
    marginBottom: 0,
    marginTop: 20,
  },
  linearContainer: {
    justifyContent: "center",
    width: 364,
    height: 100,
    paddingLeft: 16,
    borderRadius: 8,
  },
  LinearGradientcontent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  btntitle: {
    marginTop: 6,
    fontSize: 20,
    color: "#fff",
    fontFamily: "k2dBold",
    lineHeight: 25,
  },
  btnsubtitle: {
    fontSize: 14,
    width: "80%",
    color: "#fff",
    fontFamily: "k2dLight",
    lineHeight: 16,
    flexWrap: "wrap",
  },
  textcontainer: {
    width: 160,
    flexDirection: "column",
  },
  image: {
    width: 172,
    height: 100,
    marginRight: 8,
  },
  btncontainer: {
    alignItems: "center",
    marginTop: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
  activeicon: {
    width: 180,
    height: 51,
  },
  fbbutton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
  },
  textInput: {
    height: 100,
    textAlignVertical: "top",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fafafa",
    fontSize: 16,
    fontFamily: "K2d-Medium",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#17BB84",
    width: 248,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "k2dBold",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});
