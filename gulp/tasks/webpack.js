"use strict";

import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import webpackConfig from "../webpack.config.js";
import browserSync from "browser-sync";
import config from "../config.js";

const $ = gulpLoadPlugins();

gulp.task("webpack", () => {
  return gulp
    .src(config.src + `/**/**.js`)
    .pipe($.plumber())
    .pipe($.cached("js-cache"))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(config.js))
    .pipe(browserSync.stream());
});
