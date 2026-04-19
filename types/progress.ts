export interface ModuleProgress {
  completed_lessons: string[];
  quiz_scores: Record<string, number>;
  started_at: string;
  completed_at?: string | null;
}
