'use strict';

let del = require('del');
let gulp = require('gulp');
let sass = require('gulp-sass');
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('clean-dist', () => del('./dist/'));

gulp.task('preprocess-sass', ['clean-dist'], () => {
    return gulp.src("src/sass/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(rename("main.css"))
        .pipe(gulp.dest("./dist"));
});

gulp.task('transpile', ['preprocess-sass'], () => {
    return gulp.src("src/js/*.js")
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("./temp"));
});


gulp.task('bundle', ['transpile'], () => {
    return browserify("./temp/main.js")
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest("./temp"))
});

gulp.task('minify', ['bundle'], () => {
    return gulp.src("./temp/main.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});

gulp.task('clean-temp', ['minify'], () => del('./temp/'));

gulp.task('build', ['clean-temp']);

gulp.task('watch', () => {
    gulp.watch("./src/**/*.*", ['build']);
});
