import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
    "README.md",
  ],
  rules: {
    // rule overrides
    "unicorn/no-null": "off",
    "unicorn/no-array-callback-reference": "off",
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
