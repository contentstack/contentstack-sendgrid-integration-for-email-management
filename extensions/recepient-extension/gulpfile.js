const gulp = require('gulp');
const inline = require('gulp-inline');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const minifyCss = require('gulp-minify-css');
const babel = require('gulp-babel');

gulp.task('lint-js', () => gulp.src('src/*.js').pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError()));

gulp.task('build', () => gulp
  .src('./src/index.html')
  .pipe(
    inline({
      js: [
        babel({
          presets: ['es2015'],
        }),
        uglify,
      ],
      css: [minifyCss],
      disabledTypes: ['svg', 'img'],
    }),
  )
  .pipe(gulp.dest('./')));


gulp.task('watch', () => {
  gulp.watch('src/*', gulp.series('build'));
});

gulp.task('default', gulp.series('build'));
