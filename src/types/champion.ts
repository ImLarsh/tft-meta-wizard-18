
import { Position } from '@/data/comps';

// Define the shape of the champion trait mapping
export interface ChampionTraitMap {
  [championName: string]: string[];
}

// Extended champion with position for the board
export interface PositionedChampion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  items?: string[];
  isCarry?: boolean;
  position: Position | null;
}

// Default empty trait mapping
export const defaultChampionTraitMap: ChampionTraitMap = {};
