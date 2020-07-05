"use strict";

import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import autoprefixer from "autoprefixer";
import browserSync from "browser-sync";
import mqpacker from "css-mqpacker";
import cssnano from "cssnano";
import sortCSSmq from 'sort-css-media-queries';
// import stylelint from "stylelint";
// import postcssScss from "postcss-scss";
// import postcssReporter from "postcss-reporter";
import config from "../config.js";
import isProduct from "../isProduct.js";

const $ = gulpLoadPlugins();

// sassをトランスパイル
gulp.task("sass", () => {
  // postcssのプラグイン
  let plugins = [
    // ベンダープレフィックス自動付与
    autoprefixer(),
    // メディアクエリをまとめる
    mqpacker({
      // sort: sortCSSmq // PCファースト
      sort: true // モバイルファースト
    })
    // stylelint(),
    // postcssReporter({ clearMessages: true })
  ];

  if (isProduct) {
    // cssを圧縮する
    plugins.push(cssnano({
      autoprefixer: false
    }));
  }

  return gulp
    .src(config.src + `/**/*.scss`)
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe($.if(!isProduct, $.cached("style"))) //キャッシュ
    .pipe($.if(!isProduct, $.progeny())) // 依存関係を解決してキャッシュを反映, 差分ビルド
    .pipe($.if(!isProduct, $.sourcemaps.init()))
    .pipe($.sassGlob())
    .pipe($.sass({
      outputStyle: "expanded"
    }))
    .pipe($.postcss(plugins))
    .pipe($.if(!isProduct, $.sourcemaps.write("./")))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});
