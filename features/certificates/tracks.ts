/**
 * Track catalogue — modules that earn a certificate on full completion.
 *
 * A track is not the same as a module index. VISION §5 describes the atlas
 * as the composable structure and "curated routes" as playlists layered on
 * top. For MVP we start with one track, `passwords`, mapped directly to the
 * passwords module. Future tracks will compose multiple modules and live
 * in this file.
 */

export interface Track {
  slug: string;
  /** i18n key for the track name — rendered in share cards. */
  titleKey: string;
  /** i18n key for the short description under the title. */
  descriptionKey: string;
  /** The module slugs whose completion earns this track. */
  moduleSlugs: string[];
}

export const TRACKS: Track[] = [
  {
    slug: "passwords",
    titleKey: "certificates.tracks.passwords.title",
    descriptionKey: "certificates.tracks.passwords.description",
    moduleSlugs: ["passwords"],
  },
];

export function getTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

/**
 * Given a progress store snapshot, returns the tracks the learner has
 * completed end-to-end. "Completed" = every lesson in every required
 * module is marked done.
 */
export function completedTracks(
  modules: Record<string, { lessons: Record<string, { completed: boolean }> }>,
  catalog: { slug: string; lessons: { slug: string }[] }[],
): Track[] {
  return TRACKS.filter((track) => {
    return track.moduleSlugs.every((modSlug) => {
      const mod = catalog.find((m) => m.slug === modSlug);
      if (!mod) return false;
      const progress = modules[modSlug];
      if (!progress) return false;
      return mod.lessons.every((l) => progress.lessons[l.slug]?.completed);
    });
  });
}
