import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Radius, Shadow } from "../constants/theme";

const DAILY_GOAL = 8;

export default function HydrationScreen() {
  const [glasses, setGlasses] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    loadData();
  }, []));

  const loadData = async () => {
    const saved = await AsyncStorage.getItem("waterCount");
    if (saved) setGlasses(Number(saved));
  };

  const addGlass = async () => {
    const updated = glasses + 1;
    setGlasses(updated);
    await AsyncStorage.setItem("waterCount", updated.toString());
  };

  const resetData = async () => {
    setGlasses(0);
    await AsyncStorage.removeItem("waterCount");
  };

  const progress = Math.min((glasses / DAILY_GOAL) * 100, 100);

  const getMessage = () => {
    if (glasses >= 8) return { text: "Goal Achieved! 🎉", color: Colors.success };
    if (glasses >= 5) return { text: "Great Progress! 🔥", color: Colors.primary };
    if (glasses >= 3) return { text: "Keep Going! 💪", color: Colors.secondary };
    return { text: "Let's Start! 🚀", color: Colors.textSecondary };
  };

  const msg = getMessage();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <LinearGradient colors={Colors.gradientWater} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <Text style={styles.headerTitle}>Hydration Tracker</Text>
          <Text style={styles.headerSub}>Stay hydrated and hit your daily goal</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* Progress Card */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.goalText}>Daily Goal: {DAILY_GOAL} Glasses</Text>
            <Ionicons name="water" size={52} color={Colors.gradientWater[0]} style={{ textAlign: "center", alignSelf: "center", marginVertical: 4 }} />
            <Text style={styles.countValue}>{glasses} <Text style={styles.countDivider}>/ {DAILY_GOAL}</Text></Text>
            <Text style={styles.countLabel}>Glasses Consumed</Text>

            <View style={styles.progressBg}>
              <LinearGradient colors={Colors.gradientWater} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
              <Text style={styles.remaining}><Ionicons name="water" size={14} /> {Math.max(DAILY_GOAL - glasses, 0)} remaining</Text>
            </View>
          </View>

          {/* Glass Indicators */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionLabel}>Progress</Text>
            <View style={styles.glassRow}>
              {[...Array(DAILY_GOAL)].map((_, i) => (
              <View key={i} style={[styles.glassDot, i < glasses && styles.glassDotFilled]}>
                <Ionicons name="water" size={18} color={i < glasses ? "#fff" : Colors.border} />
              </View>
            ))}
            </View>
            <Text style={[styles.message, { color: msg.color }]}>{msg.text}</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity onPress={addGlass} activeOpacity={0.85}>
            <LinearGradient colors={Colors.gradientWater} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.primaryButton, Shadow.button]}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Add Glass of Water</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetData} activeOpacity={0.85}>
            <Ionicons name="refresh" size={18} color={Colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.resetText}>Reset Progress</Text>
          </TouchableOpacity>

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
  goalText: { color: Colors.textSecondary, fontSize: 14, textAlign: "center" },
  countValue: { fontSize: 56, fontWeight: "800", color: Colors.gradientWater[0], textAlign: "center", marginTop: 6 },
  countDivider: { fontSize: 28, color: Colors.textSecondary, fontWeight: "400" },
  countLabel: { color: Colors.textMuted, textAlign: "center", marginBottom: 16 },
  progressBg: { height: 14, backgroundColor: Colors.border, borderRadius: 20, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 20 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  progressText: { fontWeight: "700", color: Colors.textPrimary, fontSize: 15 },
  remaining: { color: Colors.gradientWater[0], fontWeight: "600", fontSize: 15 },
  sectionLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 12, fontWeight: "600" },
  glassRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 12, gap: 8 },
  glassDot: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.border, alignItems: "center", justifyContent: "center" },
  glassDotFilled: { backgroundColor: Colors.gradientWater[0] },
  message: { textAlign: "center", fontSize: 18, fontWeight: "700" },
  primaryButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", marginBottom: 12, flexDirection: "row", justifyContent: "center" },
  primaryButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: "700" },
  resetButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", marginBottom: 32, borderWidth: 1.5, borderColor: Colors.danger, backgroundColor: Colors.danger + "11", flexDirection: "row", justifyContent: "center" },
  resetText: { color: Colors.danger, fontSize: 16, fontWeight: "700" },
});
