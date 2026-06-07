/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

declare const process: {
  env: {
    VITE_BASE_PATH?: string;
  };
};

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts"
  }
});
