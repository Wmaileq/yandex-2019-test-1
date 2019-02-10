var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  del = require('del'),
  bs = require('browser-sync').create(),
  watch = require('gulp-watch');

var paths = {
  html: {
    src: 'src/*.html',
    dist: 'dist/'
  },
  styles: {
    src: 'src/styles/**/*.*',
    dist: 'dist/',
  },
  imgs: {
    src: 'src/imgs/**/*.*',
    dist: 'dist/imgs/'
  },
};

function buildHtml() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dist))
    .pipe(bs.reload({ stream: true }))
};

function buildStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .on('error', function(err) {
      console.log(err.toString());
      this.emit('end')
    })
    .pipe(autoprefixer())
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(bs.reload({ stream: true }))
};


function buildImgs() {
  return gulp.src(paths.imgs.src)
    .pipe(gulp.dest(paths.imgs.dist))
    .pipe(bs.reload({ stream: true }));
};

function buildAll(done) {
  return gulp.series(buildHtml, buildStyles, buildImgs)(done);
};

function server() {
  return bs.init({
    server: {
      baseDir: './dist'
    },
    host: 'localhost',
    port: 3000
  })
};

function spy() {
  watch(paths.html.src, buildHtml);
  watch(paths.styles.src, buildStyles);
  watch(paths.imgs.src, buildStyles);
};

function clean() {
  return del('dist');
};

gulp.task('clean', clean);

gulp.task('default', gulp.series(clean, buildAll, gulp.parallel(server, spy)));