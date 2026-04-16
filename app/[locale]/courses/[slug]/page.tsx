import { notFound } from "next/navigation";
import { getModule } from "@/lib/content/loader";
import { MOCK_MODULES } from "@/features/courses/mock-modules";
import { ModuleOverview } from "@/features/lesson/ModuleOverview";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;

  const manifestModule = getModule(slug);
  if (!manifestModule) return notFound();

  // Use manifest for lesson data (source of truth),
  // mock-modules for UI metadata (difficulty, estimatedMinutes, prerequisites)
  const mockMeta = MOCK_MODULES.find((m) => m.slug === slug);

  const mod = {
    slug: manifestModule.slug,
    title: manifestModule.title,
    description: manifestModule.description,
    icon: manifestModule.icon ?? "📖",
    difficulty: mockMeta?.difficulty ?? "basic",
    estimatedMinutes: mockMeta?.estimatedMinutes ?? 15,
    xpTotal: manifestModule.lessons.length * 100,
    prerequisites: mockMeta?.prerequisites ?? [],
    lessons: manifestModule.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      order: l.order,
    })),
  };

  return <ModuleOverview module={mod} />;
}
