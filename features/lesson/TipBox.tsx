"use client";

interface TipBoxProps {
  children: React.ReactNode;
}

export function TipBox({ children }: TipBoxProps) {
  return (
    <div className="my-6 rounded-lg border-l-4 border-accent bg-accent-muted px-5 py-4">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-accent">
        <span className="text-lg">💡</span>
        <span>Consejo</span>
      </div>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  );
}
