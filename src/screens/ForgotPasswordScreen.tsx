import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius, Shadow } from "../constants/theme";

const logo = require("../../assets/icon.png");

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    setEmail(value);
    setEmailError(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Enter a valid email address"
    );
  };

  const handleReset = () => {
    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }
    if (emailError) return;
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        <LinearGradient
          colors={Colors.gradientHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logoImage} />
            <Text style={styles.heroTitle}>Pocket Health</Text>
            <Text style={styles.heroSubtitle}>Reset your password</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>

          {!submitted ? (
            <>
              {/* Icon */}
              <View style={styles.iconWrapper}>
                <LinearGradient colors={Colors.gradientButton} style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>🔐</Text>
                </LinearGradient>
              </View>

              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email and we'll send you a reset link.
              </Text>

              {/* Email Input */}
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, emailError ? styles.inputWrapperError : null]}>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={validateEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              {/* Send Button */}
              <TouchableOpacity onPress={handleReset} activeOpacity={0.85} style={{ marginTop: 24 }}>
                <LinearGradient
                  colors={Colors.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.primaryButton, Shadow.button]}
                >
                  <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Success State */}
              <View style={styles.iconWrapper}>
                <LinearGradient colors={[Colors.success, "#34d399"]} style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>✅</Text>
                </LinearGradient>
              </View>

              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a password reset link to:
              </Text>
              <View style={styles.emailPill}>
                <Text style={styles.emailPillText}>{email}</Text>
              </View>
              <Text style={styles.hintText}>
                Didn't receive it? Check your spam folder or try again.
              </Text>

              <TouchableOpacity onPress={() => setSubmitted(false)} activeOpacity={0.85} style={{ marginTop: 24 }}>
                <LinearGradient
                  colors={Colors.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.primaryButton, Shadow.button]}
                >
                  <Text style={styles.primaryButtonText}>Resend Email</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.backText}>← Back to Log In</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },

  hero: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    overflow: "hidden",
  },

  circle1: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(46,187,168,0.12)", top: -60, right: -60,
  },
  circle2: {
    position: "absolute", width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(168,85,247,0.1)", bottom: -40, left: -40,
  },

  logoContainer: { alignItems: "center", gap: 8 },
  logoImage: { width: 120, height: 120, borderRadius: 14, marginBottom: 4 },
  heroTitle: { color: Colors.textWhite, fontSize: 22, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.55)", fontSize: 14 },

  card: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 26,
    paddingTop: 36,
    paddingBottom: 48,
    minHeight: Dimensions.get("window").height * 0.72,
  },

  iconWrapper: { alignItems: "center", marginBottom: 20 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center",
    ...Shadow.button,
  },
  iconEmoji: { fontSize: 32 },

  title: {
    fontSize: 26, fontWeight: "800",
    color: Colors.textPrimary, textAlign: "center", marginBottom: 10,
  },
  subtitle: {
    fontSize: 15, color: Colors.textSecondary,
    textAlign: "center", lineHeight: 22, marginBottom: 8,
  },

  label: {
    fontSize: 14, fontWeight: "600",
    color: Colors.textPrimary, marginBottom: 8, marginTop: 16,
  },

  inputWrapper: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapperError: { borderColor: Colors.danger },
  input: {
    flex: 1, paddingHorizontal: 18, paddingVertical: 16,
    fontSize: 16, color: Colors.textPrimary,
  },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 6, marginLeft: 4 },

  primaryButton: {
    borderRadius: Radius.md, paddingVertical: 16, alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.textWhite, fontSize: 17, fontWeight: "700", letterSpacing: 0.5,
  },

  emailPill: {
    backgroundColor: Colors.primary + "18",
    borderWidth: 1, borderColor: Colors.primary + "40",
    borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10,
    alignSelf: "center", marginVertical: 12,
  },
  emailPillText: { color: Colors.primary, fontWeight: "700", fontSize: 15 },

  hintText: {
    fontSize: 13, color: Colors.textMuted,
    textAlign: "center", lineHeight: 20, marginTop: 4,
  },

  backButton: {
    marginTop: 24, alignItems: "center", paddingVertical: 12,
  },
  backText: { color: Colors.secondary, fontWeight: "600", fontSize: 15 },
});
