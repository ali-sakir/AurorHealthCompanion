import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Radius, Shadow } from "../constants/theme";

const GOAL = 8;

export default function SleepScreen() {
  const [sleepHours, setSleepHours] = useState(8);
  const [history, setHistory] = useState<number[]>([]);

  useFocusEffect(useCallback(() => { loadData(); }, []));
  useEffect(() => { AsyncStorage.setItem("sleepHours", sleepHours.toString()); }, [sleepHours]);

  const loadData = async () => {
    const savedHours = await AsyncStorage.getItem("sleepHours");
    const savedHistory = await AsyncStorage.getItem("sleepHistory");
    if (savedHours) setSleepHours(Number(savedHours));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  };

  const saveTodaySleep = async () => {
    const updated = [...history, sleepHours].slice(-7);
    setHistory(updated);
    await AsyncStorage.setItem("sleepHistory", JSON.stringify(updated));
  };

  const resetSleep = async () => {
    setSleepHours(0); setHistory([]);
    await AsyncStorage.removeItem("sleepHours");
    await AsyncStorage.removeItem("sleepHistory");
  };

  const progress = Math.min((sleepHours / GOAL) * 100, 100);
  const score = Math.min(Math.round((sleepHours / GOAL) * 100), 100);
  const average = history.length > 0 ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1) : "0";

  const getStatus = () => {
    if (score >= 90) return { text: "Excellent Sleep 😴", color: Colors.success };
    if (score >= 70) return { text: "Good Sleep 😊", color: Colors.primary };
    if (score >= 50) return { text: "Fair Sleep 🙂", color: Colors.warning };
    return { text: "Improve Sleep ⚠️", color: Colors.danger };
  };

  const status = getStatus();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <LinearGradient colors={Colors.gradientSleep} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <Text style={styles.headerTitle}>🌙 Sleep Tracker</Text>
          <Text style={styles.headerSub}>Improve your sleeping habits</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* Main Card */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.goalText}>Daily Goal: {GOAL} Hours</Text>
            <Text style={styles.hoursValue}>{sleepHours} <Text style={styles.hoursUnit}>hrs</Text></Text>

            <View style={styles.progressBg}>
              <LinearGradient colors={Colors.gradientSleep} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>

            <View style={[styles.statusPill, { backgroundColor: status.color + "22" }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
            </View>
            <Text style={styles.scoreText}>Sleep Score: <Text style={{ color: Colors.gradientSleep[0], fontWeight: "800" }}>{score}/100</Text></Text>
          </View>

          {/* Controls */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Adjust Sleep Hours</Text>
            <View style={styles.controlRow}>
              <TouchableOpacity onPress={() => setSleepHours(Math.max(sleepHours - 1, 0))} activeOpacity={0.85}>
                <LinearGradient colors={[Colors.warning, "#f59e0b"]} style={styles.controlBtn}>
                  <Text style={styles.controlBtnText}>- 1 Hour</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.controlValue}>{sleepHours}h</Text>
              <TouchableOpacity onPress={() => setSleepHours(sleepHours + 1)} activeOpacity={0.85}>
                <LinearGradient colors={Colors.gradientSleep} style={styles.controlBtn}>
                  <Text style={styles.controlBtnText}>+ 1 Hour</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Insights */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>📊 Weekly Insights</Text>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>7-Day Average</Text>
                <Text style={styles.insightValue}>{average}<Text style={styles.insightUnit}> hrs</Text></Text>
              </View>
              <View style={[styles.insightDivider]} />
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Entries Logged</Text>
                <Text style={styles.insightValue}>{history.length}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={saveTodaySleep} activeOpacity={0.85}>
            <LinearGradient colors={Colors.gradientSleep} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.primaryButton, Shadow.button]}>
              <Text style={styles.primaryButtonText}>Save Today's Sleep</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetSleep} activeOpacity={0.85}>
            <Text style={styles.resetText}>Reset Sleep Data</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 30, paddingBottom: 50, paddingHorizontal: 22, overflow: "hidden" },
  circle1: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.08)", top: -40, right: -40 },
  headerTitle: { color: Colors.textWhite, fontSize: 28, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6 },
  content: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingTop: 24, paddingHorizontal: 18 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 20, marginBottom: 16 },
  goalText: { color: Colors.textSecondary, fontSize: 14, textAlign: "center" },
  hoursValue: { fontSize: 64, fontWeight: "800", color: Colors.gradientSleep[0], textAlign: "center", marginTop: 4 },
  hoursUnit: { fontSize: 28, color: Colors.textSecondary, fontWeight: "400" },
  progressBg: { height: 14, backgroundColor: Colors.border, borderRadius: 20, overflow: "hidden", marginTop: 12 },
  progressFill: { height: "100%", borderRadius: 20 },
  progressPercent: { textAlign: "center", fontWeight: "700", fontSize: 16, marginTop: 8, color: Colors.textPrimary },
  statusPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, alignSelf: "center", marginTop: 12 },
  statusText: { fontWeight: "700", fontSize: 16 },
  scoreText: { textAlign: "center", color: Colors.textSecondary, fontSize: 15, marginTop: 10 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  controlRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  controlBtn: { borderRadius: Radius.md, paddingVertical: 14, paddingHorizontal: 22 },
  controlBtnText: { color: Colors.textWhite, fontWeight: "700", fontSize: 15 },
  controlValue: { fontSize: 36, fontWeight: "800", color: Colors.textPrimary },
  insightRow: { flexDirection: "row", alignItems: "center" },
  insightItem: { flex: 1, alignItems: "center" },
  insightDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  insightLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6 },
  insightValue: { fontSize: 36, fontWeight: "800", color: Colors.textPrimary },
  insightUnit: { fontSize: 16, color: Colors.textSecondary, fontWeight: "400" },
  primaryButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  primaryButtonText: { color: Colors.textWhite, fontSize: 16, fontWeight: "700" },
  resetButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", borderWidth: 1.5, borderColor: Colors.danger, backgroundColor: Colors.danger + "11" },
  resetText: { color: Colors.danger, fontSize: 16, fontWeight: "700" },
});
