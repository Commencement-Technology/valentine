import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";

const FavouritesScreen = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem("pickupFavorites");
      const parsed = stored ? JSON.parse(stored) : [];
      setFavorites(parsed);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const deleteFavorite = async (itemToDelete: string) => {
    const updated = favorites.filter((item) => item !== itemToDelete);
    setFavorites(updated);
    await AsyncStorage.setItem("pickupFavorites", JSON.stringify(updated));
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedItem(text);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.favoriteItem}>
      <Text style={styles.text}>{item}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => copyToClipboard(item)}
          style={[styles.actionButton, styles.copyBtn]}
        >
          {copiedItem !== item && (
            <>
              <Feather name="copy" size={18} color="#fff" />
              <Text style={styles.actionText}>Copy</Text>
            </>
          )}
          {copiedItem === item && (
            <>
              <Text style={styles.copiedText}>✅ Copied</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteFavorite(item)}
          style={[styles.actionButton, styles.deleteBtn]}
        >
          <Feather name="trash-2" size={18} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noData}>No favourites found.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  noData: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  favoriteItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
  },
  copiedText: {
    color: "#0BFDA6",
    fontSize: 14,
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  copyBtn: {
    backgroundColor: "#7E8EFF",
  },
  deleteBtn: {
    backgroundColor: "#FF7755",
  },
});
