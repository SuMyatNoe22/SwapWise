import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebaseConfig"; // Import your Firebase config

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Optional field
  const router = useRouter();
  const auth = getAuth(app);

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.push("/(tabs)/home"); // Navigate to the home screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>SwapWise</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#8A8A8A"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8A8A8A"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8A8A8A"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/(auth)/signIn")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E84",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#000000",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E1E84",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  footerText: {
    color: "#8A8A8A",
    marginTop: 20,
    fontSize: 14,
  },
  footerLink: {
    color: "#1E1E84",
    fontWeight: "bold",
  },
});