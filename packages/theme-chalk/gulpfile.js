'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const replace = require('gulp-replace');
const cssmin = require('gulp-cssmin');
const { prefixReplace } = require('../../build/config');

const replaceFrom = new RegExp(`\\b${prefixReplace[0]}-`, 'g');
const replaceTo = `${prefixReplace[1]}-`;

function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      // browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(replace(replaceFrom, replaceTo))
    .pipe(dest('./lib'));
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
