"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function SimulatorTeaser() {
  const t = useTranslations("landing.simulator");

  return (
    <section className="relative px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-accent-text/80">
            {t("eyebrow")}
          </p>
          <h2
            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-secondary">
            {t("subheading")}
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-md"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Soft glow halo behind card */}
          <div
            className="absolute -inset-8 -z-10 rounded-[2rem] opacity-40 blur-2xl"
            style={{ background: "var(--gradient-accent)" }}
            aria-hidden="true"
          />

          {/* Browser chrome — flat, calm */}
          <div className="overflow-hidden rounded-2xl border border-border-subtle/80 bg-bg-surface shadow-lg">
            {/* Window dots + URL bar */}
            <div className="flex items-center gap-3 border-b border-border-subtle/60 bg-bg-elevated/80 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
              </div>
              <div className="flex-1 truncate rounded-md bg-bg-base/60 px-2.5 py-1 text-[11px] text-text-muted">
                accounts.google.com
              </div>
            </div>

            {/* Training banner */}
            <div className="bg-warning/95 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-bg-base">
              {t("banner")}
            </div>

            {/* Replica content */}
            <div className="bg-white px-8 py-10 text-center">
              <div className="mb-1 text-2xl font-medium text-gray-800">
                <span className="text-[#4285f4]">G</span>
                <span className="text-[#ea4335]">o</span>
                <span className="text-[#fbbc05]">o</span>
                <span className="text-[#4285f4]">g</span>
                <span className="text-[#34a853]">l</span>
                <span className="text-[#ea4335]">e</span>
              </div>
              <p className="mb-7 mt-2 text-sm text-gray-600">{t("signIn")}</p>

              <div className="mx-auto max-w-xs space-y-3">
                <div className="h-10 w-full rounded border border-gray-300 bg-gray-50" />
                <div className="h-10 w-full rounded border border-gray-300 bg-gray-50" />
                <div className="flex h-10 w-full items-center justify-center rounded-md bg-[#1a73e8]">
                  <span className="text-sm font-medium text-white">{t("next")}</span>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger" />
                <span>{t("redFlags")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
