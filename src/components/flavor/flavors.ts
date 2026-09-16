export const flavors = [
  {
    id: "orange",
    name: "Orange",
    color: "#e66a00",
    bg: "#ff971c",
    words: ["Zesty", "Pure"],
    description:
      "Hand-picked Valencia oranges, pressed for the ultimate vitality and bright refreshment.",
    keywords: "orange naranja citrus valencia",
  },
  {
    id: "watermelon",
    name: "Watermelon",
    color: "#ec2878",
    bg: "#ff4899",
    words: ["Juicy", "Luscious"],
    description:
      "Sun-ripened watermelon. Sweet, juicy, and wonderfully refreshing with every sip.",
    keywords: "watermelon sandia sandía melon pink",
  },
  {
    id: "lime",
    name: "Lime",
    color: "#639a00",
    bg: "#93c81b",
    words: ["Delicious", "Tangy"],
    description:
      "Zesty, tart lime infusion. Crisp, refreshing acidity crafted to awaken your senses.",
    keywords: "lime limon limón lima green citrus",
  },
  {
    id: "blackberry",
    name: "Blackberry",
    color: "#8020df",
    bg: "#8b42e7",
    words: ["Tasty", "Refreshing"],
    description:
      "Rich wild blackberries. Bold, velvety flavor with a striking deep finish.",
    keywords: "blackberry mora berries purple",
  },
];

export type Flavor = (typeof flavors)[number];
export type FlavorPanel = "menu" | "favorites";
