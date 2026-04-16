export interface LevelInfo {
  level: number;
  nameKey: string;
  minXp: number;
}

// XP thresholds from spec §5.2
export const LEVELS: LevelInfo[] = [
  { level: 1, nameKey: "novice", minXp: 0 },
  { level: 2, nameKey: "apprentice", minXp: 100 },
  { level: 3, nameKey: "explorer", minXp: 300 },
  { level: 4, nameKey: "defender", minXp: 600 },
  { level: 5, nameKey: "guardian", minXp: 1000 },
  { level: 6, nameKey: "sentinel", minXp: 1500 },
  { level: 7, nameKey: "protector", minXp: 2200 },
  { level: 8, nameKey: "champion", minXp: 3000 },
  { level: 9, nameKey: "master", minXp: 4000 },
  { level: 10, nameKey: "legend", minXp: 5200 },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getXpForNextLevel(xp: number): { current: number; needed: number } | null {
  const level = getLevelForXp(xp);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);
  if (!nextLevel) return null;
  return { current: xp - level.minXp, needed: nextLevel.minXp - level.minXp };
}
