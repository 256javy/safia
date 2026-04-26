"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const trustKeys = [
  { icon: "\u{1F513}", key: "noAccount" },
  { icon: "\u{1F4D6}", key: "openSource" },
  { icon: "\u{1F6AB}", key: "noAds" },
  { icon: "\u{1F4AF}", key: "free" },
] as const;

export default function TrustBar() {
  const t = useTranslations("landing.trust");

  return (
    <section className="border-y border-border-subtle/60 bg-bg-subtle/40 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <motion.ul
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {trustKeys.map(({ icon, key }) => (
            <li
              key={key}
              className="flex items-center gap-2.5 text-text-secondary"
            >
              <span className="text-base leading-none opacity-90" aria-hidden="true">
                {icon}
              </span>
              <span className="text-[0.8125rem] font-medium tracking-wide">
                {t(key)}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
