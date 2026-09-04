export interface ThemeDefinition {
  id: string;
  label: string;
  description: string;
  cssFile: string;
}

/** Surface treatment, orthogonal to color theme (`data-theme`). */
export type MaterialId = "glass" | "solid";

export interface MaterialDefinition {
  id: MaterialId;
  label: string;
  description: string;
}

export const materials: MaterialDefinition[] = [
  {
    id: "glass",
    label: "Liquid Glass",
    description: "Frosted translucent chrome with backdrop blur and specular edges",
  },
  {
    id: "solid",
    label: "Solid",
    description:
      "Opaque product chrome — paper fills, no blur — IntelliHelper frontend-style UI",
  },
];

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