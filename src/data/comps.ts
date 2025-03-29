
export interface Champion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  items?: string[];
  isCarry?: boolean;
}

export interface TFTComp {
  id: string;
  name: string;
  tier: 'S' | 'A' | 'B' | 'C';
  playstyle: 'Fast 8' | 'Slow Roll' | 'Standard' | 'Hyper Roll';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  earlyGame: Champion[];
  finalComp: Champion[];
  keyItems: string[];
  traits: { name: string; count: number }[];
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  positioning?: string; // URL to positioning image
  description: string;
  patch: string;
}

const tftComps: TFTComp[] = [
  {
    id: 'disco-8bit',
    name: '8-Bit Disco',
    tier: 'S',
    playstyle: 'Fast 8',
    difficulty: 'Medium',
    earlyGame: [
      { name: 'Kennen', cost: 1 },
      { name: 'Corki', cost: 1 },
      { name: 'Poppy', cost: 1 },
      { name: 'Vex', cost: 2 },
    ],
    finalComp: [
      { name: 'Kennen', cost: 1, items: ['Ionic Spark', 'Sunfire Cape'] },
      { name: 'Garen', cost: 2 },
      { name: 'Vex', cost: 2 },
      { name: 'Miss Fortune', cost: 3, items: ['Blue Buff', 'Jeweled Gauntlet', 'Giant Slayer'], isCarry: true },
      { name: 'Sona', cost: 3 },
      { name: 'Mordekaiser', cost: 4 },
      { name: 'Ahri', cost: 4 },
      { name: 'Bard', cost: 5 },
    ],
    keyItems: ['Blue Buff', 'Jeweled Gauntlet', 'Giant Slayer', 'Ionic Spark'],
    traits: [
      { name: '8-Bit', count: 4 },
      { name: 'Disco', count: 4 },
      { name: 'Superfan', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Strong AoE damage', 'Good CC', 'Flexible positioning'],
      weaknesses: ['Item dependent', 'Weak against heavy MR comps', 'Contested comp']
    },
    description: 'This comp focuses on Miss Fortune as the main carry with 8-Bit and Disco synergies. The combination provides both AoE damage and CC, making it very strong in the current meta.',
    patch: '13.24',
  },
  {
    id: 'kda-heartsteel',
    name: 'K/DA + Heartsteel',
    tier: 'S',
    playstyle: 'Standard',
    difficulty: 'Easy',
    earlyGame: [
      { name: 'Evelynn', cost: 1 },
      { name: 'Kayle', cost: 1 },
      { name: 'Lillia', cost: 2 },
      { name: 'Sett', cost: 2 },
    ],
    finalComp: [
      { name: 'Evelynn', cost: 1 },
      { name: 'Kayle', cost: 1, items: ['Bloodthirster', 'Runaan\'s Hurricane'] },
      { name: 'Lillia', cost: 2 },
      { name: 'Sett', cost: 2 },
      { name: 'Samira', cost: 3 },
      { name: 'Akali', cost: 4, items: ['Infinity Edge', 'Last Whisper', 'Bloodthirster'], isCarry: true },
      { name: 'Seraphine', cost: 4 },
      { name: 'Yone', cost: 4 },
    ],
    keyItems: ['Infinity Edge', 'Last Whisper', 'Bloodthirster'],
    traits: [
      { name: 'K/DA', count: 4 },
      { name: 'Heartsteel', count: 4 },
      { name: 'Crowd Diver', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['High single-target damage', 'Good frontline', 'Consistent performance'],
      weaknesses: ['Weak against heavy armor comps', 'Struggles against heavy CC']
    },
    description: 'A powerful comp that utilizes Akali as the main carry with K/DA and Heartsteel synergies. The combination provides a good balance of damage and durability.',
    patch: '13.24',
  },
  {
    id: 'illbeats-edm',
    name: 'Illbeats EDM',
    tier: 'A',
    playstyle: 'Slow Roll',
    difficulty: 'Medium',
    earlyGame: [
      { name: 'Taric', cost: 1 },
      { name: 'Gragas', cost: 1 },
      { name: 'Jax', cost: 2 },
      { name: 'Vi', cost: 2 },
    ],
    finalComp: [
      { name: 'Taric', cost: 1 },
      { name: 'Gragas', cost: 1 },
      { name: 'Jax', cost: 2, items: ['Titan\'s Resolve', 'Bloodthirster', 'Quicksilver'] },
      { name: 'Vi', cost: 2 },
      { name: 'Lux', cost: 3 },
      { name: 'Illaoi', cost: 3, items: ['Warmog\'s Armor', 'Dragon\'s Claw', 'Gargoyle Stoneplate'], isCarry: true },
      { name: 'Zac', cost: 4 },
      { name: 'Yorick', cost: 5 },
    ],
    keyItems: ['Titan\'s Resolve', 'Warmog\'s Armor', 'Dragon\'s Claw'],
    traits: [
      { name: 'Illbeats', count: 3 },
      { name: 'EDM', count: 3 },
      { name: 'Bruiser', count: 4 },
    ],
    strengthsWeaknesses: {
      strengths: ['Very tanky', 'Good sustain', 'Strong against burst comps'],
      weaknesses: ['Lower damage output', 'Weak against percent health damage', 'Can time out']
    },
    description: 'This comp focuses on survivability through the Bruiser trait and Illaoi as a tank carry. It excels in longer fights where it can outlast opponents.',
    patch: '13.24',
  },
  {
    id: 'pentakill-country',
    name: 'Pentakill Country',
    tier: 'A',
    playstyle: 'Fast 8',
    difficulty: 'Hard',
    earlyGame: [
      { name: 'Olaf', cost: 1 },
      { name: 'Tahm Kench', cost: 1 },
      { name: 'Karthus', cost: 2 },
      { name: 'Senna', cost: 3 },
    ],
    finalComp: [
      { name: 'Olaf', cost: 1 },
      { name: 'Tahm Kench', cost: 1 },
      { name: 'Karthus', cost: 2, items: ['Spear of Shojin', 'Jeweled Gauntlet', 'Archangel\'s Staff'], isCarry: true },
      { name: 'Senna', cost: 3 },
      { name: 'Viego', cost: 3 },
      { name: 'Kayn', cost: 4 },
      { name: 'Yorick', cost: 5 },
      { name: 'Mordekaiser', cost: 4 },
    ],
    keyItems: ['Spear of Shojin', 'Jeweled Gauntlet', 'Archangel\'s Staff'],
    traits: [
      { name: 'Pentakill', count: 5 },
      { name: 'Country', count: 3 },
      { name: 'Guardian', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Ramping damage', 'Good frontline', 'Strong late game'],
      weaknesses: ['Weak early game', 'Item dependent', 'Hard to hit all key units']
    },
    description: 'A powerful late-game composition that focuses on Karthus as the main carry with Pentakill synergy. Requires good economy management to reach level 8 quickly.',
    patch: '13.24',
  },
  {
    id: 'jazz-punk',
    name: 'Jazz & Punk',
    tier: 'B',
    playstyle: 'Standard',
    difficulty: 'Easy',
    earlyGame: [
      { name: 'Annie', cost: 1 },
      { name: 'Jinx', cost: 1 },
      { name: 'Twitch', cost: 2 },
      { name: 'Urgot', cost: 2 },
    ],
    finalComp: [
      { name: 'Annie', cost: 1 },
      { name: 'Jinx', cost: 1, items: ['Guinsoo\'s Rageblade', 'Giant Slayer', 'Infinity Edge'], isCarry: true },
      { name: 'Twitch', cost: 2 },
      { name: 'Urgot', cost: 2 },
      { name: 'Ekko', cost: 3 },
      { name: 'Lucian', cost: 3 },
      { name: 'Pantheon', cost: 4 },
      { name: 'Jhin', cost: 4 },
    ],
    keyItems: ['Guinsoo\'s Rageblade', 'Giant Slayer', 'Infinity Edge'],
    traits: [
      { name: 'Jazz', count: 3 },
      { name: 'Punk', count: 4 },
      { name: 'Big Shot', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Fast attack speed', 'Good sustained damage', 'Flexible positioning'],
      weaknesses: ['Squishy carries', 'Weak against assassins', 'Item dependent']
    },
    description: 'A composition that focuses on Jinx as the main carry with Jazz and Punk synergies. This comp requires good positioning to protect Jinx while she ramps up her attack speed.',
    patch: '13.24',
  },
];

export default tftComps;
