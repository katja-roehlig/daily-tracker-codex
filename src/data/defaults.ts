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
    id: "health",
    name: "Wohlbefinden",
    color: "#78a95e",
    items: [
      {
        id: "water",
        name: "Wasser getrunken",
        icon: "💧",
        color: "#4a9dd8",
        gamification: { enabled: true, target: 3, period: "day" },
      },
      {
        id: "outside",
        name: "Draußen gewesen",
        icon: "🌿",
        color: "#5d9f68",
        gamification: { enabled: true, target: 1, period: "day" },
      },
      {
        id: "fitness",
        name: "Fitnessübungen",
        icon: "🏃",
        color: "#d86d64",
        gamification: { enabled: true, target: 5, period: "week" },
      },
    ],
  },
  {
    id: "cat",
    name: "Katze 1",
    color: "#d78862",
    items: [
      {
        id: "eats",
        name: "Frisst gut",
        icon: "🥣",
        color: "#d78862",
        gamification: { enabled: false, target: 1, period: "day" },
      },
      {
        id: "hairball",
        name: "Kotzt Fell",
        icon: "🐈",
        color: "#b777bc",
        gamification: { enabled: false, target: 1, period: "day" },
      },
      {
        id: "food-vomit",
        name: "Kotzt Futter",
        icon: "🤢",
        color: "#de7871",
        gamification: { enabled: false, target: 1, period: "day" },
      },
    ],
  },
];
