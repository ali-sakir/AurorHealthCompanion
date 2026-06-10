import React, { useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function AuroraAIScreen() {
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Aurora. How can I help you today?",
      sender: "ai",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: generateResponse(input),
      sender: "ai",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      aiMessage,
    ]);

    setInput("");
  };

  const generateResponse =  (text: string) => {
    const lower = text.toLowerCase();

    if (
      lower.includes("water") ||
      lower.includes("drink")
    ) {
      return "💧 Great! I've recorded your hydration activity. Keep drinking water regularly.";
    }

    if (
      lower.includes("500ml") &&
      lower.includes("water")
    ) {
      // const current =
      //   await AsyncStorage.getItem("waterCount");

      // const updated =
      //   Number(current || 0) + 2;

      // await AsyncStorage.setItem(
      //   "waterCount",
      //   updated.toString()
      // );
      return "💧 Added 500ml to today's hydration goal.";
    }

    if (
      lower.includes("sleep") ||
      lower.includes("slept")
    ) {
      return "🌙 Sleep log updated successfully. Consistent sleep improves recovery and focus.";
    }

    if (
      lower.includes("nutrition") ||
      lower.includes("food") ||
      lower.includes("calories")
    ) {
      return "🥗 Nutrition entry recorded. Keep balancing your meals.";
    }

    if (
      lower.includes("habit")
    ) {
      return "📋 Habit created successfully. Consistency is key.";
    }

    return "🤖 I'm Aurora. I can help track hydration, sleep, nutrition and habits.";
  };

  const renderItem = ({
    item,
  }: {
    item: Message;
  }) => (
    <View
      style={[
        styles.message,
        item.sender === "user"
          ? styles.userMessage
          : styles.aiMessage,
      ]}
    >
      <Text
        style={
          item.sender === "user"
            ? styles.userText
            : styles.aiText
        }
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={90}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              🤖 Aurora AI
            </Text>

            <Text
              style={styles.subtitle}
            >
              Your Personal Health Companion
            </Text>
          </View>


          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>💧 Water</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>🌙 Sleep</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>🍎 Nutrition</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>📋 Habits</Text>
            </TouchableOpacity>
          </View>



          <FlatList
            style={{ flex: 1 }}
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 15,
              paddingBottom: 20,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd()
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Aurora..."
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.voiceBtn}
            >
              <Text style={styles.icon}>
                🎤
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={sendMessage}
            >
              <Text style={styles.icon}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      "#F3F4F6",
  },

  header: {
    backgroundColor:
      "#8B5CF6",
    padding: 25,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#EDE9FE",
    marginTop: 5,
  },

  message: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: "80%",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor:
      "#2563EB",
  },

  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  userText: {
    color: "#fff",
  },

  aiText: {
    color: "#111",
  },

  inputRow: {
    flexDirection: "row",
    padding: 15,
    backgroundColor:
      "#fff",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor:
      "#E5E7EB",
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  sendBtn: {
    backgroundColor:
      "#8B5CF6",
    marginLeft: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 15,
  },

  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  chip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    fontWeight: "600",
    color: "#4F46E5",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },

  voiceBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 8,
  },

  icon: {
    fontSize: 18,
  },
});