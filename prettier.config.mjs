/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig | { [key:string]: any } } */
const config = {
  plugins: ["prettier-plugin-organize-imports"],
  // tailwindConfig: "./",
  // set to true to not auto remove imports
  organizeImportsSkipDestructiveCodeActions: false,
};

export default config;
