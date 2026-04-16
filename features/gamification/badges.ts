export interface BadgeInfo {
  id: string;
  nameKey: string;
  icon: string;
  descriptionKey: string;
}

export const BADGES: BadgeInfo[] = [
  { id: "first-lesson", nameKey: "firstLesson", icon: "📖", descriptionKey: "firstLessonDesc" },
  { id: "first-module", nameKey: "firstModule", icon: "🎓", descriptionKey: "firstModuleDesc" },
  { id: "passwords-complete", nameKey: "passwordsComplete", icon: "🔑", descriptionKey: "passwordsCompleteDesc" },
  { id: "phishing-complete", nameKey: "phishingComplete", icon: "🎣", descriptionKey: "phishingCompleteDesc" },
  { id: "mfa-complete", nameKey: "mfaComplete", icon: "🛡️", descriptionKey: "mfaCompleteDesc" },
  { id: "social-eng-complete", nameKey: "socialEngComplete", icon: "🎭", descriptionKey: "socialEngCompleteDesc" },
  { id: "wifi-complete", nameKey: "wifiComplete", icon: "📡", descriptionKey: "wifiCompleteDesc" },
  { id: "simulator-first", nameKey: "simulatorFirst", icon: "⚔️", descriptionKey: "simulatorFirstDesc" },
  { id: "streak-7", nameKey: "streak7", icon: "🔥", descriptionKey: "streak7Desc" },
  { id: "streak-30", nameKey: "streak30", icon: "💎", descriptionKey: "streak30Desc" },
  { id: "xp-500", nameKey: "xp500", icon: "⭐", descriptionKey: "xp500Desc" },
  { id: "xp-1000", nameKey: "xp1000", icon: "🌟", descriptionKey: "xp1000Desc" },
  { id: "xp-2000", nameKey: "xp2000", icon: "💫", descriptionKey: "xp2000Desc" },
  { id: "all-basic", nameKey: "allBasic", icon: "🏅", descriptionKey: "allBasicDesc" },
  { id: "all-intermediate", nameKey: "allIntermediate", icon: "🏆", descriptionKey: "allIntermediateDesc" },
  { id: "completionist", nameKey: "completionist", icon: "👑", descriptionKey: "completionistDesc" },
];
