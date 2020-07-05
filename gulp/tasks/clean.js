"use strict";

import gulp from "gulp";
import del from "del";
import config from "../config.js";

// クリーン
gulp.task("clean", () => {
  return del([config.dist + "**/*"], { force: false }).then(paths => {
    console.log("Deleted files and folders:\n", paths.join("\n"));
  });
});
