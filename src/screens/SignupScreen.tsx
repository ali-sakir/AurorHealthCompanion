import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import GoogleIcon from "../../assets/images/GoogleLight.svg";
import AppleIcon from "../../assets/images/AppleLight.svg";
import GitHubIcon from "../../assets/images/GitHubLight.svg";

export default function SignupScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    // {
    //   key: "github",
    //   label: "Continue with GitHub",
    //   Icon: GitHubIcon,
    //   onPress: () => Alert.alert("GitHub Login", "Coming Soon"),
    // },
  ];

  const handleSignup = () => {
    Alert.alert(
      "Create Account",
      "Backend integration coming next"
    );
  };

  const handleGoogleSignup = () => {
    Alert.alert(
      "Google Signup",
      "Coming Soon"
    );
  };

  const handleAppleSignup = () => {
    Alert.alert(
      "Apple Signup",
      "Coming Soon"
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}

        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>💙</Text>

          <Text style={styles.logoText}>
            Pocket Health
          </Text>
        </View>

        {/* Title */}

        <Text style={styles.title}>
          Create Account
        </Text>

        {/* Full Name */}

        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        {/* Email */}

        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        {/* Create Account */}

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Divider */}

        <View style={styles.dividerRow}>
          <View style={styles.line} />

          <Text style={styles.orText}>
            or sign up with
          </Text>

          <View style={styles.line} />
        </View>

        {socialProviders.map(({ key, label, Icon, onPress }) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.socialButton}
                    onPress={onPress}
                  >
                    <Icon width={20} height={20} style={{ marginRight: 10 }} />
                    <Text style={styles.socialText}>{label}</Text>
                  </TouchableOpacity>
                ))}

        {/* Login */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Login")
            }
          >
            <Text style={styles.loginText}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 30,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoIcon: {
    fontSize: 55,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 35,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 15,
  },

  signupButton: {
    backgroundColor: "#2563EB",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },

  orText: {
    marginHorizontal: 10,
    color: "#6B7280",
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 15,
    paddingVertical: 15,

    marginBottom: 15,

    backgroundColor: "#FFFFFF",
  },

  socialIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  footerText: {
    color: "#6B7280",
  },

  loginText: {
    color: "#2563EB",
    fontWeight: "700",
    marginLeft: 5,
  },
});