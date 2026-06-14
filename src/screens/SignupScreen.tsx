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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import GoogleIcon from "../../assets/images/GoogleLight.svg";
import AppleIcon from "../../assets/images/AppleLight.svg";
import GitHubIcon from "../../assets/images/GitHubLight.svg";
import { Colors, Radius, Shadow } from "../constants/theme";
import { supabase } from '../services/supabase';
//import { register } from "../services/api";

const logo = require("../../assets/icon.png");

export default function SignupScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value: string) => {
    setEmail(value);
    setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address");
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    setPasswordError(value.length >= 8 ? "" : "Password must be at least 8 characters");
  };

  const socialProviders = [
    { key: "google", label: "Continue with Google", Icon: GoogleIcon, onPress: () => Alert.alert("Google Signup", "Coming Soon") },
    { key: "apple", label: "Continue with Apple", Icon: AppleIcon, onPress: () => Alert.alert("Apple Signup", "Coming Soon") },
    { key: "github", label: "Continue with GitHub", Icon: GitHubIcon, onPress: () => Alert.alert("GitHub Signup", "Coming Soon") },
  ];

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }
    if (emailError || !email) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (passwordError || !password) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        Alert.alert("Signup Failed", error.message);
        return;
      }

      if (data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          name: fullName,
          email,
        });
      }

      Alert.alert(
        "Account Created!",
        "Please check your email to confirm your account, then log in.",
        [{ text: "Go to Login", onPress: () => navigation.navigate("Login") }]
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        <LinearGradient colors={Colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.logoContainer}>
            {/* <LinearGradient colors={Colors.gradientButton} style={styles.logoIconWrapper}> */}
              <Image source={logo} style={styles.logoImage} />
            {/* </LinearGradient> */}
            {/* <Svg height={36} width={220}>
              <Defs>
                <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={Colors.primary} />
                  <Stop offset="0.5" stopColor="#7dd3fc" />
                  <Stop offset="1" stopColor={Colors.accent} />
                </SvgLinearGradient>
              </Defs>
              <SvgText fill="url(#grad)" fontSize={26} fontWeight="700" x="110" y="28" textAnchor="middle">
                Pocket Health
              </SvgText>
            </Svg> */}
            <Text style={styles.heroSubtitle}>Start your health journey today</Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join and take control of your health</Text>

          <View style={styles.inputWrapper}>
            <TextInput placeholder="Full Name" placeholderTextColor={Colors.textMuted} value={fullName} onChangeText={setFullName} style={styles.input} />
          </View>

          <View style={[styles.inputWrapper, emailError ? styles.inputWrapperError : null]}>
            <TextInput placeholder="Email address" placeholderTextColor={Colors.textMuted} value={email} onChangeText={validateEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={[styles.inputWrapper, passwordError ? styles.inputWrapperError : null]}>
            <TextInput placeholder="Password (min. 8 characters)" placeholderTextColor={Colors.textMuted} value={password} onChangeText={validatePassword} style={styles.input} secureTextEntry />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity onPress={handleSignup} activeOpacity={0.85} disabled={loading} style={{ marginTop: 10, marginBottom: 28 }}>
            <LinearGradient colors={Colors.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{loading ? "Creating..." : "Create Account"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or sign up with</Text>
            <View style={styles.line} />
          </View>

          {socialProviders.map(({ key, label, Icon, onPress }) => (
            <TouchableOpacity key={key} style={styles.socialButton} onPress={onPress} activeOpacity={0.8}>
              <Icon width={20} height={20} style={{ marginRight: 10 }} />
              <Text style={styles.socialText}>{label}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  hero: { width: "100%", paddingTop: 40, paddingBottom: 60, alignItems: "center", overflow: "hidden" },
  circle1: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(46,187,168,0.12)", top: -60, right: -60 },
  circle2: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(168,85,247,0.1)", bottom: -40, left: -40 },
  logoContainer: { alignItems: "center", gap: 10 },
  logoIconWrapper: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4, ...Shadow.button },
  logoImage: { width: 120, height: 120, borderRadius: 10 },
  heroSubtitle: { color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 2 },
  card: { backgroundColor: Colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -28, paddingHorizontal: 26, paddingTop: 36, paddingBottom: 40, minHeight: 600 },
  title: { fontSize: 28, fontWeight: "800", color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 28 },
  inputWrapper: { backgroundColor: Colors.inputBg, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: 5, flexDirection: "row", alignItems: "center" },
  inputWrapperError: { borderColor: Colors.danger },
  input: { flex: 1, paddingHorizontal: 18, paddingVertical: 16, fontSize: 16, color: Colors.textPrimary },
  errorText: { color: Colors.danger, fontSize: 12, marginBottom: 10, marginLeft: 5 },
  primaryButton: { borderRadius: Radius.md, paddingVertical: 16, alignItems: "center", ...Shadow.button },
  primaryButtonText: { color: Colors.textWhite, fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { marginHorizontal: 12, color: Colors.textMuted, fontSize: 13 },
  socialButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 14, marginBottom: 12, backgroundColor: "#FAFAFA" },
  socialText: { fontSize: 15, fontWeight: "600", color: Colors.textPrimary },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: Colors.textSecondary, fontSize: 15 },
  linkText: { color: Colors.primary, fontWeight: "700", fontSize: 15 },
});
