module.exports = {
  extends: [require.resolve("./base"), "plugin:react/recommended", "plugin:react-hooks/recommended"],
  env: {
    browser: true
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}

