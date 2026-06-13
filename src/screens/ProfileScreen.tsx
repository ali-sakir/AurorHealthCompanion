import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Colors, Radius, Shadow } from "../constants/theme";

export default function ProfileScreen() {
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waterGoal, setWaterGoal] = useState("8");
  const [sleepGoal, setSleepGoal] = useState("8");
  const [calorieGoal, setCalorieGoal] = useState("2000");

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const data = await AsyncStorage.getItem("profile");
    if (data) {
      const p = JSON.parse(data);
      setName(p.name || ""); setAge(p.age || ""); setGender(p.gender || "");
      setHeight(p.height || ""); setWeight(p.weight || "");
      setWaterGoal(p.waterGoal || "8"); setSleepGoal(p.sleepGoal || "8"); setCalorieGoal(p.calorieGoal || "2000");
    }
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem("profile", JSON.stringify({ name, age, gender, height, weight, waterGoal, sleepGoal, calorieGoal }));
    Alert.alert("Saved", "Profile updated successfully!");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Logged Out", "Restart the app to log in again.");
  };

  const bmi = height && weight ? (Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1) : "—";
  const bmiStatus = () => {
    const v = Number(bmi);
    if (isNaN(v)) return "—";
    if (v < 18.5) return "Underweight";
    if (v < 25) return "Normal Weight";
    if (v < 30) return "Overweight";
    return "Obese";
  };
  const bmiColor = () => {
    const v = Number(bmi);
    if (isNaN(v)) return Colors.textSecondary;
    if (v < 18.5 || v >= 30) return Colors.danger;
    if (v < 25) return Colors.success;
    return Colors.warning;
  };

  const personalFields = [
    { placeholder: "Full Name",    icon: "person-outline" as const,   value: name,   setter: setName,   numeric: false },
    { placeholder: "Age",          icon: "calendar-outline" as const,  value: age,    setter: setAge,    numeric: true },
    { placeholder: "Gender",       icon: "male-female-outline" as const, value: gender, setter: setGender, numeric: false },
    { placeholder: "Height (cm)",  icon: "resize-outline" as const,    value: height, setter: setHeight, numeric: true },
    { placeholder: "Weight (kg)",  icon: "barbell-outline" as const,   value: weight, setter: setWeight, numeric: true },
  ];

  const goalFields = [
    { placeholder: "Water Goal (glasses)", icon: "water-outline" as const,      value: waterGoal,    setter: setWaterGoal },
    { placeholder: "Sleep Goal (hours)",   icon: "moon-outline" as const,       value: sleepGoal,    setter: setSleepGoal },
    { placeholder: "Calorie Goal (kcal)",  icon: "restaurant-outline" as const, value: calorieGoal,  setter: setCalorieGoal },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <LinearGradient colors={Colors.gradientProfile} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : "U"}</Text>
          </View>
          <Text style={styles.headerName}>{name || "Your Profile"}</Text>
          <Text style={styles.headerSub}>Personalize your health journey</Text>
        </LinearGradient>

        <View style={styles.content}>

          {/* Personal Info */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {personalFields.map((field) => (
              <View key={field.placeholder} style={styles.inputRow}>
                <Ionicons name={field.icon} size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={field.value}
                  onChangeText={field.setter}
                  keyboardType={field.numeric ? "numeric" : "default"}
                />
              </View>
            ))}
          </View>

          {/* BMI Card */}
          <View style={[styles.card, Shadow.card, { alignItems: "center" }]}>
            <Text style={styles.sectionTitle}>BMI Analysis</Text>
            <Text style={[styles.bmiValue, { color: bmiColor() }]}>{bmi}</Text>
            <View style={[styles.bmiPill, { backgroundColor: bmiColor() + "22" }]}>
              <Text style={[styles.bmiStatusText, { color: bmiColor() }]}>{bmiStatus()}</Text>
            </View>
          </View>

          {/* Daily Goals */}
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            {goalFields.map((field) => (
              <View key={field.placeholder} style={styles.inputRow}>
                <Ionicons name={field.icon} size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={field.value}
                  onChangeText={field.setter}
                  keyboardType="numeric"
                />
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={saveProfile} activeOpacity={0.85}>
            <LinearGradient colors={Colors.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.primaryButton, Shadow.button]}>
              <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Save Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 30, paddingBottom: 50, alignItems: "center", overflow: "hidden" },
  circle1: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -40 },
  avatarCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.4)" },
  avatarText: { fontSize: 32, fontWeight: "800", color: Colors.textWhite },
  headerName: { color: Colors.textWhite, fontSize: 22, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 },
  content: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingTop: 24, paddingHorizontal: 18 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: 12 },
  inputIcon: { paddingLeft: 14 },
  inputWithIcon: { flex: 1, paddingHorizontal: 10, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary },
  bmiValue: { fontSize: 56, fontWeight: "800", marginBottom: 8 },
  bmiPill: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20 },
  bmiStatusText: { fontSize: 16, fontWeight: "700" },
  primaryButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", marginBottom: 12, flexDirection: "row", justifyContent: "center" },
  primaryButtonText: { color: Colors.textWhite, fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  logoutButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", marginBottom: 12, borderWidth: 1.5, borderColor: Colors.danger, backgroundColor: Colors.danger + "11", flexDirection: "row", justifyContent: "center" },
  logoutText: { color: Colors.danger, fontSize: 16, fontWeight: "700" },
});
