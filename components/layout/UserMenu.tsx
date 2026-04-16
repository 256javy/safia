"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { useProgressStore } from "@/stores/progress-store";

export function UserMenu() {
  const t = useTranslations("auth");
  const gt = useTranslations("gamification");
  const xp = useProgressStore((s) => s.xp);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-bg-surface"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
          S
        </div>
        <span className="text-xp text-xs font-semibold">{xp} {gt("xp")}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-accent/10 bg-bg-surface p-2 shadow-lg">
          <button
            onClick={() => signOut()}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
