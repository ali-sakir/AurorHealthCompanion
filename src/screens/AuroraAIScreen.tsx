import React, { useState, useRef, useEffect } from "react";
import * as Speech from "expo-speech";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Radius, Shadow } from "../constants/theme";

interface Message { id: string; text: string; sender: "user" | "ai"; }

export default function AuroraAIScreen() {
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! I'm Aurora 🤖\n\nI can help you track water, sleep, nutrition and habits.\n\nTry saying:\n• \"I drank 500ml water\"\n• \"I slept 7 hours\"\n• \"I had 600 calories for breakfast\"\n• \"Add habit yoga\"", sender: "ai" },
  ]);

  useEffect(() => { Speech.speak("Hello. I am Aurora, your health companion."); }, []);

  const speakResponse = (text: string) => Speech.speak(text, { language: "en-US", pitch: 1, rate: 1 });

  const generateResponse = async (text: string): Promise<string> => {
    const lower = text.toLowerCase();
    const calorieMatch = lower.match(/(\d+)/);
    const sleepMatch = lower.match(/(\d+(\.\d+)?)/);
    const waterMatch = lower.match(/(\d+)\s*ml/);

    if (waterMatch && lower.includes("water")) {
      const ml = Number(waterMatch[1]);
      const glasses = Math.round(ml / 250);
      const current = await AsyncStorage.getItem("waterCount");
      const updated = Number(current || 0) + glasses;
      await AsyncStorage.setItem("waterCount", updated.toString());
      return `💧 Added ${ml}ml water (${glasses} glasses) to your hydration tracker.`;
    }

    if (sleepMatch && (lower.includes("sleep") || lower.includes("slept"))) {
      const hours = Number(sleepMatch[1]);
      await AsyncStorage.setItem("sleepHours", hours.toString());
      const historyData = await AsyncStorage.getItem("sleepHistory");
      const history = historyData ? JSON.parse(historyData) : [];
      await AsyncStorage.setItem("sleepHistory", JSON.stringify([...history, hours].slice(-7)));
      return `🌙 Logged ${hours} hours of sleep successfully.`;
    }

    if (calorieMatch && (lower.includes("breakfast") || lower.includes("lunch") || lower.includes("dinner"))) {
      const calories = calorieMatch[1];
      const data = await AsyncStorage.getItem("nutrition");
      const nutrition = data ? JSON.parse(data) : { breakfast: "", lunch: "", dinner: "" };
      if (lower.includes("breakfast")) nutrition.breakfast = (Number(nutrition.breakfast || 0) + Number(calories)).toString();
      if (lower.includes("lunch")) nutrition.lunch = (Number(nutrition.lunch || 0) + Number(calories)).toString();
      if (lower.includes("dinner")) nutrition.dinner = (Number(nutrition.dinner || 0) + Number(calories)).toString();
      await AsyncStorage.setItem("nutrition", JSON.stringify(nutrition));
      return `🍎 Logged ${calories} calories successfully.`;
    }

    const createHabitMatch = lower.match(/add habit (.+)/);
    if (createHabitMatch) {
      const habitName = createHabitMatch[1].trim();
      const savedHabits = await AsyncStorage.getItem("habits");
      const habits = savedHabits ? JSON.parse(savedHabits) : [];
      habits.push({ id: Date.now(), name: habitName, completed: false });
      await AsyncStorage.setItem("habits", JSON.stringify(habits));
      return `📋 Added habit: ${habitName}`;
    }

    const completeHabitMatch = lower.match(/complete habit (.+)/);
    if (completeHabitMatch) {
      const habitName = completeHabitMatch[1].trim().toLowerCase();
      const savedHabits = await AsyncStorage.getItem("habits");
      if (!savedHabits) return "📋 No habits found.";
      const habits = JSON.parse(savedHabits);
      const updated = habits.map((h: any) => h.name.toLowerCase().includes(habitName) ? { ...h, completed: true } : h);
      await AsyncStorage.setItem("habits", JSON.stringify(updated));
      return `✅ Habit completed: ${habitName}`;
    }

    if (lower.includes("health advice") || lower.includes("give me advice") || lower.includes("health report") || lower.includes("health summary")) {
      const [profileData, waterData, sleepData, nutritionData, habitsData] = await Promise.all([
        AsyncStorage.getItem("profile"), AsyncStorage.getItem("waterCount"),
        AsyncStorage.getItem("sleepHours"), AsyncStorage.getItem("nutrition"), AsyncStorage.getItem("habits"),
      ]);
      let name = "User", bmi = "0", waterGoal = 8, sleepGoal = 8, calorieGoal = 2000;
      if (profileData) {
        const p = JSON.parse(profileData);
        name = p.name || "User"; waterGoal = Number(p.waterGoal || 8); sleepGoal = Number(p.sleepGoal || 8); calorieGoal = Number(p.calorieGoal || 2000);
        if (p.height && p.weight) bmi = (Number(p.weight) / Math.pow(Number(p.height) / 100, 2)).toFixed(1);
      }
      const water = Number(waterData || 0), sleep = Number(sleepData || 0);
      let calories = 0;
      if (nutritionData) { const n = JSON.parse(nutritionData); calories = Number(n.breakfast || 0) + Number(n.lunch || 0) + Number(n.dinner || 0); }
      let completedHabits = 0, totalHabits = 0;
      if (habitsData) { const h = JSON.parse(habitsData); totalHabits = h.length; completedHabits = h.filter((h: any) => h.completed).length; }
      const overall = Math.round((Math.min((water/waterGoal)*100,100) + Math.min((sleep/sleepGoal)*100,100) + Math.min((calories/calorieGoal)*100,100) + (totalHabits > 0 ? (completedHabits/totalHabits)*100 : 0)) / 4);
      const rating = overall >= 90 ? "🏆 Excellent" : overall >= 75 ? "💪 Very Good" : overall >= 60 ? "🙂 Good" : overall >= 40 ? "⚠️ Needs Improvement" : "🚨 Poor";
      return `👋 ${name}\n\n${rating} — ${overall}/100\n\n📊 Health Summary\n💧 Water: ${water}/${waterGoal} glasses\n🍎 Calories: ${calories}/${calorieGoal} kcal\n🌙 Sleep: ${sleep}/${sleepGoal} hrs\n📋 Habits: ${completedHabits}/${totalHabits}\n⚖️ BMI: ${bmi}`;
    }

    return "🤖 I'm Aurora. I can help track hydration, sleep, nutrition and habits. Try asking for a health summary!";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
    const aiResponse = await generateResponse(input);
    speakResponse(aiResponse);
    const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponse, sender: "ai" };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  const quickActions = [
    { label: "Water",    icon: "water-outline" as const,      text: "I drank 500ml water" },
    { label: "Sleep",    icon: "moon-outline" as const,       text: "I slept 8 hours" },
    { label: "Calories", icon: "restaurant-outline" as const, text: "I had 500 calories for lunch" },
    { label: "Summary",  icon: "stats-chart-outline" as const, text: "Give me health summary" },
  ];

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.aiBubble]}>
      {item.sender === "ai" && <Text style={styles.aiLabel}>🤖 Aurora</Text>}
      <Text style={item.sender === "user" ? styles.userText : styles.aiText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>

        <LinearGradient colors={Colors.gradientAI} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <Text style={styles.headerTitle}>Aurora AI</Text>
          <Text style={styles.headerSub}>Your Personal Health Companion</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {quickActions.map((q) => (
              <TouchableOpacity key={q.label} style={styles.chip} onPress={() => setInput(q.text)} activeOpacity={0.8}>
                <Ionicons name={q.icon} size={14} color={Colors.accent} style={{ marginRight: 5 }} />
                <Text style={styles.chipText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Aurora..."
              placeholderTextColor={Colors.textMuted}
              style={styles.textInput}
              multiline
            />
            <TouchableOpacity onPress={() => Speech.speak("Hello, I am Aurora. Voice mode is ready.")} style={styles.voiceBtn}>
              <MaterialCommunityIcons name="microphone" size={20} color={Colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendMessage} activeOpacity={0.85}>
              <LinearGradient colors={Colors.gradientAI} style={styles.sendBtn}>
                <Text style={styles.sendIcon}>➤</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 20, paddingBottom: 30, paddingHorizontal: 22, overflow: "hidden" },
  circle1: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.07)", top: -50, right: -30 },
  headerTitle: { color: Colors.textWhite, fontSize: 28, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 },
  content: { flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -16, overflow: "hidden" },
  quickActions: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  chip: { backgroundColor: Colors.accent + "15", borderWidth: 1, borderColor: Colors.accent + "30", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, flexDirection: "row", alignItems: "center" },
  chipText: { fontWeight: "600", color: Colors.accent, fontSize: 13 },
  messageBubble: { maxWidth: "82%", padding: 14, borderRadius: 18, marginBottom: 10 },
  userBubble: { alignSelf: "flex-end", ...Shadow.card },
  aiBubble: { alignSelf: "flex-start", backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, ...Shadow.card },
  aiLabel: { fontSize: 11, color: Colors.accent, fontWeight: "700", marginBottom: 4 },
  userText: { color: Colors.textWhite, fontSize: 15, lineHeight: 21 },
  aiText: { color: Colors.textPrimary, fontSize: 15, lineHeight: 21 },
  inputBar: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  textInput: { flex: 1, backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: Colors.textPrimary, maxHeight: 80 },
  voiceBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.accent + "15", alignItems: "center", justifyContent: "center", marginHorizontal: 8 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  sendIcon: { color: Colors.textWhite, fontSize: 16, fontWeight: "700" },
});
