const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    options: path.join(__dirname, "src/options/index.tsx"),
    // constants: path.join(__dirname, "src/constants.tsx"),
    smartTimeLimit: path.join(__dirname, "src/contentScripts/smartTimeLimit/smartTimeLimit.tsx"),
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/dist")
  },
  // All files that doesn't any changes and are not required/ imported in other js
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/manifest.json", to: "" },
        { from: "src/icons", to: "icons" },
        { from: "src/assets", to: "assets" },
        { from: "src/constants.js", to: "" },
        { from: "src/background.js", to: "" },
        { from: "src/contentScripts", to: "contentScripts" },
        { from: "src/popup", to: "popup" },
        { from: "src/options.html", to: "" }
      ],
    }),
  ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // Creates style nodes from JS strings
          },
          {
            loader: "css-loader" // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
