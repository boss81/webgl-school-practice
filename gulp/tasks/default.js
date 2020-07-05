"use strict";

import gulp from "gulp";
import runSequence from "run-sequence";

gulp.task("default", () => {
  return runSequence(
    "clean",
    "copy",
    ["pug", "sass", "webpack"],
    ["server", "watch"]
  );
});
