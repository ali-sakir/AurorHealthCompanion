import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Radius, Shadow } from "../constants/theme";

interface Habit { id: number; name: string; completed: boolean; }

export default function HabitsScreen() {
  const [habitText, setHabitText] = useState("");
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Reading", completed: false },
    { id: 2, name: "Meditation", completed: false },
    { id: 3, name: "Walking", completed: false },
  ]);

  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    loadHabits();
  }, []));
  useEffect(() => { saveHabits(); }, [habits]);

  const saveHabits = async () => { await AsyncStorage.setItem("habits", JSON.stringify(habits)); };
  const loadHabits = async () => {
    const saved = await AsyncStorage.getItem("habits");
    if (saved) setHabits(JSON.parse(saved));
  };

  const addHabit = () => {
    if (!habitText.trim()) return;
    setHabits([...habits, { id: Date.now(), name: habitText, completed: false }]);
    setHabitText("");
  };

  const toggleHabit = (id: number) => setHabits(habits.map((h) => h.id === id ? { ...h, completed: !h.completed } : h));
  const deleteHabit = (id: number) => setHabits(habits.filter((h) => h.id !== id));

  const completed = habits.filter((h) => h.completed).length;
  const progress = habits.length > 0 ? (completed / habits.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <LinearGradient colors={Colors.gradientHabits} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <Ionicons name="checkbox" size={32} color="rgba(255,255,255,0.85)" style={{ marginBottom: 8 }} />
          <Text style={styles.headerTitle}>Habit Tracker</Text>
          <Text style={styles.headerSub}>Build healthy daily routines</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* Progress */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressCount}>{completed}<Text style={styles.progressTotal}>/{habits.length}</Text></Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient colors={Colors.gradientHabits} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* Add Habit */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Add New Habit</Text>
            <TextInput
              placeholder="e.g. Morning run, Read 30 min..."
              placeholderTextColor={Colors.textMuted}
              value={habitText}
              onChangeText={setHabitText}
              style={styles.input}
            />
            <TouchableOpacity onPress={addHabit} activeOpacity={0.85}>
              <LinearGradient colors={Colors.gradientHabits} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.addButton, Shadow.button]}>
                <Text style={styles.addButtonText}>+ Add Habit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Habit List */}
          {habits.map((habit) => (
            <View key={habit.id} style={[styles.habitCard, Shadow.card, habit.completed && styles.habitCardDone]}>
              <TouchableOpacity onPress={() => toggleHabit(habit.id)} style={styles.habitLeft} activeOpacity={0.7}>
                <View style={[styles.checkbox, habit.completed && styles.checkboxDone]}>
                  {habit.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={[styles.habitName, habit.completed && styles.habitNameDone]}>{habit.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteHabit(habit.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 30, paddingBottom: 50, paddingHorizontal: 22, overflow: "hidden" },
  circle1: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.1)", top: -40, right: -40 },
  headerTitle: { color: Colors.textWhite, fontSize: 26, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6 },
  content: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingTop: 24, paddingHorizontal: 18 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
  progressCount: { fontSize: 48, fontWeight: "800", color: Colors.textPrimary },
  progressTotal: { fontSize: 24, color: Colors.textSecondary, fontWeight: "400" },
  progressPercent: { fontSize: 24, fontWeight: "700", color: Colors.gradientHabits[0] },
  progressBg: { height: 14, backgroundColor: Colors.border, borderRadius: 20, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 20 },
  input: { backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary, marginBottom: 14 },
  addButton: { borderRadius: Radius.md, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  addButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: "700" },
  habitCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: 18, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  habitCardDone: { backgroundColor: Colors.success + "0D", borderWidth: 1, borderColor: Colors.success + "33" },
  habitLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: Colors.border, marginRight: 14, alignItems: "center", justifyContent: "center" },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  habitName: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  habitNameDone: { color: Colors.textMuted, textDecorationLine: "line-through" },
  deleteBtn: { padding: 6 },
});
