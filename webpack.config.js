const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const DotenvPlugin = require('dotenv-webpack')


const replaceWithProcessEnv = (content) => {
  for (var key in require('dotenv').config({ path: dotenvPath }).parsed) {
    content = content.replace(new RegExp('process.env.' + key, 'g'), process.env[key])
  }
  return content
}

const dotenvPath = __dirname + '/.env'

const config = {
  entry: {
    popup: path.join(__dirname, "src/popup.tsx"),
    content: path.join(__dirname, "src/content.ts"),
    background: path.join(__dirname, "src/background.ts"),
  },
  output: { path: path.join(__dirname, "dist"), filename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new DotenvPlugin(
      {
        path: dotenvPath
      }
    ),
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    // new CopyPlugin(
    //   {patterns: [
    //     {
    //       from: 'public/manifest.json',
    //       transform(content) {
    //         return replaceWithProcessEnv(content.toString())
    //       }
    //     }
    //   ]}
    // )
  ],
};

module.exports = config;
