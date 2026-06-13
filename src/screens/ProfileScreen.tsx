import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [waterGoal, setWaterGoal] =
    useState("8");

  const [sleepGoal, setSleepGoal] =
    useState("8");

  const [calorieGoal, setCalorieGoal] =
    useState("2000");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data =
      await AsyncStorage.getItem(
        "profile"
      );

    if (data) {
      const profile =
        JSON.parse(data);

      setName(profile.name || "");
      setAge(profile.age || "");
      setGender(profile.gender || "");

      setHeight(
        profile.height || ""
      );

      setWeight(
        profile.weight || ""
      );

      setWaterGoal(
        profile.waterGoal || "8"
      );

      setSleepGoal(
        profile.sleepGoal || "8"
      );

      setCalorieGoal(
        profile.calorieGoal ||
          "2000"
      );
    }
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem(
      "profile",
      JSON.stringify({
        name,
        age,
        gender,
        height,
        weight,
        waterGoal,
        sleepGoal,
        calorieGoal,
      })
    );

    alert("Profile Saved!");
  };

    const logout = async () => {
  await AsyncStorage.removeItem(
    "token"
  );

  Alert.alert(
    "Logged Out",
    "Restart App"
  );
};

  const bmi =
    height && weight
      ? (
          Number(weight) /
          Math.pow(
            Number(height) / 100,
            2
          )
        ).toFixed(1)
      : "0";

  const bmiStatus = () => {
    const value = Number(bmi);

    if (value < 18.5)
      return "Underweight";

    if (value < 25)
      return "Normal Weight";

    if (value < 30)
      return "Overweight";

    return "Obese";
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          👤 My Profile
        </Text>

        <Text
          style={styles.subtitle}
        >
          Personalize your health
          journey
        </Text>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />

        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={styles.bmiCard}>
        <Text
          style={styles.sectionTitle}
        >
          BMI Analysis
        </Text>

        <Text style={styles.bmi}>
          {bmi}
        </Text>

        <Text
          style={styles.bmiStatus}
        >
          {bmiStatus()}
        </Text>
      </View>

      <View style={styles.goalCard}>
        <Text
          style={styles.sectionTitle}
        >
          Daily Goals
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Water Goal"
          keyboardType="numeric"
          value={waterGoal}
          onChangeText={
            setWaterGoal
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Sleep Goal"
          keyboardType="numeric"
          value={sleepGoal}
          onChangeText={
            setSleepGoal
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Calorie Goal"
          keyboardType="numeric"
          value={calorieGoal}
          onChangeText={
            setCalorieGoal
          }
        />
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveProfile}
      >
        <Text
          style={styles.saveText}
        >
          Save Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 15,
          borderRadius: 15,
          marginTop: 20,
        }}
        onPress={logout}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor:
      "#F5F7FB",
  },

  header: {
    backgroundColor:
      "#7C3AED",
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#EDE9FE",
    marginTop: 5,
    fontSize: 15,
  },

  card: {
    backgroundColor:
      "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
  },

  bmiCard: {
    backgroundColor:
      "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },

  goalCard: {
    backgroundColor:
      "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    backgroundColor:
      "#F9FAFB",
    borderWidth: 1,
    borderColor:
      "#E5E7EB",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },

  bmi: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#7C3AED",
  },

  bmiStatus: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor:
      "#7C3AED",
    padding: 18,
    borderRadius: 15,
    marginBottom: 30,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});