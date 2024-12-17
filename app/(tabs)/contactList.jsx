import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getFirestore, collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [latestMessages, setLatestMessages] = useState({});
  const [sortedUsers, setSortedUsers] = useState([]);
  const router = useRouter();
  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter out the current user
      const otherUsers = usersList.filter((user) => user.id !== currentUserId);
      setUsers(otherUsers);

      // Fetch the latest message for each user
      otherUsers.forEach((user) => fetchLatestMessage(user.id));
    };

    const fetchLatestMessage = async (userId) => {
      const db = getFirestore();
      const chatId = [currentUserId, userId].sort().join('_');
      const messagesCollection = collection(db, "messages");
      const q = query(messagesCollection, where("chatId", "==", chatId), orderBy("createdAt", "desc"), limit(1));
      const messagesSnapshot = await getDocs(q);
      const latestMessage = messagesSnapshot.docs[0]?.data();

      setLatestMessages((prev) => ({
        ...prev,
        [userId]: latestMessage,
      }));
    };

    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (users.length === 0 || Object.keys(latestMessages).length === 0) return;

    // Sort users based on the latest message initially
    const sorted = users
      .map((user) => ({
        ...user,
        latestMessage: latestMessages[user.id],
      }))
      .sort((a, b) => {
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return b.latestMessage.createdAt - a.latestMessage.createdAt;
      });

    setSortedUsers(sorted); // Set sorted users immediately
  }, [users, latestMessages]);

  const handleChatStart = (user) => {
    router.push({
      pathname: "/chatRoom",
      params: { userId: user.id, userName: user.name },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts</Text>
      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => handleChatStart(item)}
          >
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.name}</Text>
              {item.latestMessage?.text && (
                <Text style={styles.latestMessage}>
                  {item.latestMessage.sender === currentUserId ? "You: " : ""}
                  {item.latestMessage.text}
                </Text>
              )}
            </View>
            {item.latestMessage?.sender !== currentUserId && !item.latestMessage?.read && (
              <View style={styles.newMessageDot} />
            )}
          </TouchableOpacity>
        )}
      />
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  userDetails: {
    flex: 1,
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
  latestMessage: {
    fontSize: 14,
    color: "#999",
  },
  newMessageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "blue",
  },
});
