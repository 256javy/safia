export interface LevelDef {
  level: number;
  xpThreshold: number;
  es: string;
  en: string;
  pt: string;
}

export const LEVELS: LevelDef[] = [
  { level: 1, xpThreshold: 0, es: "Curioso Digital", en: "Digital Curious", pt: "Curioso Digital" },
  { level: 2, xpThreshold: 100, es: "Consciente Digital", en: "Digitally Aware", pt: "Consciente Digital" },
  { level: 3, xpThreshold: 300, es: "Navegante Cauteloso", en: "Cautious Navigator", pt: "Navegante Cauteloso" },
  { level: 4, xpThreshold: 600, es: "Detective de Enlaces", en: "Link Detective", pt: "Detetive de Links" },
  { level: 5, xpThreshold: 1000, es: "Escudo Activo", en: "Active Shield", pt: "Escudo Ativo" },
  { level: 6, xpThreshold: 1500, es: "Vigía de Cuentas", en: "Account Sentinel", pt: "Vigia de Contas" },
  { level: 7, xpThreshold: 2200, es: "Guardián de Datos", en: "Data Guardian", pt: "Guardião de Dados" },
  { level: 8, xpThreshold: 3000, es: "Agente de Confianza", en: "Trusted Agent", pt: "Agente de Confiança" },
  { level: 9, xpThreshold: 4000, es: "Mentor de Seguridad", en: "Security Mentor", pt: "Mentor de Segurança" },
  { level: 10, xpThreshold: 5200, es: "Leyenda Digital", en: "Digital Legend", pt: "Lenda Digital" },
];

export function getLevelForXP(xp: number): LevelDef {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpThreshold) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = LEVELS[currentLevel.level] ?? null; // level is 1-indexed, array is 0-indexed so LEVELS[level] = next
  if (!nextLevel) return { current: xp, needed: xp, percent: 100 };
  const current = xp - currentLevel.xpThreshold;
  const needed = nextLevel.xpThreshold - currentLevel.xpThreshold;
  return { current, needed, percent: Math.min((current / needed) * 100, 100) };
}

export type BadgeRarity = "Common" | "Rare" | "Legendary";

export interface BadgeDef {
  id: string;
  nameKey: string; // i18n key under gamification.badges
  icon: string;
  rarity: BadgeRarity;
}

export const BADGES: BadgeDef[] = [
  { id: "first-step", nameKey: "firstStep", icon: "\u{1F463}", rarity: "Common" },
  { id: "steel-memory", nameKey: "steelMemory", icon: "\u{1F9E0}", rarity: "Common" },
  { id: "hawk-eye", nameKey: "hawkEye", icon: "\u{1F985}", rarity: "Common" },
  { id: "double-lock", nameKey: "doubleLock", icon: "\u{1F510}", rarity: "Common" },
  { id: "hands-on", nameKey: "handsOn", icon: "\u{1F9EA}", rarity: "Common" },
  { id: "fire-streak-3", nameKey: "fireStreak3", icon: "\u{1F525}", rarity: "Common" },
  { id: "streak-7", nameKey: "streak7", icon: "\u{26A1}", rarity: "Rare" },
  { id: "streak-30", nameKey: "streak30", icon: "\u{1F4A5}", rarity: "Legendary" },
  { id: "total-simulator", nameKey: "totalSimulator", icon: "\u{1F3AE}", rarity: "Rare" },
  { id: "five-stars", nameKey: "fiveStars", icon: "\u{2B50}", rarity: "Rare" },
  { id: "zero-repeats", nameKey: "zeroRepeats", icon: "\u{1F512}", rarity: "Rare" },
  { id: "safe-wifi", nameKey: "safeWifi", icon: "\u{1F4F6}", rarity: "Common" },
  { id: "armored-profile", nameKey: "armoredProfile", icon: "\u{1F6E1}\uFE0F", rarity: "Common" },
  { id: "no-cracks", nameKey: "noCracks", icon: "\u{1F4AF}", rarity: "Rare" },
  { id: "graduate", nameKey: "graduate", icon: "\u{1F393}", rarity: "Legendary" },
  { id: "smart-question", nameKey: "smartQuestion", icon: "\u{1F4A1}", rarity: "Common" },
];

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  Common: "border-text-muted/30",
  Rare: "border-accent/50",
  Legendary: "border-badge-gold/60",
};

export const RARITY_BG: Record<BadgeRarity, string> = {
  Common: "bg-bg-elevated/50",
  Rare: "bg-accent/10",
  Legendary: "bg-badge-gold/10",
};
