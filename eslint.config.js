import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  // ----------------------------
// STRUCTURE: serves Codexstone
// ----------------------------
{
  files: ["src/structure/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@pillars/*", "@systems/*", "@shared/*"],
            message:
              "Structure must not import from pillars/systems/shared. Structure is axial law.",
          },
        ],
      },
    ],
  },
},

// ----------------------------
// SYSTEMS: supporting intelligences
// ----------------------------
{
  files: ["src/systems/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@pillars/*"],
            message:
              "Systems must not import from pillars. Systems may import @structure/*, @systems/*, and @shared/* (types/contracts only).",
          },
        ],
      },
    ],
  },
},

// ----------------------------
// PILLARS: domain boundaries
// ----------------------------
{
  files: ["src/pillars/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          // Block alias-based pillar-to-pillar imports
          {
            group: ["@pillars/*"],
            message:
              "Pillars must not import other pillars. Use @shared/* or @systems/*.",
          },
        ],
      },
    ],
  },
},
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
