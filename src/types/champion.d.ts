
export interface ChampionTraitMap {
  [championName: string]: string[];
}

export interface PositionedChampion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  items?: string[];
  isCarry?: boolean;
  position: {
    row: number;
    col: number;
  } | null;
}

export interface Champion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  items?: string[];
  isCarry?: boolean;
  position: {
    row: number;
    col: number;
  } | null;
}
