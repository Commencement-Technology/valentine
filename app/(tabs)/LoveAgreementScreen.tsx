import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import loadingAnim from "../../assets/animation/loading.json";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

export default function App() {
  const [nameOne, setNameOne] = useState("");
  const [nameTwo, setNameTwo] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [funnyMode, setFunnyMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [name1Error, setName1Error] = useState("");
  const [name2Error, setName2Error] = useState("");
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  const router = useRouter();
  const romanticVow = `
   💖 I promise to always be honest, loyal, and loving to you.<br />
   💖 I’ll be your light in hard times,your support when life gets tough.<br />
   💖 I’ll respect you, love you, and stay by your side through every time we take together.<br />
   💖 I’ll dream with you and work with you to make our dreams come true.<br />
   💖 If you ever fall, I’ll help you up, and I’ll keep falling in love with you every day.<br />
   💖 I’ll love you with all my heart, more than words can ever say.<br />
   💖 I’ll be here for you, always and forever.<br />
   💖 I agree to keep this promise for the rest of my life. ❤️<br />
   💖 I’ll never give up on us, no matter what.<br />
   💖 And I’ll always choose you, even when you're being silly. 💑<br />
  `;

  const funnyVow = `
    💞 I promise to always share my food, even when I said I wouldn’t.<br />
    💞 I vow to laugh at your jokes… even the not-so-funny ones.😅<br />
    💞 I promise to pretend to listen when you're talking about stuff I don’t understand.<br />
    💞 I’ll be your human diary, snack buddy, and emergency contact forever.<br />
    💞 I vow to never watch the next episode without you.<br />
    💞 I promise to love you even when you're angry.<br />
    💞 I’ll always choose you, even when you're more Annoyed me.<br />
    💞 I vow to support your dreams... unless it’s buying a pet dinosaur.<br />
    💞 I promise to love you more than fav (but only just a little). ❤️<br />
    💞 And I promise to let you have the last bite… most of the time. 😄🍰<br />
  `;

  const generateHtmlContent = () => {
    return `
          <html>
          <head>
           <meta charset="UTF-8" />
          <style>
           .signature-section p {
            width: 45%;
            text-align: center;
            border-top: 1px solid #888;
            padding-top: 10px;
        }
          </style>
          </head>
      <body style="padding-left: 50px; padding-right: 50px; ;padding-top: 50px;font-family: 'times'; background-image: url('https://png.pngtree.com/thumb_back/fh260/background/20230110/pngtree-valentines-day-pink-love-background-letter-paper-border-text-qixi-festival-image_1506456.jpg'); background-size: contain; background-repeat: no-repeat;">
      <img src="https://ikfbiqfjtmwhxacydeuj.supabase.co/storage/v1/object/public/cupid-lab-assets//stamp.png"  style="width: 100%; height: 250; margin: 0 auto; display: block;" />
        <h2 style="text-align: center;">💖 Love Agreement 💖</h2>
        <p style="text-align:center;font-size: 16rpx; ">This agreement is signed between <b>${
          nameOne || "____"
        }</b> and <b>${nameTwo || "____"}</b> on <b>${date}</b>.</p>

        <p style="text-align:center;font-size: 16px; ">The above two persons have decided to be together for the rest of their lives and vow to live together bound by the conditions of love and happiness. </p>

       <h4 style="text-align:center;font-size: 16px; ">Now, I hereby agree to the following:</h4>
          <p style="text-align:left; line-height: 1.8;font-size: 14px;">${
            funnyMode ? funnyVow : romanticVow
          }</p>

        <br /><br />
<div style="display: flex; justify-content: center; align-items: center; text-align: center;">

            <div>
            <p>_________________</p>
            <p>Signature: ${nameOne || "____"}</p>
           </div>
             <img src="https://ikfbiqfjtmwhxacydeuj.supabase.co/storage/v1/object/public/cupid-lab-assets//loveseal.png"  style="width: 150; height: 150; margin: 0 auto; display: block;" />
            <div>
            <p>_________________</p>
            <p>Signature: ${nameTwo || "____"}</p>
           </div>
           
        </div>
      </body>
    </html>
  `;
  };

  const printToFile = async () => {
    if (!nameOne || !nameTwo) {
      Alert.alert(
        "Missing Info",
        "Please enter both names before sharing the PDF!"
      );
      return;
    }

    const { uri } = await Print.printToFileAsync({
      html: generateHtmlContent(),
    });

    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };
  const handleback = () => {
    setNameOne("");
    setNameTwo("");
    setName1Error("");
    setName2Error("");
    router.back();
  };
  const handleGenerate = () => {
    let valid = true;

    if (!nameRegex.test(nameOne)) {
      setName1Error("Plaese give valid name.");
      valid = false;
    } else {
      setName1Error("");
    }

    if (!nameRegex.test(nameTwo)) {
      setName2Error("Plaese give valid name.");
      valid = false;
    } else {
      setName2Error("");
    }

    if (!valid) return;
    setIsGenerating(true);
    setShowPreview(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };
  return (
    <LinearGradient
      colors={["#8CC19E", "#71B8E8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={{ width: "100%", backgroundColor: "8CC19E" }}>
        <TouchableOpacity style={styles.backButton} onPress={handleback}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="arrowleft" size={24} color="white" />
            <Text style={styles.backButtonText}>Love Contract</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ width: "100%" ,minHeight:'80%'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          flexGrow: 1,
          paddingBottom: 50,
        }}
      >
        <Image
          style={styles.bottomImage}
          source={require("../../assets/images/lovecontract.svg")}
        />
        <View style={styles.progressInputContainer}>
          <Image
            style={styles.icon}
            source={require("../../assets/icons/ic_input.svg")}
          />

          <View style={styles.progressBarInputBackground}>
            <TextInput
              style={styles.progressInput}
              placeholder="your name"
              placeholderTextColor="#999"
              value={nameOne}
              onChangeText={(text) => {
                setNameOne(text);
                if (name1Error) setName1Error(""); // clear error while typing
              }}
            />
          </View>
        </View>

        {name1Error ? <Text style={styles.errorText}>{name1Error}</Text> : null}

        <View style={styles.progressInputContainer}>
          <Image
            style={styles.icon}
            source={require("../../assets/icons/ic_input.svg")}
          />

          <View style={styles.progressBarInputBackground}>
            <TextInput
              style={styles.progressInput}
              placeholder="Your Crush Name"
              placeholderTextColor="#999"
              value={nameTwo}
              onChangeText={(text) => {
                setNameTwo(text);
                if (name2Error) setName2Error(""); // clear error while typing
              }}
            />
          </View>
        </View>

        {name2Error ? <Text style={styles.errorText}>{name2Error}</Text> : null}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={styles.progressContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/ic_input.svg")}
            />

            <View style={styles.progressBarBackground}>
              <Text style={styles.percentageText}>{`${date}`}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            // minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate.toLocaleDateString());
              }
            }}
          />
        )}

        <View style={styles.switchRow}>
          <Switch value={funnyMode} onValueChange={setFunnyMode} />
          <Text style={styles.switchLabel}>Funny Mode?</Text>
        </View>
        {nameOne && nameTwo && (
          <TouchableOpacity onPress={handleGenerate}>
            <LinearGradient
              colors={["#F16886", "#FFCFBA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.askButton}
            >
              <Text style={styles.ButtonText}>Make Contract</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {isGenerating && (
          <>
            <LottieView
              source={loadingAnim}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.generateButtonText}>
              Contract was written....
            </Text>
          </>
        )}
        {nameOne && nameTwo && !isGenerating && showPreview && (
          <View style={[styles.card, { marginTop: 20 }]}>
            {showPreview && (
              <>
                <View style={styles.webviewContainer}>
                  <WebView
                    originWhitelist={["*"]}
                    source={{ html: generateHtmlContent() }}
                  />
                </View>
              </>
            )}

            <TouchableOpacity onPress={printToFile}>
              <LinearGradient
                colors={["#F16886", "#FFCFBA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.askButton,]}
              >
                <Text style={[styles.ButtonText]}>
                  Share This with Your Love 
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bottomImage: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 45,
    borderRadius: 30,
  },
  progressInput: {
    width: "100%",
    height: "100%",
    color: "#000",
    paddingLeft: 30,
    fontSize: 16,
    fontWeight: "600",
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    paddingLeft: 30,
    marginTop: 4,
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
  askButton: {
    width: 300,
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
  },
  progressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 16,
    width: "100%",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: -30, // space between icon and bar
    zIndex: 2,
  },
  progressBarInputBackground: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#F16886",
  },
  errorText: {
    color: "red",
    fontFamily: "k2dLight",
    fontSize: 12,
    lineHeight:12,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "k2dMedium",
    color: "#444",
  },


  webviewContainer: {
    height: 389,
    width: "98%",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    overflow: "hidden",
  },
 
  generateButtonText: {
    color: "#d63384",
    fontFamily:'k2dBold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  backButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontFamily: "k2dMedium",
    fontSize: 20,
    textAlign: "center",
  },
});
