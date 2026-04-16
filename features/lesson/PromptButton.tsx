"use client";

import { useState } from "react";

interface PromptButtonProps {
  prompt?: string;
}

export function PromptButton({ prompt = "Explícame este tema de seguridad" }: PromptButtonProps) {
  const [open, setOpen] = useState(false);

  const encodedPrompt = encodeURIComponent(prompt);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="my-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <span>🤖</span>
        Preguntale a la IA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-xl bg-bg-surface p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              Preguntale a la IA
            </h3>
            <p className="mb-4 text-sm text-text-secondary">
              Elige un asistente para profundizar en este tema:
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://chat.openai.com/?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 text-center text-sm font-medium text-text-primary transition-colors hover:border-accent/50"
              >
                ChatGPT
              </a>
              <a
                href={`https://gemini.google.com/app?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 text-center text-sm font-medium text-text-primary transition-colors hover:border-accent/50"
              >
                Gemini
              </a>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
