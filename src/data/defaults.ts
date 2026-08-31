import type { Category, Mood } from "../types";
export const moods: Mood[] = [
  { id: "mood-great", label: "Großartig", icon: "🤩", color: "#f5aa2d" },
  { id: "mood-good", label: "Gut", icon: "😊", color: "#72b45a" },
  { id: "mood-ok", label: "Ausgeglichen", icon: "😌", color: "#5796d2" },
  { id: "mood-low", label: "Erschöpft", icon: "😮‍💨", color: "#9276c8" },
  { id: "mood-sad", label: "Traurig", icon: "😔", color: "#7181b5" },
];
export const demoCategories: Category[] = [
  {
    id: "fitness",
    name: "Wohlbefinden",
    color: "#78a95e",
    items: [
      {
        id: "water",
        name: "Wasser getrunken",
        icon: "💧",
        color: "#2d8b08",
        gamification: { enabled: true, target: 3, period: "day" },
      },
      {
        id: "outside",
        name: "Draußen gewesen",
        icon: "🌿",
        color: "#5d9f68",
        gamification: { enabled: true, target: 1, period: "day" },
      },
    ],
  },
  {
    id: "health",
    name: "Gesundheit",
    color: "#1da1ca",
    items: [
      {
        id: "fitness",
        name: "Fitnessübungen",
        icon: "🏃",
        color: "#597e08",
        gamification: { enabled: true, target: 5, period: "week" },
      },
      {
        id: "mag",
        name: "Magnesium",
        icon: "💊",
        color: "rgb(98, 168, 215)",
        gamification: { enabled: false, target: 1, period: "day" },
      },
      {
        id: "eat",
        name: "Gesundes Essen",
        icon: "🍎",
        color: "rgb(57, 57, 243)",
        gamification: { enabled: false, target: 1, period: "day" },
      },
    ],
  },
];
