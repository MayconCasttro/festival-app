import { defineConfig } from "eslint/config";
import eslintJs from "@eslint/js";
import nextPlugin from "eslint-config-next";

export default defineConfig(
  {
    ...eslintJs.configs.recommended,
    ...nextPlugin,
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
);
