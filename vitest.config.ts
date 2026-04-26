import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "lib/password.ts",
        "lib/totp.ts",
        "lib/validations.ts",
        "features/simulator/engine/FlowField.tsx",
        "features/simulator/engine/FlowRunner.tsx",
        "features/simulator/engine/StrengthBar.tsx",
        "features/simulator/engine/definePlatform.ts",
        "features/simulator/engine/fields.ts",
        "stores/accounts-store.ts",
      ],
      exclude: ["**/*.d.ts", "**/types.ts"],
    },
  },
});
