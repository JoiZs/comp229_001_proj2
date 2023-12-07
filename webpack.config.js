const path = require("path");
const nodeExternal = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  target: "node",
  externals: [nodeExternal()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
