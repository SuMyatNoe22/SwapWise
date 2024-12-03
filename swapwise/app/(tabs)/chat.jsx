import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebaseConfig"; // Firebase config file

export default function Chat() {
  const [users, setUsers] = useState([]); // State for storing users
  const auth = getAuth(app); // Firebase Auth instance
  const db = getFirestore(app); // Firestore instance
  const currentUserId = auth.currentUser?.uid; // Get the current user's ID

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users"); // Reference the "users" collection
        const usersSnapshot = await getDocs(usersCollection); // Fetch all documents
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Exclude the current user from the list
        const filteredUsers = usersList.filter((user) => user.id !== currentUserId);
        setUsers(filteredUsers); // Update state with filtered users
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleChatStart = (user) => {
    console.log(`Start chat with ${user.name}`); // Placeholder action
    // Navigate to ChatRoom or implement chat functionality
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Users</Text>
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleChatStart(item)}
            >
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E84",
    marginBottom: 20,
    textAlign: "center",
  },
  noUsersText: {
    fontSize: 16,
    color: "#8A8A8A",
    textAlign: "center",
  },
  userCard: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
});
