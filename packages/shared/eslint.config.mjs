import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    // Default ignores of eslint-config-next:
    "dist/**",
    "node_modules/**",
    "src/components/ui/**",
  ]),
]);

export default eslintConfig;
