import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, Radius, Shadow } from "../constants/theme";

const GOAL = 2000;

export default function NutritionScreen() {
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");

  useFocusEffect(useCallback(() => { loadNutrition(); }, []));
  useEffect(() => { saveNutrition(); }, [breakfast, lunch, dinner]);

  const saveNutrition = async () => {
    await AsyncStorage.setItem("nutrition", JSON.stringify({ breakfast, lunch, dinner }));
  };

  const loadNutrition = async () => {
    const data = await AsyncStorage.getItem("nutrition");
    if (data) {
      const p = JSON.parse(data);
      setBreakfast(p.breakfast || ""); setLunch(p.lunch || ""); setDinner(p.dinner || "");
    }
  };

  const total = Number(breakfast || 0) + Number(lunch || 0) + Number(dinner || 0);
  const progress = Math.min((total / GOAL) * 100, 100);
  const remaining = Math.max(GOAL - total, 0);

  const getMessage = () => {
    if (progress < 30) return { text: "Need more nutrition", color: Colors.danger };
    if (progress < 80) return { text: "Great Progress!", color: Colors.warning };
    if (progress <= 100) return { text: "Goal Achieved!", color: Colors.success };
    return { text: "Above Daily Goal", color: Colors.danger };
  };

  const msg = getMessage();

  const meals = [
    { label: "Breakfast", icon: "sunny-outline" as const, value: breakfast, setter: setBreakfast },
    { label: "Lunch",     icon: "partly-sunny-outline" as const, value: lunch,      setter: setLunch },
    { label: "Dinner",   icon: "moon-outline" as const,          value: dinner,     setter: setDinner },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <LinearGradient colors={Colors.gradientNutrition} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <Ionicons name="restaurant" size={32} color="rgba(255,255,255,0.85)" style={{ marginBottom: 8 }} />
          <Text style={styles.headerTitle}>Nutrition Tracker</Text>
          <Text style={styles.headerSub}>Monitor your daily calorie intake</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* Meal Inputs */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Log Meals</Text>
            {meals.map((meal) => (
              <View key={meal.label} style={styles.mealRow}>
                <View style={styles.mealLabelRow}>
                  <View style={styles.mealIconBg}>
                    <Ionicons name={meal.icon} size={18} color={Colors.gradientNutrition[0]} />
                  </View>
                  <Text style={styles.mealLabel}>{meal.label}</Text>
                </View>
                <TextInput
                  style={styles.mealInput}
                  placeholder="0 kcal"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={meal.value}
                  onChangeText={meal.setter}
                />
              </View>
            ))}
          </View>

          {/* Progress Card */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Calories</Text>
                <Text style={styles.totalValue}>{total} <Text style={styles.totalGoal}>/ {GOAL} kcal</Text></Text>
              </View>
              <View style={[styles.remainingPill, { backgroundColor: Colors.success + "22" }]}>
                <Text style={[styles.remainingText, { color: Colors.success }]}>{remaining} left</Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient colors={Colors.gradientNutrition} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            <View style={styles.messageRow}>
              <Ionicons
                name={progress >= 100 ? "checkmark-circle" : progress >= 80 ? "trending-up" : "nutrition"}
                size={18} color={msg.color} style={{ marginRight: 6 }}
              />
              <Text style={[styles.message, { color: msg.color }]}>{msg.text}</Text>
            </View>
          </View>

          {/* Summary */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Meal Summary</Text>
            {meals.map((meal) => (
              <View key={meal.label} style={styles.summaryRow}>
                <View style={styles.mealLabelRow}>
                  <Ionicons name={meal.icon} size={16} color={Colors.textSecondary} style={{ marginRight: 8 }} />
                  <Text style={styles.summaryLabel}>{meal.label}</Text>
                </View>
                <Text style={styles.summaryValue}>{meal.value || 0} kcal</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={() => { setBreakfast(""); setLunch(""); setDinner(""); }} activeOpacity={0.85}>
            <Ionicons name="refresh" size={18} color={Colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.resetText}>Reset Nutrition</Text>
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
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  mealRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  mealLabelRow: { flexDirection: "row", alignItems: "center" },
  mealIconBg: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.gradientNutrition[0] + "18", alignItems: "center", justifyContent: "center", marginRight: 10 },
  mealLabel: { fontSize: 15, fontWeight: "600", color: Colors.textPrimary },
  mealInput: { backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: Colors.textPrimary, width: 120, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  totalLabel: { color: Colors.textSecondary, fontSize: 13 },
  totalValue: { fontSize: 36, fontWeight: "800", color: Colors.textPrimary },
  totalGoal: { fontSize: 18, color: Colors.textSecondary, fontWeight: "400" },
  remainingPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  remainingText: { fontWeight: "700", fontSize: 14 },
  progressBg: { height: 14, backgroundColor: Colors.border, borderRadius: 20, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 20 },
  progressPercent: { textAlign: "center", fontWeight: "700", fontSize: 16, marginTop: 8, color: Colors.textPrimary },
  messageRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8 },
  message: { fontSize: 16, fontWeight: "700" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  summaryLabel: { fontSize: 15, color: Colors.textSecondary },
  summaryValue: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary },
  resetButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", borderWidth: 1.5, borderColor: Colors.danger, backgroundColor: Colors.danger + "11", flexDirection: "row", justifyContent: "center" },
  resetText: { color: Colors.danger, fontSize: 16, fontWeight: "700" },
});
