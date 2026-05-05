module.exports = {
  root: false,
  extends: ["eslint:recommended"],
  env: {
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: ["dist", ".next", "coverage"]
}

