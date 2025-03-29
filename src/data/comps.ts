
// Types for the TFT Composition app

export interface Position {
  row: number;
  col: number;
}

export interface Champion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  items?: string[];
  isCarry?: boolean;
  position?: Position | null;
}

export interface Trait {
  name: string;
  count: number;
  version?: string;
}

export interface TFTComp {
  id: string;
  name: string;
  tier: 'S' | 'A' | 'B' | 'C';
  description: string;
  playstyle: 'Fast 8' | 'Slow Roll' | 'Standard' | 'Hyper Roll';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patch: string;
  tftVersion?: string;
  earlyGame: Champion[];
  finalComp: Champion[];
  keyItems: string[];
  traits: Trait[];
  positioning?: string;
  boardPositions?: boolean;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
}

// Export an empty array as the default comps
export const defaultComps: TFTComp[] = [];
