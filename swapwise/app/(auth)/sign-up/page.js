//import React, { useState } from 'react';
//import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
//import { initializeApp } from 'firebase/app';
//import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
//import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore
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
//const db = getFirestore(app); // Initialize Firestore
//
//export default function SignUpPage() {
//  const [name, setName] = useState('');
//  const [username, setUsername] = useState('');
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const navigation = useNavigation();
//
//  const handleSignUp = async () => {
//    const auth = getAuth(app);
//    try {
//      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//      const user = userCredential.user;
//
//      // Save additional user details to Firestore
//      await setDoc(doc(db, "users", user.uid), {
//        name: name,
//        username: username,
//        email: email,
//      });
//
//      console.log('User signed up and details saved successfully!');
//
//      // Navigate to the WelcomePage with the user's name
//      navigation.navigate('Welcome', { name });
//    } catch (error) {
//      console.error('Sign-up error:', error.message);
//    }
//  };
//
//
//  return (
//    <View style={styles.container}>
//      <Text style={styles.title}>Sign Up</Text>
//      <TextInput
//        style={styles.input}
//        value={name}
//        onChangeText={setName}
//        placeholder="Name"
//        autoCapitalize="words"
//      />
//      <TextInput
//        style={styles.input}
//        value={username}
//        onChangeText={setUsername}
//        placeholder="Username"
//        autoCapitalize="none"
//      />
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
//      <Button title="Sign Up" onPress={handleSignUp} color="#3498db" />
//      <TouchableOpacity onPress={() => navigation.navigate('Log In')}>
//        <Text style={styles.linkText}>Already have an account? Log In</Text>
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