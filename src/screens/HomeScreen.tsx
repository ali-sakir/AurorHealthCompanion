import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const cards = [
    {
      icon: "💧",
      title: "Hydration",
      subtitle: "Track your daily water intake",
      color: "#DDF5FF",
    },
    {
      icon: "🥗",
      title: "Nutrition",
      subtitle: "Monitor calories and nutrition",
      color: "#EAFBEA",
    },
    {
      icon: "🌙",
      title: "Sleep",
      subtitle: "Improve your sleeping habits",
      color: "#EFE7FF",
    },
    {
      icon: "👟",
      title: "Habits",
      subtitle: "Build healthy routines",
      color: "#FFF4E5",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.logo}>A</Text>

        <Text style={styles.title}>
          Aurora Health Companion
        </Text>

        <TouchableOpacity style={styles.aiBar}>
          <Text style={styles.aiText}>
            Ask Aurora AI
          </Text>

          <Text style={styles.mic}>
            🎤
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feature Cards */}

      {cards.map((card) => (
        <TouchableOpacity
          key={card.title}
          style={[
            styles.card,
            { backgroundColor: card.color },
          ]}
        >
          <Text style={styles.cardIcon}>
            {card.icon}
          </Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {card.title}
            </Text>

            <Text style={styles.cardSubtitle}>
              {card.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: "#3B82F6",
    paddingTop: 60,
    paddingBottom: 35,
    paddingHorizontal: 20,

    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  logo: {
    fontSize: 60,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },

  aiBar: {
    backgroundColor: "rgba(255,255,255,0.25)",

    borderRadius: 20,

    paddingHorizontal: 18,
    paddingVertical: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  mic: {
    fontSize: 20,
  },

  card: {
    marginHorizontal: 20,
    marginTop: 18,

    borderRadius: 22,

    padding: 18,

    flexDirection: "row",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  cardIcon: {
    fontSize: 40,
    marginRight: 15,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  cardSubtitle: {
    color: "#666",
    marginTop: 4,
    fontSize: 14,
  },
});