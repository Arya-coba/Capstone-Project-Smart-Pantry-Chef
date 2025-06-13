module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "linebreak-style": 0,
    "no-console": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "max-len": ["error", { code: 120 }],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
    "consistent-return": "off",
    "no-param-reassign": ["error", { props: false }],
  },
};
