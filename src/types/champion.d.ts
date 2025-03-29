
export interface ChampionTraitMap {
  [championName: string]: string[];
}

export interface PositionedChampion extends Champion {
  position: {
    row: number;
    col: number;
  } | null;
}
