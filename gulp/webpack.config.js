"use strict";

const path = require("path");
const webpack = require("webpack");

import minimist from "minimist";
let envOption = {
  string: "env",
  default: { env: process.env.NODE_ENV || "dev" } // NODE_ENVに指定がなければ開発モードをデフォルトにする
};
const options = minimist(process.argv.slice(2), envOption);
const isProduction = options.env === "production" ? true : false;

const src = path.resolve(__dirname, "../src");
console.log(src);
let config = {
  entry: {
    // vendor: ["jquery", "remodal"],
    app: src + "/js/app.js",
    top: src + "/js/top.js"
  },

  output: {
    path: path.join(__dirname, "/js"),
    filename: "[name].js"
  },

  resolve: {
    extensions: [".js"],
    // 使用したいコントロールやレンダラを定義しておきます。(下記は一例です。使用しないものは除いておいてよいです)
    alias: {}
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      ie: 11
                    },
                    useBuiltIns: "usage",
                    corejs: 3
                  }
                ]
              ]
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial"
    }
  }

  // plugins: [
  //   new webpack.ProvidePlugin({
  //     $: "jquery",
  //     jQuery: "jquery",
  //     // プラグインを読み込んだ時にwindow.jQueryが存在している必要がある
  //     "window.jQuery": "jquery",
  //     // Swiper: 'swiper',
  //     remodal: "remodal"
  //     // 'THREE': 'three/build/three',
  //     // 'createjs': 'createjs/builds/1.0.0'
  //     // IScroll: "fullpage.js/vendors/scrolloverflow.min"
  //     // Chart: 'Chart',
  //     // velocity-animateを読み込んでみる
  //     // ここではVelocityという名前にしているので、この名前が参照されて始めてモジュールが読み込まれる
  //     // つまりソースの中でVelocityを一度も使っていなかった場合、$().velocityも使えない
  //     // Velocity: 'velocity-animate'
  //   }),
  //   new webpack.optimize.ModuleConcatenationPlugin()
  // ]
};

if (isProduction) {
  // JS圧縮
  config.mode = "production";
} else {
  config.devtool = "source-map";
  config.cache = true;
  config.mode = "development";
}

module.exports = config;
