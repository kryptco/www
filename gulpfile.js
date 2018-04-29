// https://github.com/Granze/react-starterify/blob/master/gulpfile.js

var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    minify = require('gulp-minify'),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace-task'),
    p = {
        jsx: './static/src/js/app.js',
        bundle: 'app.js',
        dist: './_site/static/dist',
        distJs: './_site/static/dist/js',
        distLibJs: './_site/static/dist/js/lib/',
        srcLibJs: './static/src/js/lib/**',
        watchSCSS: './static/src/scss/**/*.scss',
        watchDocsHTML: './static/src/docs/_site/**/*.html',
        watchDocsCSS: './static/src/docs/_site/**/*.css',
        srcSCSSMainFile: './static/src/scss/[^_]*.scss',
        distCSS: './_site/static/dist/css',
        srcFonts: './static/src/fonts/**/*',
        distFonts: './_site/static/dist/fonts',
        srcImg: './static/src/img/**/*',
        distImg: './_site/static/dist/img',
        srcData: './static/src/data/**/*',
        distData: './_site/static/dist/data',
        srcWellKnown: './static/src/well-known/*',
        distWellKnown: './_site/.well-known/'
    };

gulp.task('clean', function (cb) {
    del([p.distJs]).then(function(paths) {
        cb();
    });
});

gulp.task('fonts', function () {
    return gulp
        .src(p.srcFonts)
        .pipe(gulp.dest(p.distFonts));
});

gulp.task('images', function () {
    return gulp
        .src(p.srcImg)
        .pipe(gulp.dest(p.distImg));
});

gulp.task('libJS', function () {
  return gulp
      .src(p.srcLibJs)
      .pipe(gulp.dest(p.distLibJs));
});


gulp.task('data', function () {
    return gulp
        .src(p.srcData)
        .pipe(gulp.dest(p.distData));
});

gulp.task('wellknown', function () {
  return gulp
      .src(p.srcWellKnown)
      .pipe(gulp.dest(p.distWellKnown));
});

gulp.task('styles', function() {
  return gulp
      .src(p.srcSCSSMainFile)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error',sass.logError))
      .pipe(cleanCSS({debug:false}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(p.distCSS));
});


gulp.task('watchify', function () {
    var bundler = watchify(browserify(p.jsx, watchify.args));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(p.bundle))
            .pipe(gulp.dest(p.distJs));
    }

    bundler.transform(babelify.configure({
        presets: ['es2015', 'react']
    })).on('update', rebundle);

    return rebundle();
});

gulp.task('browserify', function () {
    browserify(p.jsx)
        .transform(babelify.configure({
            presets: ['es2015'] //, 'react']
        }))
        .bundle()
        .pipe(source(p.bundle))
        //.pipe(minify())
        .pipe(gulp.dest(p.distJs));
});

// Jekyll for docs site
const child = require('child_process');
const gutil = require('gulp-util');

gulp.task('watch', ['build', 'clean', 'styles'], function () {
    gulp.start(['watchify']);
    gulp.watch(p.watchSCSS, ['styles']);
	gulp.watch(p.watchDocsHTML, ['build']);
	gulp.watch(p.watchDocsCSS, ['build']);
});

gulp.task('build', ['clean'], function () {
    process.env.NODE_ENV = 'production';
	  gulp.start(['fileinclude']);
    gulp.start(['fonts']);
    gulp.start(['data']);
    gulp.start(['wellknown']);
    gulp.start(['images']);
    gulp.start(['libJS']);
    gulp.start(['styles']);
    gulp.start(['browserify']);
});

var fileinclude = require('gulp-file-include');

gulp.task('fileinclude', function() {

  gulp.src(['kr'])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest('./_site/'));

  gulp.src(['kr-beta'])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest('./_site/'));

  gulp.src(['static/src/app/**/*'])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest('./_site/app/'));

  gulp.src(['static/src/pricing/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/pricing/'));

  gulp.src(['static/src/features/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/features/'));

  gulp.src(['static/src/sigchain/**/*'])
    .pipe(gulp.dest('./_site/sigchain/'));

  gulp.src(['static/src/install/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/install/'));

  gulp.src(['static/src/faq/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/faq/'));
  gulp.src(['static/src/why_kryptonite/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/why_kryptonite/'));
  gulp.src(['static/src/about/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/about/'));

  gulp.src(['static/src/get_started/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/get_started/'));

  gulp.src(['static/src/billing/*'])
    .pipe(replace({
      patterns: [
        {
          match: 'stripe_public_key',
          replacement: gutil.env.stripe_public_key,
        }
      ]
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/billing/'));


  // process the gulp includes for the built jekyll docs site
  gulp.src(['./static/src/docs/_site/**/*'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('./_site/docs/'));

    // process the gulp includes for the built jekyll jobs site
  gulp.src(['./static/src/jobs/_site/**/*'])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@root'
  }))
  .pipe(gulp.dest('./_site/jobs/'));

  gulp.src(['static/src/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/'));

  gulp.src(['static/src/teams/*'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./_site/teams/'));    
  gulp.src(['static/src/demo/**/*'])
    .pipe(gulp.dest('./_site/demo/'));
});

