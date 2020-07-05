"use strict";

import gulp from "gulp";
import runSequence from "run-sequence";

gulp.task("build", () => {
  runSequence("clean", "copy", ["pug", "sass", "webpack"]);
});
