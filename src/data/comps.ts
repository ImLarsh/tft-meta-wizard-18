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
  {
    id: 'true-damage-kda',
    name: 'True Damage + K/DA',
    tier: 'S',
    playstyle: 'Fast 8',
    difficulty: 'Medium',
    earlyGame: [
      { name: 'Evelynn', cost: 1 },
      { name: 'Kennen', cost: 1 },
      { name: 'Yasuo', cost: 2 },
      { name: 'Senna', cost: 3 },
    ],
    finalComp: [
      { name: 'Kennen', cost: 1 },
      { name: 'Evelynn', cost: 1 },
      { name: 'Yasuo', cost: 2 },
      { name: 'Senna', cost: 3, items: ['Giant Slayer', 'Infinity Edge', 'Last Whisper'] },
      { name: 'Ekko', cost: 3, items: ['Sunfire Cape', 'Warmog\'s Armor'] },
      { name: 'Akali', cost: 4, items: ['Blue Buff', 'Jeweled Gauntlet', 'Infinity Edge'], isCarry: true },
      { name: 'Qiyana', cost: 4 },
      { name: 'Kayn', cost: 4 },
    ],
    keyItems: ['Blue Buff', 'Jeweled Gauntlet', 'Infinity Edge', 'Giant Slayer'],
    traits: [
      { name: 'True Damage', count: 4 },
      { name: 'K/DA', count: 3 },
      { name: 'Crowd Diver', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['High burst damage', 'Strong mid-game', 'Good against backline comps'],
      weaknesses: ['Struggles against tanky comps', 'Akali dependent', 'Contested units']
    },
    description: 'This comp focuses on Akali as your primary carry with True Damage and K/DA synergies. Look to 3-star Akali if possible, but a 2-star with the right items is still very powerful.',
    patch: '13.24',
  },
  {
    id: 'hyperpop-8bit',
    name: 'Hyperpop 8-Bit',
    tier: 'A',
    playstyle: 'Standard',
    difficulty: 'Medium',
    earlyGame: [
      { name: 'Corki', cost: 1 },
      { name: 'Kennen', cost: 1 },
      { name: 'Lulu', cost: 2 },
      { name: 'Neeko', cost: 3 },
    ],
    finalComp: [
      { name: 'Corki', cost: 1 },
      { name: 'Kennen', cost: 1 },
      { name: 'Lulu', cost: 2, items: ['Redemption', 'Chalice of Power'] },
      { name: 'Neeko', cost: 3, items: ['Warmog\'s Armor', 'Dragon\'s Claw'] },
      { name: 'Ziggs', cost: 3, items: ['Spear of Shojin', 'Jeweled Gauntlet', 'Infinity Edge'], isCarry: true },
      { name: 'Lux', cost: 3 },
      { name: 'Bard', cost: 5 },
      { name: 'Ahri', cost: 4 },
    ],
    keyItems: ['Spear of Shojin', 'Jeweled Gauntlet', 'Infinity Edge', 'Redemption'],
    traits: [
      { name: '8-Bit', count: 4 },
      { name: 'Hyperpop', count: 3 },
      { name: 'Superfan', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Strong AoE damage', 'Good frontline with Neeko', 'Scales well into late game'],
      weaknesses: ['Item dependent', 'Weak early game', 'Vulnerable to assassins']
    },
    description: 'This comp utilizes Ziggs as the main carry with 8-Bit and Hyperpop synergies for massive AoE damage. Focus on positioning to protect Ziggs and let him cast multiple times.',
    patch: '13.24',
  },
  {
    id: 'country-maestro',
    name: 'Country Maestro',
    tier: 'A',
    playstyle: 'Slow Roll',
    difficulty: 'Easy',
    earlyGame: [
      { name: 'Tahm Kench', cost: 1 },
      { name: 'Twisted Fate', cost: 1 },
      { name: 'Taric', cost: 1 },
      { name: 'Senna', cost: 3 },
    ],
    finalComp: [
      { name: 'Tahm Kench', cost: 1 },
      { name: 'Twisted Fate', cost: 1, items: ['Spear of Shojin', 'Jeweled Gauntlet', 'Giant Slayer'], isCarry: true },
      { name: 'Taric', cost: 1, items: ['Warmog\'s Armor', 'Redemption'] },
      { name: 'Senna', cost: 3 },
      { name: 'Lucian', cost: 3 },
      { name: 'Thresh', cost: 3 },
      { name: 'Caitlyn', cost: 4 },
      { name: 'Jhin', cost: 4 },
    ],
    keyItems: ['Spear of Shojin', 'Jeweled Gauntlet', 'Giant Slayer', 'Warmog\'s Armor'],
    traits: [
      { name: 'Country', count: 4 },
      { name: 'Maestro', count: 2 },
      { name: 'Guardian', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Strong frontline', 'Consistent damage', 'Easy to play'],
      weaknesses: ['3-star TF dependent', 'Falls off late game', 'Weak against high burst']
    },
    description: 'A powerful mid-game composition that focuses on 3-starring Twisted Fate as your main carry. The Country trait provides good utility and sustain while Maestro enhances your spellcasting.',
    patch: '13.24',
  },
  {
    id: 'pentakill-edm',
    name: 'Pentakill EDM',
    tier: 'S',
    playstyle: 'Fast 8',
    difficulty: 'Hard',
    earlyGame: [
      { name: 'Olaf', cost: 1 },
      { name: 'Jax', cost: 2 },
      { name: 'Karthus', cost: 2 },
      { name: 'Viego', cost: 3 },
    ],
    finalComp: [
      { name: 'Olaf', cost: 1 },
      { name: 'Jax', cost: 2, items: ['Titan\'s Resolve', 'Bloodthirster', 'Quicksilver'] },
      { name: 'Karthus', cost: 2 },
      { name: 'Viego', cost: 3 },
      { name: 'Mordekaiser', cost: 4, items: ['Archangel\'s Staff', 'Jeweled Gauntlet', 'Hextech Gunblade'], isCarry: true },
      { name: 'Kayn', cost: 4 },
      { name: 'Yorick', cost: 5 },
      { name: 'Zac', cost: 4, items: ['Warmog\'s Armor', 'Dragon\'s Claw'] },
    ],
    keyItems: ['Archangel\'s Staff', 'Jeweled Gauntlet', 'Hextech Gunblade', 'Titan\'s Resolve'],
    traits: [
      { name: 'Pentakill', count: 6 },
      { name: 'EDM', count: 2 },
      { name: 'Bruiser', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Massive AoE damage', 'Strong frontline', 'Excellent late game'],
      weaknesses: ['Expensive composition', 'Weak early game', 'Hard to position correctly']
    },
    description: 'This comp revolves around Mordekaiser as your main carry with Pentakill synergy. The 6 Pentakill bonus grants massive damage boosts, making Mordekaiser an unstoppable force in the late game.',
    patch: '13.24',
  },
  {
    id: 'disco-punk',
    name: 'Disco Punk',
    tier: 'B',
    playstyle: 'Hyper Roll',
    difficulty: 'Medium',
    earlyGame: [
      { name: 'Jinx', cost: 1 },
      { name: 'Twitch', cost: 2 },
      { name: 'Urgot', cost: 2 },
      { name: 'Miss Fortune', cost: 3 },
    ],
    finalComp: [
      { name: 'Jinx', cost: 1, items: ['Guinsoo\'s Rageblade', 'Runaan\'s Hurricane', 'Infinity Edge'], isCarry: true },
      { name: 'Twitch', cost: 2 },
      { name: 'Urgot', cost: 2 },
      { name: 'Miss Fortune', cost: 3, items: ['Spear of Shojin', 'Blue Buff'] },
      { name: 'Vex', cost: 2 },
      { name: 'Garen', cost: 2 },
      { name: 'Sona', cost: 3 },
      { name: 'Ekko', cost: 3 },
    ],
    keyItems: ['Guinsoo\'s Rageblade', 'Runaan\'s Hurricane', 'Infinity Edge', 'Spear of Shojin'],
    traits: [
      { name: 'Disco', count: 4 },
      { name: 'Punk', count: 4 },
      { name: 'Big Shot', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Strong early game', 'Good transition options', 'High attack speed'],
      weaknesses: ['Falls off late game', 'Squishy carries', 'Positioning dependent']
    },
    description: 'A strong early to mid-game composition focused on 3-star Jinx as your main carry. This comp can snowball hard if you hit your 3-stars early, but has options to transition if you don\'t.',
    patch: '13.24',
  },
  {
    id: 'heartsteel-emo',
    name: 'Heartsteel Emo',
    tier: 'S',
    playstyle: 'Standard',
    difficulty: 'Medium',
    earlyGame: [
      { name: 'Annie', cost: 1 },
      { name: 'Evelynn', cost: 1 },
      { name: 'Lillia', cost: 2 },
      { name: 'Sett', cost: 2 },
    ],
    finalComp: [
      { name: 'Annie', cost: 1 },
      { name: 'Evelynn', cost: 1 },
      { name: 'Lillia', cost: 2, items: ['Warmog\'s Armor', 'Gargoyle Stoneplate'] },
      { name: 'Sett', cost: 2 },
      { name: 'Amumu', cost: 3, items: ['Sunfire Cape', 'Bramble Vest'] },
      { name: 'Yone', cost: 4, items: ['Bloodthirster', 'Giant Slayer', 'Infinity Edge'], isCarry: true },
      { name: 'Aphelios', cost: 4 },
      { name: 'Kayle', cost: 1 },
    ],
    keyItems: ['Bloodthirster', 'Giant Slayer', 'Infinity Edge', 'Warmog\'s Armor'],
    traits: [
      { name: 'Heartsteel', count: 5 },
      { name: 'Emo', count: 3 },
      { name: 'Edgelord', count: 2 },
    ],
    strengthsWeaknesses: {
      strengths: ['Excellent sustain', 'Strong frontline', 'Consistent damage'],
      weaknesses: ['Yone dependent', 'Contested units', 'Weak against heavy CC']
    },
    description: 'This comp builds around Yone as your main carry with Heartsteel and Emo synergies. The combination provides excellent sustain and damage, making it a strong all-around composition.',
    patch: '13.24',
  },
];

export default tftComps;
