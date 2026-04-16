import type { SimStep } from "./SimulatorShell";

export interface PlatformConfig {
  id: string;
  icon: string;
  steps: SimStep[];
  renderChrome: (step: number) => React.ReactNode;
}

function GoogleChrome({ step }: { step: number }) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-lg">
      <div className="text-2xl font-medium text-gray-800 mb-1">
        <span className="text-[#4285f4]">G</span>
        <span className="text-[#ea4335]">o</span>
        <span className="text-[#fbbc05]">o</span>
        <span className="text-[#4285f4]">g</span>
        <span className="text-[#34a853]">l</span>
        <span className="text-[#ea4335]">e</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {step === 3 ? "Verification successful" : "Sign in"}
      </p>
    </div>
  );
}

function FacebookChrome() {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-lg">
      <div className="text-3xl font-bold text-[#1877f2] mb-1">facebook</div>
      <p className="text-sm text-gray-500">Log in to your account</p>
    </div>
  );
}

function XChrome() {
  return (
    <div className="rounded-xl bg-black p-6 text-center shadow-lg">
      <div className="text-3xl font-bold text-white mb-1">𝕏</div>
      <p className="text-sm text-gray-400">Sign in to X</p>
    </div>
  );
}

function TikTokChrome() {
  return (
    <div className="rounded-xl bg-black p-6 text-center shadow-lg">
      <div className="text-2xl font-bold text-white mb-1">
        <span className="text-[#69c9d0]">Tik</span>
        <span className="text-white">Tok</span>
      </div>
      <p className="text-sm text-gray-400">Log in</p>
    </div>
  );
}

function BankingChrome({ step }: { step: number }) {
  const labels = ["Sign in", "Device check", "Security", "Confirm", "Summary"];
  return (
    <div className="rounded-xl bg-[#0a2540] p-6 text-center shadow-lg">
      <div className="text-xl font-bold text-white mb-1">SecureBank</div>
      <p className="text-sm text-[#89a4c0]">{labels[step] ?? "Online Banking"}</p>
    </div>
  );
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  google: {
    id: "google",
    icon: "\u{1F310}",
    steps: [
      { key: "step1", type: "input", fieldType: "email" },
      { key: "step2", type: "input", fieldType: "password" },
      { key: "step3", type: "input", fieldType: "mfa" },
      { key: "step4", type: "info" },
    ],
    renderChrome: (step) => <GoogleChrome step={step} />,
  },
  facebook: {
    id: "facebook",
    icon: "\u{1F4F1}",
    steps: [
      { key: "step1", type: "input", fieldType: "email" },
      { key: "step2", type: "info" },
      { key: "step3", type: "input", fieldType: "password" },
      { key: "step4", type: "info" },
    ],
    renderChrome: () => <FacebookChrome />,
  },
  x: {
    id: "x",
    icon: "\u{1F426}",
    steps: [
      { key: "step1", type: "input", fieldType: "email" },
      { key: "step2", type: "input", fieldType: "password" },
      { key: "step3", type: "info" },
      { key: "step4", type: "input", fieldType: "mfa" },
    ],
    renderChrome: () => <XChrome />,
  },
  tiktok: {
    id: "tiktok",
    icon: "\u{1F3B5}",
    steps: [
      { key: "step1", type: "input", fieldType: "email" },
      { key: "step2", type: "info" },
      { key: "step3", type: "input", fieldType: "password" },
    ],
    renderChrome: () => <TikTokChrome />,
  },
  banking: {
    id: "banking",
    icon: "\u{1F3E6}",
    steps: [
      { key: "step1", type: "input", fieldType: "email" },
      { key: "step2", type: "info" },
      { key: "step3", type: "input", fieldType: "password" },
      { key: "step4", type: "info" },
      { key: "step5", type: "info" },
    ],
    renderChrome: (step) => <BankingChrome step={step} />,
  },
};

export const PLATFORM_IDS = Object.keys(PLATFORMS);
