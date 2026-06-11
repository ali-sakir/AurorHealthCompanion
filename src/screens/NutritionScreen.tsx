import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function NutritionScreen() {
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");

  const goal = 2000;

  useFocusEffect(
    useCallback(() => {
      loadNutrition();
    }, [])
  );

  useEffect(() => {
    saveNutrition();
  }, [breakfast, lunch, dinner]);

  const saveNutrition = async () => {
    await AsyncStorage.setItem(
      "nutrition",
      JSON.stringify({
        breakfast,
        lunch,
        dinner,
      })
    );
  };

  const loadNutrition = async () => {

    const data =
      await AsyncStorage.getItem(
        "nutrition"
      );

    if (data) {
      const parsed =
        JSON.parse(data);

      setBreakfast(
        parsed.breakfast || ""
      );

      setLunch(
        parsed.lunch || ""
      );

      setDinner(
        parsed.dinner || ""
      );
    }
  };

  const total =
    Number(breakfast || 0) +
    Number(lunch || 0) +
    Number(dinner || 0);

  const progress = Math.min(
    (total / goal) * 100,
    100
  );

  const remaining = Math.max(
    goal - total,
    0
  );

  const getMessage = () => {
    if (progress < 30) {
      return "🍎 Need more nutrition";
    }

    if (progress < 80) {
      return "💪 Great Progress!";
    }

    if (progress <= 100) {
      return "🎉 Goal Achieved!";
    }

    return "⚠️ Above Daily Goal";
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>
          🍎 Nutrition Tracker
        </Text>

        <Text style={styles.headerSubtitle}>
          Monitor your daily calorie intake
        </Text>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Breakfast Calories"
        keyboardType="numeric"
        value={breakfast}
        onChangeText={setBreakfast}
      />

      <TextInput
        style={styles.input}
        placeholder="Lunch Calories"
        keyboardType="numeric"
        value={lunch}
        onChangeText={setLunch}
      />

      <TextInput
        style={styles.input}
        placeholder="Dinner Calories"
        keyboardType="numeric"
        value={dinner}
        onChangeText={setDinner}
      />

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Today's Summary
        </Text>

        <Text style={styles.summaryText}>
          🍳 Breakfast: {breakfast || 0} kcal
        </Text>

        <Text style={styles.summaryText}>
          🍛 Lunch: {lunch || 0} kcal
        </Text>

        <Text style={styles.summaryText}>
          🍽 Dinner: {dinner || 0} kcal
        </Text>
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <Text style={styles.goalText}>
          Daily Goal: {goal} kcal
        </Text>

        <Text style={styles.value}>
          {total}
        </Text>

        <Text style={styles.totalText}>
          Total Calories
        </Text>

        <Text style={styles.remaining}>
          Remaining: {remaining} kcal
        </Text>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.percent}>
          {Math.round(progress)}%
        </Text>

        <Text style={styles.message}>
          {getMessage()}
        </Text>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setBreakfast("");
          setLunch("");
          setDinner("");
        }}
      >
        <Text style={styles.resetText}>
          Reset Nutrition
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },

  headerCard: {
    backgroundColor: "#FF6B6B",
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  headerSubtitle: {
    fontSize: 15,
    color: "#fff",
    marginTop: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    elevation: 0,

    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 15,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 16,
    marginVertical: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  goalText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },

  value: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },

  totalText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },

  remaining: {
    textAlign: "center",
    color: "#22C55E",
    fontWeight: "bold",
    marginBottom: 15,
  },

  progressBackground: {
    height: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },

  percent: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 20,
  },

  message: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },

  resetButton: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 15,
    marginTop: 25,
    marginBottom: 40,
  },

  resetText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});