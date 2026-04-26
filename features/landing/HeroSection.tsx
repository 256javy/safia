"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/15"
      style={{ left: x, top: y, width: size, height: size, filter: "blur(0.5px)" }}
      animate={{
        y: [0, -12, 0],
        opacity: [0.15, 0.4, 0.15],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const particles = [
  { delay: 0, x: "12%", y: "22%", size: 5 },
  { delay: 0.7, x: "82%", y: "28%", size: 4 },
  { delay: 1.4, x: "26%", y: "72%", size: 6 },
  { delay: 2.1, x: "72%", y: "62%", size: 4 },
  { delay: 1.0, x: "88%", y: "78%", size: 3 },
  { delay: 1.7, x: "16%", y: "48%", size: 5 },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
} as const;

export default function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section
      className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden px-6 py-24"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Soft halo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: "var(--gradient-soft)" }}
        aria-hidden="true"
      />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* Center radial wash */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-bg-surface/40 px-3 py-1 text-xs font-medium text-accent-text backdrop-blur-sm"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {t("eyebrow")}
        </motion.div>

        <motion.h1
          className="gradient-text text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          variants={fadeUp}
          style={{ letterSpacing: "-0.02em" }}
        >
          {t("title")}
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl"
          variants={fadeUp}
        >
          {t("subtitle")}
        </motion.p>

        <motion.p
          className="mx-auto mt-3 max-w-md text-sm text-text-muted"
          variants={fadeUp}
        >
          {t("audience")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
          variants={fadeUp}
        >
          <Link
            href="/accounts"
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:shadow-glow-strong"
            style={{ background: "var(--gradient-accent)" }}
          >
            {t("cta")}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            href="/simulator/google"
            className="inline-flex items-center justify-center rounded-xl border border-accent/25 bg-bg-surface/40 px-7 py-3.5 text-base font-semibold text-text-secondary backdrop-blur-sm transition-all duration-200 hover:border-accent/50 hover:bg-bg-surface/60 hover:text-text-primary"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
