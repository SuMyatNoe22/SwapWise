import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter, Slot, useSegments } from "expo-router";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  // Function to determine the active tab for styling
  const isActive = (route) => segments.includes(route);

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={isActive("home") ? "#1E1E84" : "#888"}
          />
          <Text style={[styles.tabText, isActive("home") && styles.activeTab]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/tabs/calendar")}
        >
          <Entypo
            name="calendar"
            size={24}
            color={isActive("calendar") ? "#1E1E84" : "#888"}
          />
          <Text
            style={[styles.tabText, isActive("calendar") && styles.activeTab]}
          >
            Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/(tabs)/chat")}
        >
          <FontAwesome
            name="comments-o"
            size={24}
            color={isActive("chat") ? "#1E1E84" : "#888"}
          />
          <Text style={[styles.tabText, isActive("chat") && styles.activeTab]}>
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/tabs/profile")}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={isActive("profile") ? "#1E1E84" : "#888"}
          />
          <Text
            style={[styles.tabText, isActive("profile") && styles.activeTab]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  activeTab: {
    color: "#1E1E84",
    fontWeight: "bold",
  },
});
