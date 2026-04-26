"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";
import { MOCK_MODULES } from "@/features/courses/mock-modules";
import { completedTracks } from "./tracks";
import { IssueFlow } from "./IssueFlow";

interface Props {
  /** Only show the issue flow if this module slug is part of a completed track. */
  moduleSlug: string;
}

/**
 * Mounted on the module overview page. When the learner has just finished
 * the last lesson of a track, this component surfaces the certificate
 * issue flow. If the learner ignores it, they can come back any time —
 * the state is derived from the progress store, not from a one-shot event.
 */
export function TrackCompletionDetector({ moduleSlug }: Props) {
  const t = useTranslations("certificates");
  const modules = useProgressStore((s) => s.modules);
  const [dismissed, setDismissed] = useState(false);

  const relevantTrack = useMemo(() => {
    const done = completedTracks(modules, MOCK_MODULES);
    return done.find((tr) => tr.moduleSlugs.includes(moduleSlug));
  }, [modules, moduleSlug]);

  if (!relevantTrack || dismissed) return null;

  return (
    <IssueFlow
      trackSlug={relevantTrack.slug}
      trackTitle={t(`tracks.${relevantTrack.slug}.title`)}
      onClose={() => setDismissed(true)}
    />
  );
}
