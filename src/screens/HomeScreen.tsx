import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, Radius, Shadow } from "../constants/theme";

const logo = require("../../assets/icon.png");

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState("User");
  const [healthScore, setHealthScore] = useState(0);
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const [sleep, setSleep] = useState(0);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [calories, setCalories] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [completedHabits, setCompletedHabits] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  const [recommendation, setRecommendation] = useState("Keep up the great work!");

  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    loadDashboard();
  }, []));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour > 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  const loadDashboard = async () => {
    const profileData = await AsyncStorage.getItem("profile");
    const waterData = await AsyncStorage.getItem("waterCount");
    const sleepData = await AsyncStorage.getItem("sleepHours");
    const nutritionData = await AsyncStorage.getItem("nutrition");
    const habitsData = await AsyncStorage.getItem("habits");

    let localWaterGoal = 8, localSleepGoal = 8, localCalorieGoal = 2000;

    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserName(profile.name || "User");
      localWaterGoal = Number(profile.waterGoal || 8);
      localSleepGoal = Number(profile.sleepGoal || 8);
      localCalorieGoal = Number(profile.calorieGoal || 2000);
      setWaterGoal(localWaterGoal);
      setSleepGoal(localSleepGoal);
      setCalorieGoal(localCalorieGoal);
    }

    const currentWater = Number(waterData || 0);
    const currentSleep = Number(sleepData || 0);
    setWater(currentWater);
    setSleep(currentSleep);

    let totalCalories = 0;
    if (nutritionData) {
      const n = JSON.parse(nutritionData);
      totalCalories = Number(n.breakfast || 0) + Number(n.lunch || 0) + Number(n.dinner || 0);
      setCalories(totalCalories);
    }

    let doneHabits = 0, allHabits = 0;
    if (habitsData) {
      const habits = JSON.parse(habitsData);
      allHabits = habits.length;
      doneHabits = habits.filter((h: any) => h.completed).length;
      setCompletedHabits(doneHabits);
      setTotalHabits(allHabits);
    }

    const overall = Math.round((
      Math.min((currentWater / localWaterGoal) * 100, 100) +
      Math.min((currentSleep / localSleepGoal) * 100, 100) +
      Math.min((totalCalories / localCalorieGoal) * 100, 100) +
      (allHabits > 0 ? (doneHabits / allHabits) * 100 : 0)
    ) / 4);
    setHealthScore(overall);

    if (currentWater < localWaterGoal) setRecommendation(`Drink ${localWaterGoal - currentWater} more glasses of water today.`);
    else if (currentSleep < localSleepGoal) setRecommendation(`Try to sleep ${localSleepGoal - currentSleep} more hours tonight.`);
    else setRecommendation("Excellent progress today! Keep it up 🎉");
  };

  const statCards = [
    { label: "Water", value: `${water}/${waterGoal}`, unit: "glasses", icon: "water", gradient: Colors.gradientWater, screen: "Hydration" },
    { label: "Calories", value: `${calories}`, unit: `/ ${calorieGoal} kcal`, icon: "restaurant", gradient: Colors.gradientNutrition, screen: "Nutrition" },
    { label: "Sleep", value: `${sleep}/${sleepGoal}`, unit: "hours", icon: "moon", gradient: Colors.gradientSleep, screen: "Sleep" },
    { label: "Habits", value: `${completedHabits}/${totalHabits}`, unit: "done", icon: "checkmark-circle", gradient: Colors.gradientHabits, screen: "Habits" },
  ];

  const scoreColor = healthScore >= 75 ? Colors.primary : healthScore >= 50 ? Colors.warning : Colors.danger;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <LinearGradient colors={Colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>👋 {getGreeting()}</Text>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.appName}>Pocket Health Companion</Text>
            </View>
            {/* <Image source={logo} style={styles.headerLogo} /> */}
          </View>
        </LinearGradient>

        <View style={styles.content}>

          {/* Health Score */}
          <View style={[styles.scoreCard, Shadow.card]}>
            <View style={styles.scoreLeft}>
              <Text style={styles.scoreLabel}>Overall Health Score</Text>
              <Text style={[styles.scoreValue, { color: scoreColor }]}>{healthScore}</Text>
              <View style={styles.scoreBarBg}>
                <LinearGradient colors={Colors.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.scoreBarFill, { width: `${healthScore}%` }]} />
              </View>
            </View>
            <Text style={styles.scoreEmoji}>
              {healthScore >= 75 ? "🏆" : healthScore >= 50 ? "💪" : "⚠️"}
            </Text>
          </View>

          {/* AI Recommendation */}
          <LinearGradient colors={["#1e1b4b", "#312e81"]} style={[styles.aiCard, Shadow.card]}>
            <Text style={styles.aiTitle}>🤖 Aurora Recommendation</Text>
            <Text style={styles.aiText}>{recommendation}</Text>
          </LinearGradient>

          {/* Stat Cards */}
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.grid}>
            {statCards.map((card) => (
              <TouchableOpacity key={card.label} style={styles.statCardWrapper} onPress={() => navigation.navigate(card.screen)} activeOpacity={0.85}>
                <LinearGradient colors={card.gradient as any} style={[styles.statCard, Shadow.card]}>
                  <Ionicons name={card.icon as any} size={26} color="rgba(255,255,255,0.9)" style={{ marginBottom: 10 }} />
                  <Text style={styles.statLabel}>{card.label}</Text>
                  <Text style={styles.statValue}>{card.value}</Text>
                  <Text style={styles.statUnit}>{card.unit}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("Aurora AI")}>
            <LinearGradient colors={Colors.gradientAI} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.aiButton, Shadow.button]}>
              <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.aiButtonText}>Chat with Aurora AI</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 20, paddingBottom: 50, paddingHorizontal: 22, overflow: "hidden" },
  circle1: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(46,187,168,0.1)", top: -50, right: -50 },
  circle2: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(168,85,247,0.1)", bottom: -30, left: -30 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { color: "rgba(255,255,255,0.7)", fontSize: 15 },
  userName: { color: Colors.textWhite, fontSize: 26, fontWeight: "800", marginTop: 2 },
  appName: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 },
  headerLogo: { width: 120, height: 120, borderRadius: 14 },
  content: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingTop: 24, paddingHorizontal: 18 },
  scoreCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  scoreLeft: { flex: 1 },
  scoreLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  scoreValue: { fontSize: 52, fontWeight: "800" },
  scoreBarBg: { height: 8, backgroundColor: Colors.border, borderRadius: 8, overflow: "hidden", marginTop: 8, width: "90%" },
  scoreBarFill: { height: "100%", borderRadius: 8 },
  scoreEmoji: { fontSize: 44, marginLeft: 10 },
  aiCard: { borderRadius: Radius.xl, padding: 18, marginBottom: 24 },
  aiTitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  aiText: { color: Colors.textWhite, fontSize: 15, fontWeight: "500", lineHeight: 22 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  statCardWrapper: { width: "48%", marginBottom: 14 },
  statCard: { borderRadius: Radius.lg, padding: 18 },

  statLabel: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  statValue: { color: Colors.textWhite, fontSize: 26, fontWeight: "800", marginTop: 2 },
  statUnit: { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 },
  aiButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", marginBottom: 20, flexDirection: "row", justifyContent: "center" },
  aiButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: "700" },
});
