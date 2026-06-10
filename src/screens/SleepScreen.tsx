import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SleepScreen() {
  const [sleepHours, setSleepHours] = useState(8);
  const [history, setHistory] = useState<number[]>([]);

  const goal = 8;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "sleepHours",
      sleepHours.toString()
    );
  }, [sleepHours]);

  const loadData = async () => {
    const savedHours =
      await AsyncStorage.getItem(
        "sleepHours"
      );

    const savedHistory =
      await AsyncStorage.getItem(
        "sleepHistory"
      );

    if (savedHours) {
      setSleepHours(Number(savedHours));
    }

    if (savedHistory) {
      setHistory(
        JSON.parse(savedHistory)
      );
    }
  };

  const saveTodaySleep = async () => {
    const updated = [
      ...history,
      sleepHours,
    ].slice(-7);

    setHistory(updated);

    await AsyncStorage.setItem(
      "sleepHistory",
      JSON.stringify(updated)
    );
  };

  const resetSleep = async () => {
    setSleepHours(0);
    setHistory([]);

    await AsyncStorage.removeItem(
      "sleepHours"
    );

    await AsyncStorage.removeItem(
      "sleepHistory"
    );
  };

  const progress = Math.min(
    (sleepHours / goal) * 100,
    100
  );

  const score = Math.min(
    Math.round(
      (sleepHours / goal) * 100
    ),
    100
  );

  const average =
    history.length > 0
      ? (
          history.reduce(
            (a, b) => a + b,
            0
          ) / history.length
        ).toFixed(1)
      : "0";

  const getMessage = () => {
    if (score >= 90)
      return "😴 Excellent Sleep";

    if (score >= 70)
      return "😊 Good Sleep";

    if (score >= 50)
      return "🙂 Fair Sleep";

    return "⚠️ Improve Sleep";
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={
        false
      }
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            🌙 Sleep Tracker
          </Text>

          <Text
            style={styles.heroSubtitle}
          >
            Improve your sleeping
            habits
          </Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.goal}>
            Daily Goal: 8 Hours
          </Text>

          <Text style={styles.hours}>
            {sleepHours} Hours
          </Text>

          <View
            style={styles.progressBg}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <Text
            style={styles.percent}
          >
            {Math.round(progress)}%
          </Text>

          <Text style={styles.score}>
            Sleep Score: {score}/100
          </Text>

          <Text
            style={styles.message}
          >
            {getMessage()}
          </Text>
        </View>

        <View
          style={styles.insightCard}
        >
          <Text
            style={styles.insightTitle}
          >
            📊 Weekly Insights
          </Text>

          <Text
            style={styles.insightText}
          >
            7-Day Average Sleep
          </Text>

          <Text
            style={styles.average}
          >
            {average} Hours
          </Text>

          <Text
            style={styles.insightText}
          >
            Entries Recorded
          </Text>

          <Text
            style={styles.average}
          >
            {history.length}
          </Text>
        </View>

        <View
          style={styles.buttonRow}
        >
          <TouchableOpacity
            style={styles.minusBtn}
            onPress={() =>
              setSleepHours(
                Math.max(
                  sleepHours - 1,
                  0
                )
              )
            }
          >
            <Text
              style={styles.btnText}
            >
              -1 Hour
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() =>
              setSleepHours(
                sleepHours + 1
              )
            }
          >
            <Text
              style={styles.btnText}
            >
              +1 Hour
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={saveTodaySleep}
        >
          <Text
            style={styles.btnText}
          >
            Save Today's Sleep
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={resetSleep}
        >
          <Text
            style={styles.btnText}
          >
            Reset Sleep Data
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
  },

  hero: {
    backgroundColor: "#4F46E5",
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
    color: "#E0E7FF",
    marginTop: 5,
  },

  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  goal: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },

  hours: {
    textAlign: "center",
    fontSize: 48,
    fontWeight: "bold",
    marginVertical: 10,
  },

  progressBg: {
    height: 15,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
  },

  percent: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18,
  },

  score: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 24,
    fontWeight: "bold",
  },

  message: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 22,
  },

  insightCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  insightTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  insightText: {
    color: "#666",
    fontSize: 16,
  },

  average: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  minusBtn: {
    backgroundColor: "#F59E0B",
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 15,
  },

  plusBtn: {
    backgroundColor: "#10B981",
    flex: 1,
    marginLeft: 10,
    padding: 15,
    borderRadius: 15,
  },

  saveBtn: {
    backgroundColor: "#4F46E5",
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