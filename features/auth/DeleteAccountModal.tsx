"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { useProgressStore } from "@/stores/progress-store";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const t = useTranslations("profile");
  const [deleting, setDeleting] = useState(false);
  const resetProgress = useProgressStore((s) => s.reset);

  if (!open) return null;

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (res.ok) {
        resetProgress();
        await signOut({ callbackUrl: "/" });
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-destructive/30 bg-bg-elevated p-6">
        <h3 className="mb-2 text-lg font-bold text-text-primary">
          {t("deleteTitle")}
        </h3>
        <p className="mb-6 text-sm text-text-secondary">
          {t("deleteWarning")}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg bg-bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/80 disabled:opacity-50"
          >
            {deleting ? t("deleting") : t("deleteConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
