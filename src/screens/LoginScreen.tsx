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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import GoogleIcon from "../../assets/images/GoogleLight.svg";
import AppleIcon from "../../assets/images/AppleLight.svg";
import GitHubIcon from "../../assets/images/GitHubLight.svg";
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const logo = require("../../assets/icon.png");

  const validateEmail = (value: string) => {
    setEmail(value);
    setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address");
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    setPasswordError(value.length >= 8 ? "" : "Password must be at least 8 characters");
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem("token", "dummy-token");
    Alert.alert("Login", "Backend integration coming next");
  };

  const socialProviders = [
    {
      key: "google",
      label: "Continue with Google",
      Icon: GoogleIcon,
      onPress: () => Alert.alert("Google Login", "Coming Soon"),
    },
    {
      key: "apple",
      label: "Continue with Apple",
      Icon: AppleIcon,
      onPress: () => Alert.alert("Apple Login", "Coming Soon"),
    },
    {
      key: "github",
      label: "Continue with GitHub",
      Icon: GitHubIcon,
      onPress: () => Alert.alert("GitHub Login", "Coming Soon"),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* Gradient Hero */}
        <LinearGradient
          colors={["#0f172a", "#1e3a5f", "#0e7490"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.logoContainer}>
            {/* <LinearGradient
              colors={["#2ebba8", "#5b8dee"]}
              style={styles.logoIconWrapper}
            > */}
              <Image source={logo} style={styles.logoImage} />
            {/* </LinearGradient> */}

            <Svg height={36} width={220}>
              <Defs>
                <SvgLinearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#2ebba8" />
                  <Stop offset="0.5" stopColor="#7dd3fc" />
                  <Stop offset="1" stopColor="#a855f7" />
                </SvgLinearGradient>
              </Defs>
              <SvgText
                fill="url(#logoGrad)"
                fontSize={26}
                fontWeight="700"
                x="110"
                y="28"
                textAnchor="middle"
              >
                Pocket Health
              </SvgText>
            </Svg>

            <Text style={styles.heroSubtitle}>Your personal health companion</Text>
          </View>
        </LinearGradient>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Email */}
          <View style={[styles.inputWrapper, emailError ? styles.inputWrapperError : null]}>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={validateEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password */}
          <View style={[styles.inputWrapper, passwordError ? styles.inputWrapperError : null]}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={validatePassword}
              style={styles.input}
              secureTextEntry
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
            <LinearGradient
              colors={["#2ebba8", "#5b8dee", "#a855f7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons */}
          {socialProviders.map(({ key, label, Icon, onPress }) => (
            <TouchableOpacity key={key} style={styles.socialButton} onPress={onPress} activeOpacity={0.8}>
              <Icon width={20} height={20} style={{ marginRight: 10 }} />
              <Text style={styles.socialText}>{label}</Text>
            </TouchableOpacity>
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  hero: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    overflow: "hidden",
  },

  circle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(46,187,168,0.12)",
    top: -60,
    right: -60,
  },

  circle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(168,85,247,0.1)",
    bottom: -40,
    left: -40,
  },

  logoContainer: {
    alignItems: "center",
    gap: 10,
  },

  logoIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#2ebba8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },

  logoImage: {
    width: 46,
    height: 46,
    borderRadius: 10,
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    marginTop: 2,
  },

  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 26,
    paddingTop: 36,
    paddingBottom: 40,
    minHeight: 600,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 28,
  },

  inputWrapper: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  inputWrapperError: {
    borderColor: "#EF4444",
  },

  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
    marginTop: 6,
  },

  forgotText: {
    color: "#5b8dee",
    fontWeight: "600",
    fontSize: 14,
  },

  loginButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 28,
    shadowColor: "#2ebba8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 13,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: "#FAFAFA",
  },

  socialText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  footerText: {
    color: "#6B7280",
    fontSize: 15,
  },

  signupText: {
    color: "#2ebba8",
    fontWeight: "700",
    fontSize: 15,
  },
});
