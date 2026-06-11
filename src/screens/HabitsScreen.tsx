import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  useFocusEffect
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Habit {
  id: number;
  name: string;
  completed: boolean;
}

export default function HabitsScreen() {
  const [habitText, setHabitText] =
    useState("");

  const [habits, setHabits] =
    useState<Habit[]>([
      {
        id: 1,
        name: "Reading",
        completed: false,
      },
      {
        id: 2,
        name: "Meditation",
        completed: false,
      },
      {
        id: 3,
        name: "Walking",
        completed: false,
      },
    ]);

 useFocusEffect(
  useCallback(() => {
    loadHabits();
  }, [])
);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const saveHabits = async () => {
    await AsyncStorage.setItem(
      "habits",
      JSON.stringify(habits)
    );
  };

  const loadHabits = async () => {
    const saved =
      await AsyncStorage.getItem(
        "habits"
      );

    if (saved) {
      setHabits(JSON.parse(saved));
    }
  };

  const addHabit = () => {
    if (!habitText.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: habitText,
      completed: false,
    };

    setHabits([
      ...habits,
      newHabit,
    ]);

    setHabitText("");
  };

  const toggleHabit = (
    id: number
  ) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed:
                !habit.completed,
            }
          : habit
      )
    );
  };

  const deleteHabit = (
    id: number
  ) => {
    setHabits(
      habits.filter(
        (habit) =>
          habit.id !== id
      )
    );
  };

  const completed =
    habits.filter(
      (h) => h.completed
    ).length;

  const progress =
    habits.length > 0
      ? (completed /
          habits.length) *
        100
      : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.hero}>
        <Text
          style={styles.heroTitle}
        >
          📋 Habit Tracker
        </Text>

        <Text
          style={
            styles.heroSubtitle
          }
        >
          Build healthy routines
        </Text>
      </View>

      <View style={styles.card}>
        <Text
          style={styles.progressTitle}
        >
          Today's Progress
        </Text>

        <Text
          style={styles.progressCount}
        >
          {completed} /{" "}
          {habits.length}
        </Text>

        <View
          style={
            styles.progressBg
          }
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
          {Math.round(
            progress
          )}
          %
        </Text>
      </View>

      <View style={styles.addCard}>
        <TextInput
          placeholder="Add New Habit"
          value={habitText}
          onChangeText={
            setHabitText
          }
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={addHabit}
        >
          <Text
            style={
              styles.btnText
            }
          >
            Add Habit
          </Text>
        </TouchableOpacity>
      </View>

      {habits.map((habit) => (
        <View
          key={habit.id}
          style={styles.habitCard}
        >
          <TouchableOpacity
            onPress={() =>
              toggleHabit(
                habit.id
              )
            }
            style={
              styles.habitLeft
            }
          >
            <Text
              style={
                styles.checkbox
              }
            >
              {habit.completed
                ? "✅"
                : "⬜"}
            </Text>

            <Text
              style={
                styles.habitText
              }
            >
              {habit.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              deleteHabit(
                habit.id
              )
            }
          >
            <Text
              style={
                styles.delete
              }
            >
              🗑️
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      "#F3F4F6",
    padding: 20,
  },

  hero: {
    backgroundColor:
      "#10B981",
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
    color: "#D1FAE5",
    marginTop: 5,
  },

  card: {
    backgroundColor:
      "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  progressTitle: {
    textAlign: "center",
    color: "#666",
  },

  progressCount: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
  },

  progressBg: {
    height: 15,
    backgroundColor:
      "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor:
      "#10B981",
  },

  percent: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },

  addCard: {
    backgroundColor:
      "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor:
      "#E5E7EB",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },

  addBtn: {
    backgroundColor:
      "#10B981",
    padding: 15,
    borderRadius: 15,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  habitCard: {
    backgroundColor:
      "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,

    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  habitLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    fontSize: 24,
    marginRight: 10,
  },

  habitText: {
    fontSize: 18,
  },

  delete: {
    fontSize: 20,
  },
});