"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function QrCanvas({ value, size = 192 }: { value: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(ref.current, value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#000000ff", light: "#ffffffff" },
    }).catch(() => {
      /* render failed — fallback shown via text below */
    });
  }, [value, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className="rounded-md border border-accent/15 bg-white"
      aria-label="TOTP QR code"
    />
  );
}
