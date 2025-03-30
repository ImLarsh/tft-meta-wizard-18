
import { TFTComp } from './comps';

// This is a sample comp that will be used if no comps are found in the database
export const initialComps: TFTComp[] = [
  {
    id: "sample-comp-1",
    name: "Sample Comp",
    tier: "B",
    description: "This is a sample composition. You can edit or delete it, or create your own.",
    playstyle: "Standard",
    difficulty: "Easy",
    patch: "14.1",
    earlyGame: [
      { name: "Lulu", cost: 1 },
      { name: "Tristana", cost: 1 },
      { name: "Varus", cost: 2 }
    ],
    finalComp: [
      { name: "Lulu", cost: 1, position: null },
      { name: "Tristana", cost: 1, position: null, isCarry: true, items: ["Infinity Edge", "Last Whisper", "Guardian Angel"] },
      { name: "Varus", cost: 2, position: null },
      { name: "Lissandra", cost: 3, position: null },
      { name: "Sejuani", cost: 4, position: null },
      { name: "Yasuo", cost: 5, position: null, items: ["Blue Buff", "Jeweled Gauntlet"] }
    ],
    keyItems: ["Infinity Edge", "Last Whisper", "Blue Buff"],
    traits: [
      { name: "Gunslinger", count: 4 },
      { name: "Slayer", count: 2 },
      { name: "Bruiser", count: 2 }
    ],
    strengthsWeaknesses: {
      strengths: ["Strong early game", "Good item flexibility", "Easy to play"],
      weaknesses: ["Falls off late game", "Contested in higher ranks", "Weak against heavy CC teams"]
    }
  }
];
