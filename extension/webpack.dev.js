const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // devtool: "inline-cheap-source-map"
  devtool: "inline-source-map"
});
