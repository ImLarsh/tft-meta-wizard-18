
export interface Champion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  items?: string[];
  isCarry?: boolean;
  position?: { row: number; col: number } | null;
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
  playstyle: 'Fast 8' | 'Slow Roll' | 'Standard' | 'Hyper Roll';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  patch: string;
  tftVersion?: string;
  earlyGame: Champion[];
  finalComp: Champion[];
  keyItems: string[];
  traits: Trait[];
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  positioning?: string;
  boardPositions?: boolean;
}

// No predefined comps - they've all been removed as requested
export const initialComps: TFTComp[] = [];
