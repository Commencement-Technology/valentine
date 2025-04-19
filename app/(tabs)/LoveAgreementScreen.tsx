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
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import loadingAnim from "../../assets/animation/loading.json";
import { useRouter } from "expo-router";

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
  const nameRegex = /^[A-Za-z]{3,15}$/;
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
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleback}>
        <Text style={styles.backButtonText}>🔙 Back</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { marginTop: 35 }]}>💖 Love Contract 💖</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your Name </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={nameOne}
          onChangeText={(text) => {
            setNameOne(text);
            if (name1Error) setName1Error(""); // clear error while typing
          }}
        />
        {name1Error ? <Text style={styles.errorText}>{name1Error}</Text> : null}
        <Text style={styles.label}>Crush Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter crush's name"
          value={nameTwo}
          onChangeText={(text) => {
            setNameTwo(text);
            if (name2Error) setName2Error(""); // clear error while typing
          }}
        />
        {name2Error ? <Text style={styles.errorText}>{name2Error}</Text> : null}

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#333" }}>{date}</Text>
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
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
          >
            <Text style={styles.generateButtonText}>⚙️ Make Contract</Text>
          </TouchableOpacity>
        )}
      </View>
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
              <Text style={styles.previewLabel}>📄 Preview:</Text>
              <View style={styles.webviewContainer}>
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: generateHtmlContent() }}
                />
              </View>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={printToFile}>
            <Text style={styles.buttonText}>
              💌 Share This with Your Love 💖
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    minHeight: "100%",
    paddingHorizontal: 24,
    backgroundColor: "#ffeaf1",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d63384",
    marginBottom: 20,
    textAlign: "center",
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
  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    fontSize: 16,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  switchLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#444",
  },
  button: {
    backgroundColor: "#ff66a3",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  previewLabel: {
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    color: "#222",
  },
  webviewContainer: {
    height: 389,
    width: "98%",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    overflow: "hidden",
  },
  generateButton: {
    backgroundColor: "#ffd6e8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ff66a3",
  },
  generateButtonText: {
    color: "#d63384",
    fontWeight: "600",
    fontSize: 16,
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
