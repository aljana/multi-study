var gulp = require('gulp'),
  server = require('gulp-develop-server'),
  jshint = require('gulp-jshint');

gulp.task('lint', function () {
  gulp.src('./src/**/*.js')
    .pipe(jshint());
});

gulp.task('serve', function () {
  server.listen({path: './app.js'});
});

gulp.task('watch', function () {
  gulp.watch(['./src/**/*.js'], ['lint', server.restart]);
});

gulp.task('develop', ['serve', 'watch']);
