//import React, { useState } from 'react';
//import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
//import { initializeApp } from 'firebase/app';
//import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
//import { useNavigation } from '@react-navigation/native';
//
//const firebaseConfig = {
//  apiKey: "AIzaSyB1YTiUD1iS7sdplz0KiiGAaQ62miE3bHM",
//  authDomain: "swapwise-authentication.firebaseapp.com",
//  projectId: "swapwise-authentication",
//  storageBucket: "swapwise-authentication.firebasestorage.app",
//  messagingSenderId: "620289279679",
//  appId: "1:620289279679:android:83bb9591cee33647ba680a",
//};
//
//
//const app = initializeApp(firebaseConfig);
//
//export default function LoginPage() {
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const navigation = useNavigation();
//
//  const handleLogin = async () => {
//    const auth = getAuth(app);
//    try {
//      const userCredential = await signInWithEmailAndPassword(auth, email, password);
//      const user = userCredential.user;
//
//      console.log('User logged in successfully!');
//
//      // For simplicity, use the email as a fallback if the name isn't available
//      navigation.navigate('Welcome', { name: email });
//    } catch (error) {
//      console.error('Login error:', error.message);
//    }
//  };
//
//
//  return (
//    <View style={styles.container}>
//      <Text style={styles.title}>Log In</Text>
//      <TextInput
//        style={styles.input}
//        value={email}
//        onChangeText={setEmail}
//        placeholder="Email"
//        autoCapitalize="none"
//      />
//      <TextInput
//        style={styles.input}
//        value={password}
//        onChangeText={setPassword}
//        placeholder="Password"
//        secureTextEntry
//      />
//      <Button title="Log In" onPress={handleLogin} color="#3498db" />
//      <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
//        <Text style={styles.linkText}>Need an account? Sign Up</Text>
//      </TouchableOpacity>
//    </View>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    padding: 16,
//    backgroundColor: '#f0f0f0',
//  },
//  title: {
//    fontSize: 24,
//    marginBottom: 16,
//    textAlign: 'center',
//  },
//  input: {
//    height: 40,
//    borderColor: '#ddd',
//    borderWidth: 1,
//    marginBottom: 16,
//    padding: 8,
//    borderRadius: 4,
//    width: '80%',
//  },
//  linkText: {
//    marginTop: 16,
//    color: '#3498db',
//    textAlign: 'center',
//    textDecorationLine: 'underline',
//  },
//});