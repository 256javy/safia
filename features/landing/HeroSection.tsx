"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const particles = [
  { delay: 0, x: "10%", y: "20%", size: 6 },
  { delay: 0.5, x: "80%", y: "30%", size: 4 },
  { delay: 1, x: "25%", y: "70%", size: 8 },
  { delay: 1.5, x: "70%", y: "60%", size: 5 },
  { delay: 2, x: "50%", y: "40%", size: 7 },
  { delay: 0.8, x: "90%", y: "80%", size: 4 },
  { delay: 1.2, x: "15%", y: "50%", size: 6 },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
} as const;

export default function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight gradient-text leading-tight"
          variants={fadeUp}
        >
          {t("title")}
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed"
          variants={fadeUp}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeUp}
        >
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: "var(--gradient-accent)" }}
          >
            {t("cta")}
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-text-secondary text-base border border-accent/30 bg-bg-surface/50 backdrop-blur-sm transition-all duration-200 hover:border-accent/60 hover:text-text-primary"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
