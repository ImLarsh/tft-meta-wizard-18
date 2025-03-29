
export interface ChampionTraitMap {
  [championName: string]: string[];
}

export interface PositionedChampion {
  name: string;
  position: { row: number; col: number } | null;
}

export interface ChampionCostMap {
  [championName: string]: number;
}
