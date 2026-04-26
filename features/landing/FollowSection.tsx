"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type SocialPlatform = {
  key: "instagram" | "tiktok" | "youtube" | "x" | "threads";
  // Placeholder URLs — point to platform homepages until @safia.app handles are real.
  href: string;
  icon: ReactNode;
};

const PLATFORMS: SocialPlatform[] = [
  {
    key: "instagram",
    href: "https://instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    href: "https://tiktok.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5v3a7.4 7.4 0 0 1-4.5-1.5v6.4a6.1 6.1 0 1 1-6.1-6.1c.3 0 .6 0 .9.1V12a3.1 3.1 0 1 0 2.2 3V3h3Z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    href: "https://youtube.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2C1.5 10.1 1.5 12 1.5 12s0 1.9.5 3.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-3.8.5-3.8s0-1.9-.5-3.8ZM10 15.3V8.7l5.5 3.3L10 15.3Z" />
      </svg>
    ),
  },
  {
    key: "x",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.7 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.9 21H1.7l7.5-8.6L1.3 3h6.5l4.6 6L17.7 3Zm-1.1 16.2h1.8L7.5 4.7H5.6l11 14.5Z" />
      </svg>
    ),
  },
  {
    key: "threads",
    href: "https://threads.net/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21c-5 0-8-3-8-9s3-9 8-9 7.6 3 8 6.5" />
        <path d="M9 13.5c0-2.2 1.5-3.5 3.5-3.5 2.4 0 3.7 1.5 3.7 3.5 0 2.5-2 4-4.7 4-1.7 0-3.5-.6-3.5-2.2 0-1.5 1.7-2.3 3.5-2.3 2.5 0 4.5 1.3 4.5 3.5" />
      </svg>
    ),
  },
];

const POSTS = ["post1", "post2", "post3"] as const;

export default function FollowSection() {
  const t = useTranslations("landing.follow");

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{t("heading")}</h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">{t("subheading")}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {PLATFORMS.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center gap-3 p-5 rounded-xl bg-bg-surface border border-accent/15 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
            >
              <span className="w-10 h-10 text-accent transition-colors group-hover:text-text-primary">
                {p.icon}
              </span>
              <div>
                <div className="font-semibold text-text-primary">{t(`${p.key}.label`)}</div>
                <div className="text-xs text-text-muted mt-0.5">{t(`${p.key}.handle`)}</div>
              </div>
              <span className="text-xs font-semibold text-accent group-hover:text-text-primary transition-colors">
                {t("ctaFollow")}
              </span>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">{t("postsHeading")}</h3>
            <span className="inline-flex items-center gap-2 self-start sm:self-end text-xs font-medium text-text-muted bg-bg-surface border border-accent/15 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {t("postsBanner")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {POSTS.map((postKey, i) => (
              <a
                key={postKey}
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden bg-bg-surface border border-accent/15 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="relative aspect-square flex items-end p-5"
                  style={{ background: "var(--gradient-accent)" }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-bg-base/30" />
                  <span className="relative inline-block text-sm font-semibold text-white bg-bg-base/70 backdrop-blur-sm rounded-lg px-3 py-2 max-w-[90%]">
                    {t(`${postKey}.title`)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-text-secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                    <span className="text-text-muted">—</span>
                  </span>
                  <span className="text-accent font-medium group-hover:text-text-primary transition-colors">
                    {t("postsCta")}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
