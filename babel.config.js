module.exports = {
  presets: [
    "@vue/app",
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: {
          safari: "9"
        }
      }
    ]
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true
      },
      "vant"
    ]
  ]
};
