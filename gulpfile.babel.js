import gulp from 'gulp'
import babel from 'gulp-babel'
import cache from 'gulp-cached'

const path = 'src/**/*'

gulp.task('transpile', () =>
  gulp.src(path)
  .pipe(cache('transpile'))
  .pipe(babel())
  .pipe(gulp.dest('dist')))

gulp.task('watch', () => gulp.watch(path, ['transpile']))
gulp.task('default', ['watch', 'transpile'])
