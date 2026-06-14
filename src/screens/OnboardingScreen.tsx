import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Image, Dimensions, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, Radius, Shadow } from "../constants/theme";

const { width } = Dimensions.get("window");
const logo = require("../../assets/icon.png");

const STEPS = [
  { title: "Personal Info", subtitle: "Tell us about yourself", icon: "person-outline" },
  { title: "Your Goals", subtitle: "Set your daily health targets", icon: "flag-outline" },
  { title: "Lifestyle", subtitle: "Help us personalize your experience", icon: "heart-outline" },
  { title: "All Set!", subtitle: "You're ready to start your health journey", icon: "checkmark-circle-outline" },
];

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // Step 1 — Personal
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Step 2 — Goals
  const [waterGoal, setWaterGoal] = useState("8");
  const [sleepGoal, setSleepGoal] = useState("8");
  const [calorieGoal, setCalorieGoal] = useState("2000");

  // Step 3 — Lifestyle
  const [activityLevel, setActivityLevel] = useState("");
  const [dietType, setDietType] = useState("");

  const bmi =
    height && weight
      ? (Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)
      : null;

  const genderOptions = ["Male", "Female", "Other"];
  const activityOptions = ["Sedentary", "Light", "Moderate", "Active", "Very Active"];
  const dietOptions = ["No Preference", "Vegetarian", "Vegan", "Keto", "Paleo"];

  const validateStep = () => {
    if (step === 0 && !name.trim()) {
      Alert.alert("Required", "Please enter your name to continue.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem("profile", JSON.stringify({
      name, age, gender, height, weight,
      waterGoal, sleepGoal, calorieGoal,
      activityLevel, dietType,
    }));
    await AsyncStorage.setItem("onboarding_complete", "true");
    onComplete();
  };

  const progressWidth = ((step + 1) / STEPS.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>

      {/* Header */}
      <LinearGradient colors={Colors.gradientHero} style={styles.header}>
        <View style={styles.circle1} />
        <Image source={logo} style={styles.logo} />
        <Text style={styles.appName}>Pocket Health</Text>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <LinearGradient
            colors={Colors.gradientButton}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progressWidth}%` }]}
          />
        </View>
        <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Header */}
        <View style={styles.stepHeader}>
          <View style={styles.stepIconCircle}>
            <LinearGradient colors={Colors.gradientButton} style={styles.stepIconGradient}>
              <Ionicons name={STEPS[step].icon as any} size={28} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.stepTitle}>{STEPS[step].title}</Text>
          <Text style={styles.stepSubtitle}>{STEPS[step].subtitle}</Text>
        </View>

        {/* Step 1 — Personal Info */}
        {step === 0 && (
          <View style={[styles.card, Shadow.card]}>
            {[
              { placeholder: "Full Name *", icon: "person-outline" as const, value: name, setter: setName, numeric: false },
              { placeholder: "Age", icon: "calendar-outline" as const, value: age, setter: setAge, numeric: true },
              { placeholder: "Height (cm)", icon: "resize-outline" as const, value: height, setter: setHeight, numeric: true },
              { placeholder: "Weight (kg)", icon: "barbell-outline" as const, value: weight, setter: setWeight, numeric: true },
            ].map((f) => (
              <View key={f.placeholder} style={styles.inputRow}>
                <Ionicons name={f.icon} size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={f.value}
                  onChangeText={f.setter}
                  keyboardType={f.numeric ? "numeric" : "default"}
                />
              </View>
            ))}

            <Text style={styles.optionLabel}>Gender</Text>
            <View style={styles.optionRow}>
              {genderOptions.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.optionChip, gender === g && styles.optionChipActive]}
                  onPress={() => setGender(g)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionChipText, gender === g && styles.optionChipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {bmi && (
              <View style={styles.bmiPreview}>
                <Ionicons name="analytics-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.bmiText}>BMI Preview: <Text style={{ fontWeight: "800", color: Colors.primary }}>{bmi}</Text></Text>
              </View>
            )}
          </View>
        )}

        {/* Step 2 — Daily Goals */}
        {step === 1 && (
          <View style={[styles.card, Shadow.card]}>
            {[
              { label: "Daily Water Goal", unit: "glasses", icon: "water-outline" as const, value: waterGoal, setter: setWaterGoal, gradient: Colors.gradientWater, default: "8" },
              { label: "Daily Sleep Goal", unit: "hours", icon: "moon-outline" as const, value: sleepGoal, setter: setSleepGoal, gradient: Colors.gradientSleep, default: "8" },
              { label: "Daily Calorie Goal", unit: "kcal", icon: "restaurant-outline" as const, value: calorieGoal, setter: setCalorieGoal, gradient: Colors.gradientNutrition, default: "2000" },
            ].map((f) => (
              <View key={f.label} style={styles.goalItem}>
                <View style={styles.goalLeft}>
                  <LinearGradient colors={f.gradient as any} style={styles.goalIconBg}>
                    <Ionicons name={f.icon} size={18} color="#fff" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.goalLabel}>{f.label}</Text>
                    <Text style={styles.goalUnit}>{f.unit}</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.goalInput}
                  value={f.value}
                  onChangeText={f.setter}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            ))}

            <View style={styles.goalHint}>
              <Ionicons name="information-circle-outline" size={15} color={Colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={styles.goalHintText}>You can always update these in your profile later.</Text>
            </View>
          </View>
        )}

        {/* Step 3 — Lifestyle */}
        {step === 2 && (
          <View style={[styles.card, Shadow.card]}>
            <Text style={styles.optionLabel}>Activity Level</Text>
            <View style={styles.optionColumn}>
              {activityOptions.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.optionRow2, activityLevel === a && styles.optionRow2Active]}
                  onPress={() => setActivityLevel(a)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, activityLevel === a && styles.radioCircleActive]}>
                    {activityLevel === a && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.optionRow2Text, activityLevel === a && styles.optionRow2TextActive]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.optionLabel, { marginTop: 20 }]}>Diet Preference</Text>
            <View style={styles.optionWrap}>
              {dietOptions.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.optionChip, dietType === d && styles.optionChipActive]}
                  onPress={() => setDietType(d)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionChipText, dietType === d && styles.optionChipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4 — Done */}
        {step === 3 && (
          <View style={[styles.card, Shadow.card, { alignItems: "center" }]}>
            <LinearGradient colors={Colors.gradientButton} style={styles.doneCircle}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </LinearGradient>

            <Text style={styles.doneTitle}>You're all set, {name || "there"}!</Text>
            <Text style={styles.doneSubtitle}>
              Here's a summary of your setup:
            </Text>

            {[
              { icon: "person-outline" as const, label: "Name", value: name || "—" },
              { icon: "water-outline" as const, label: "Water Goal", value: `${waterGoal} glasses/day` },
              { icon: "moon-outline" as const, label: "Sleep Goal", value: `${sleepGoal} hrs/night` },
              { icon: "restaurant-outline" as const, label: "Calorie Goal", value: `${calorieGoal} kcal/day` },
              { icon: "fitness-outline" as const, label: "Activity", value: activityLevel || "Not set" },
              { icon: "leaf-outline" as const, label: "Diet", value: dietType || "Not set" },
            ].map((item) => (
              <View key={item.label} style={styles.summaryRow}>
                <Ionicons name={item.icon} size={16} color={Colors.primary} style={{ marginRight: 10 }} />
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}

        {step < STEPS.length - 1 ? (
          <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={{ flex: 1 }}>
            <LinearGradient colors={Colors.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.nextBtn, Shadow.button]}>
              <Text style={styles.nextBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleFinish} activeOpacity={0.85} style={{ flex: 1 }}>
            <LinearGradient colors={Colors.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.nextBtn, Shadow.button]}>
              <Ionicons name="rocket-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.nextBtnText}>Start My Journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },

  header: { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 22, alignItems: "center", overflow: "hidden" },
  circle1: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(46,187,168,0.1)", top: -40, right: -40 },
  logo: { width: 42, height: 42, borderRadius: 12 },
  appName: { color: Colors.textWhite, fontSize: 18, fontWeight: "800", marginTop: 6 },

  progressContainer: { paddingHorizontal: 22, paddingVertical: 12, backgroundColor: Colors.background },
  progressBg: { height: 6, backgroundColor: Colors.border, borderRadius: 6, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", borderRadius: 6 },
  stepLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: "600", textAlign: "right" },

  scrollContent: { paddingHorizontal: 18, paddingBottom: 20 },

  stepHeader: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  stepIconCircle: { marginBottom: 14 },
  stepIconGradient: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  stepTitle: { fontSize: 24, fontWeight: "800", color: Colors.textPrimary, marginBottom: 6 },
  stepSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: "center" },

  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 20, marginBottom: 16 },

  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: 12 },
  inputIcon: { paddingLeft: 14 },
  inputWithIcon: { flex: 1, paddingHorizontal: 10, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary },

  optionLabel: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary, marginBottom: 10, marginTop: 4 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 4 },
  optionWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.inputBg },
  optionChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + "15" },
  optionChipText: { fontSize: 14, fontWeight: "600", color: Colors.textSecondary },
  optionChipTextActive: { color: Colors.primary },

  bmiPreview: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.primary + "12", borderRadius: Radius.md, padding: 12, marginTop: 8 },
  bmiText: { fontSize: 14, color: Colors.textPrimary },

  goalItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  goalLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  goalIconBg: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  goalLabel: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
  goalUnit: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  goalInput: { backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, fontWeight: "700", color: Colors.textPrimary, width: 90, textAlign: "center" },
  goalHint: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  goalHintText: { fontSize: 12, color: Colors.textMuted, flex: 1 },

  optionColumn: { gap: 10 },
  optionRow2: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.inputBg },
  optionRow2Active: { borderColor: Colors.primary, backgroundColor: Colors.primary + "10" },
  optionRow2Text: { fontSize: 15, fontWeight: "600", color: Colors.textSecondary, marginLeft: 12 },
  optionRow2TextActive: { color: Colors.primary },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  radioCircleActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  doneCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 20, ...Shadow.button },
  doneTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary, marginBottom: 8, textAlign: "center" },
  doneSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20, textAlign: "center" },
  summaryRow: { flexDirection: "row", alignItems: "center", width: "100%", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  summaryValue: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },

  footer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14, gap: 12, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  backBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, gap: 6 },
  backBtnText: { fontSize: 15, fontWeight: "600", color: Colors.textSecondary },
  nextBtn: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  nextBtnText: { color: Colors.textWhite, fontSize: 16, fontWeight: "700" },
});
