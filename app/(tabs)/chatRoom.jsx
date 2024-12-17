import React, { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";

export default function ChatRoom() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId: routeUserId, userName: routeUserName } = route.params || {};
  const [userId, setUserId] = useState(routeUserId);
  const [userName, setUserName] = useState(routeUserName);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const currentUserId = auth.currentUser?.uid;

  // Generate chat ID
  const chatId = [currentUserId, userId].sort().join('_');

  useEffect(() => {
    if (!routeUserId || !routeUserName) {
      console.log("route.params is undefined or missing parameters");
    } else {
      setUserId(routeUserId);
      setUserName(routeUserName);
    }
  }, [routeUserId, routeUserName]);

  useEffect(() => {
    if (!userId || !userName) {
      Alert.alert("Error", "Invalid user selected.");
      navigation.goBack(); // Navigate back if invalid
    }
  }, [userId, userName]);

  // Fetch messages and mark them as read
  useEffect(() => {
    if (!userId || !currentUserId) return; // Prevent fetching if userId is missing

    const fetchMessages = async () => {
      try {
        const chatQuery = query(
          collection(db, "messages"),
          where("chatId", "==", chatId),
          orderBy("createdAt", "asc") // Order by ascending to have new messages at the bottom
        );

        const chatSnapshot = await getDocs(chatQuery);
        const fetchedMessages = chatSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the 'read' status for messages sent by the other user
        fetchedMessages.forEach(async (msg) => {
          if (msg.sender !== currentUserId && !msg.read) {
            const msgRef = doc(db, "messages", msg.id);
            await updateDoc(msgRef, { read: true });
            msg.read = true; // Update local state
          }
        });

        setMessages(fetchedMessages);
        console.log("Fetched messages:", fetchedMessages); // Debugging

        // Scroll to the bottom once messages are fetched
        flatListRef.current.scrollToEnd({ animated: true });
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [userId, currentUserId, chatId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        chatId: chatId,
        participants: [currentUserId, userId],
        sender: currentUserId,
        receiver: userId,
        text: newMessage,
        createdAt: Timestamp.fromDate(new Date()),
        read: false, // Mark new message as unread
      });
      setNewMessage(""); // Clear the input

      // Refetch messages after sending a new one
      const fetchMessages = async () => {
        try {
          const chatQuery = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            orderBy("createdAt", "asc") // Order by ascending to have new messages at the bottom
          );

          const chatSnapshot = await getDocs(chatQuery);
          const fetchedMessages = chatSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Update the 'read' status for messages sent by the other user
          fetchedMessages.forEach(async (msg) => {
            if (msg.sender !== currentUserId && !msg.read) {
              const msgRef = doc(db, "messages", msg.id);
              await updateDoc(msgRef, { read: true });
              msg.read = true; // Update local state
            }
          });

          setMessages(fetchedMessages);
          console.log("Fetched messages after sending:", fetchedMessages); // Debugging

          // Scroll to the bottom once messages are fetched
          flatListRef.current.scrollToEnd({ animated: true });
        } catch (error) {
          console.error("Error fetching messages:", error.message);
        }
      };

      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Chat with {userName || "Loading..."}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id} // Ensure each key is unique
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === currentUserId
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <TouchableOpacity
        style={styles.scrollToBottomButton}
        onPress={() => flatListRef.current.scrollToEnd({ animated: true })}
      >
        <Ionicons name="chevron-down" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E1E84",
    marginLeft: 10, // Adjust this value as needed
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "75%",
    flexDirection: "row",
    alignItems: "center",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1E1E84",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e65f17",
  },
  messageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#000000",
  },
  newMessageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "blue",
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1E1E84",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  scrollToBottomButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E1E84',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
