export const Colors = {
  primary: "#2ebba8",
  secondary: "#5b8dee",
  accent: "#a855f7",

  gradientHero: ["#0f172a", "#1e3a5f", "#0e7490"] as const,
  gradientButton: ["#2ebba8", "#5b8dee", "#a855f7"] as const,
  gradientWater: ["#0ea5e9", "#2ebba8"] as const,
  gradientSleep: ["#4f46e5", "#7c3aed"] as const,
  gradientNutrition: ["#f97316", "#ef4444"] as const,
  gradientHabits: ["#10b981", "#2ebba8"] as const,
  gradientAI: ["#7c3aed", "#a855f7"] as const,
  gradientProfile: ["#5b8dee", "#4f46e5"] as const,

  background: "#F4F7FB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  inputBg: "#F9FAFB",

  textPrimary: "#0f172a",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textWhite: "#FFFFFF",

  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
};

export const Shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: "#2ebba8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};
