import jsxA11Y from "eslint-plugin-jsx-a11y";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
  ), 
  {
    plugins: {
      "jsx-a11y": jsxA11Y,
      "@typescript-eslint": typescriptEslint,
    },

    // rules: {
    //   "@typescript-eslint/no-unused-vars": ["error", {
    //     argsIgnorePattern: "^_",
    //   }],
    // },
    rules: {
      "@typescript-eslint/no-unused-vars": "off"
    },
    languageOptions: {
      globals: {
          ...globals.node,
          ...globals.browser,
          ...globals.mocha
      }
    }
  }, 
  {
    ignores: [
      "**/dist/**", 
      "**/.nx/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/.vercel/**",
      "**/build/**",
      "apps/interfaces/cli/**",
      "**/.docusaurus/**",
      "apps/interfaces/chrome-extension/**",
    ],
  }
];