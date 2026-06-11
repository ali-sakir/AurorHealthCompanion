import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HydrationScreen() {
  const [glasses, setGlasses] = useState(0);

  const DAILY_GOAL = 8;

  const progress = Math.min(
    (glasses / DAILY_GOAL) * 100,
    100
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  )

  useEffect(() => {
    AsyncStorage.setItem(
      "waterCount",
      glasses.toString()
    );
  }, [glasses]);

  const loadData = async () => {
    const saved = await AsyncStorage.getItem(
      "waterCount"
    );

    if (saved) {
      setGlasses(Number(saved));
    }
  };

  const addGlass = () => {
    setGlasses(glasses + 1);
  };

  const resetData = async () => {
    setGlasses(0);
    await AsyncStorage.removeItem("waterCount");
  };

  const getMessage = () => {
    if (glasses >= 8) {
      return "🎉 Goal Achieved!";
    }

    if (glasses >= 5) {
      return "🔥 Great Progress!";
    }

    if (glasses >= 3) {
      return "💪 Keep Going!";
    }

    return "🚀 Let's Start!";
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContainer
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            💧 Hydration Tracker
          </Text>

          <Text style={styles.heroSubtitle}>
            Stay hydrated and achieve
            your daily goal
          </Text>
        </View>

        <Text style={styles.jug}>
          🫗
        </Text>

        <View style={styles.goalCard}>
          <Text style={styles.goalText}>
            Daily Goal: 8 Glasses
          </Text>

          <Text style={styles.count}>
            {glasses} / 8
          </Text>

          <Text style={styles.label}>
            Glasses Consumed
          </Text>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {Math.round(progress)}%
            Complete
          </Text>

          <Text style={styles.remaining}>
            💧 Remaining:{" "}
            {Math.max(
              DAILY_GOAL - glasses,
              0
            )}
          </Text>
        </View>

        <View style={styles.glassRow}>
          {[...Array(8)].map(
            (_, index) => (
              <Text
                key={index}
                style={styles.glass}
              >
                {index < glasses
                  ? "🥛"
                  : "⬜"}
              </Text>
            )
          )}
        </View>

        <Text style={styles.message}>
          {getMessage()}
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={addGlass}
        >
          <Text style={styles.btnText}>
            + Add Glass
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={resetData}
        >
          <Text style={styles.btnText}>
            Reset Progress
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
  },

  hero: {
    backgroundColor: "#2563EB",
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "#E5E7EB",
    marginTop: 5,
    fontSize: 15,
  },

  jug: {
    fontSize: 100,
    textAlign: "center",
  },

  goalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },

  goalText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },

  count: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 10,
  },

  label: {
    textAlign: "center",
    color: "#666",
  },

  progressBg: {
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
  },

  progressText: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18,
  },

  remaining: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "600",
  },

  glassRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 25,
  },

  glass: {
    fontSize: 28,
    margin: 5,
  },

  message: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },

  addBtn: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },

  resetBtn: {
    backgroundColor: "#EF4444",
    padding: 18,
    borderRadius: 15,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});