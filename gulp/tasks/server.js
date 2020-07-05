"use strict";

import gulp from "gulp";
import browserSync from "browser-sync";

// browser-sync
gulp.task("server", () => {
  return browserSync({
    server: {
      baseDir: "dist"
    },
    startPath: `/`
  });
});

// ブラウザリロード
gulp.task("reload", () => {
  return browserSync.reload({ stream: true });
});
