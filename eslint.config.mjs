import nextConfig from "eslint-config-next";

const eslintConfig = [
  { ignores: ["postcss.config.js", "tailwind.config.js", "eslint.config.mjs"] },
  ...nextConfig,
];

export default eslintConfig;
