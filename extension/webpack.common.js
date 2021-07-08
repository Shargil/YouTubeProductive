const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");


const colors = {
  red: "#FF0000",
  white: "#FFFFFF",
  black: "#19202C",
  gray: "#ABABAB",
  lightGray: "#EBEBEB",
  transparentRed: "rgba(255, 0, 0, 0.25)"
}

module.exports = {
  entry: {
    options: path.join(__dirname, "src/options/index.tsx"),
    // constants: path.join(__dirname, "src/constants.tsx"),
    smartTimeLimit: path.join(__dirname, "src/contentScripts/smartTimeLimit/smartTimeLimit.tsx"),
    deepFocus: path.join(__dirname, "src/contentScripts/deepFocus/deepFocus.tsx"),
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
      },
      {
        // exclude: /node_modules/,
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // Creates style nodes from JS strings
          },
          {
            loader: "css-loader" // Translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {
                  // https://ant.design/docs/react/customize-theme
                  // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                  'primary-color': colors.red, // primary color for all components
                  'highlight-color': colors.transparentRed,
                  // 'link-color': '#1890ff', // link color
                  // 'success-color': '#52c41a', // success state color
                  // 'warning-color': '#faad14', // warning state color
                  // 'error-color': '#f5222d', // error state color
                  'font-size-base': '16px', // major text font size
                  'heading-color': colors.black, // heading text color
                  'text-color': colors.black, // major text color
                  // 'text-color-secondary': 'rgba(0, 0, 255, 0.45)', // secondary text color
                  // 'disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
                  // 'border-radius-base': '2px', // major border radius
                  // 'border-color-base': '#d9d9d9', // major border color
                  // 'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05) ', // major shadow for layers
                  'heading-5-size': '16px',
                  // Layout
                  'layout-body-background': colors.white,
                  'layout-header-background': colors.white,
                  'layout-header-height': '80px',
                  'layout-header-padding': '0 24px',
                  // Menu
                  'menu-item-active-bg': colors.white,
                  'menu-item-color': colors.gray,
                  // Buttons
                  'btn-font-weight': 600,
                  'btn-border-radius-base': "50px",
                  'btn-line-height': "1em",
                  // 'btn-padding-horizontal-base': '8px 24px';

                },
                javascriptEnabled: true,
              },
            },
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
