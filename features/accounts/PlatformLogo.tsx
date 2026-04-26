import type { Platform } from "@/stores/accounts-store";
import { PLATFORMS } from "@/features/simulator/platforms/registry";

interface Props {
  platform: Platform;
  size?: number;
  className?: string;
}

export function PlatformLogo({ platform, size = 32, className = "" }: Props) {
  const brand = PLATFORMS[platform].brandColor;
  const dim = `${size}px`;
  const style = { width: dim, height: dim, background: brand };

  switch (platform) {
    case "google":
      return (
        <span
          aria-label="Google"
          className={`inline-flex items-center justify-center rounded-full text-white font-bold ${className}`}
          style={{ width: dim, height: dim, background: "#fff" }}
        >
          <span style={{ color: "#4285f4", fontSize: size * 0.55 }}>G</span>
        </span>
      );
    case "instagram":
      return (
        <span
          aria-label="Instagram"
          className={`inline-flex items-center justify-center rounded-lg text-white font-bold ${className}`}
          style={{
            width: dim,
            height: dim,
            background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
            fontSize: size * 0.5,
          }}
        >
          ig
        </span>
      );
    case "facebook":
      return (
        <span
          aria-label="Facebook"
          className={`inline-flex items-center justify-center rounded-full text-white font-extrabold ${className}`}
          style={{ ...style, fontSize: size * 0.6 }}
        >
          f
        </span>
      );
    case "bank":
      return (
        <span
          aria-label="SecureBank"
          className={`inline-flex items-center justify-center rounded text-white font-bold ${className}`}
          style={{ ...style, fontSize: size * 0.42 }}
        >
          SB
        </span>
      );
  }
}
