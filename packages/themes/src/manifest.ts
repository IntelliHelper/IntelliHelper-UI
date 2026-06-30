export interface ThemeDefinition {
  id: string;
  label: string;
  description: string;
  cssFile: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: "mono",
    label: "Mono Basic",
    description: "Pure black and white — foundational minimal UI",
    cssFile: "./mono.css",
  },
  {
    id: "aurora",
    label: "Cool Aurora",
    description: "Deep navy base with cyan-violet aurora accents",
    cssFile: "./aurora.css",
  },
  {
    id: "sunset",
    label: "Warm Sunset",
    description: "Amber-coral gradients with rose-gold glass",
    cssFile: "./sunset.css",
  },
  {
    id: "frost",
    label: "Neutral Frost",
    description: "Icy slate surfaces with crystalline clarity",
    cssFile: "./frost.css",
  },
  {
    id: "ocean",
    label: "Deep Ocean",
    description: "Teal depths with bioluminescent aqua accents",
    cssFile: "./ocean.css",
  },
];

export type ThemeId = (typeof themes)[number]["id"];