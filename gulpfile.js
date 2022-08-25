var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat-util'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps');

var kurveSources = [
    './src/window.js',
    './src/Kurve.js',
    './src/KurveStorage.js',
    './src/KurveSound.js',
    './src/KurveTheming.js',
    './src/KurveFactory.js',
    './src/KurveConfig.js',
    './src/KurveUtility.js',
    './src/KurveMenu.js',
    './src/KurveGame.js',
    './src/KurveField.js',
    './src/KurveSuperpowerconfig.js',
    './src/KurveSuperpower.js',
    './src/KurveCurve.js',
    './src/KurvePoint.js',
    './src/KurvePlayer.js',
    './src/KurveLightbox.js',
    './src/KurvePiwik.js',
    './src/KurvePrivacypolicy.js',
];

var kurveLibs = [
    './node_modules/pixi.js/dist/browser/pixi.js',
];

gulp.task('js', function(done) {
    gulp.src(kurveLibs.concat(kurveSources))
        .pipe(sourcemaps.init())
        .pipe(uglify({output: { comments: 'some'}}))
        .pipe(concat('kurve.min.js', {sep: ''}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        .on('end', done);
});

gulp.task('sass', function(done) {
    gulp.src('./scss/main.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./dist/css/'))
        .on('end', done);
});

gulp.task('images', function () {
    return gulp.src('./images/*').pipe(gulp.dest('./dist/images'));
});

gulp.task('sound', function () {
    return gulp.src('./sound/**/*').pipe(gulp.dest('./dist/sound'));
});

gulp.task('build', gulp.series('js', 'sass', 'images', 'sound'));
gulp.task('default', gulp.series('build'));

gulp.task('watch', function() {
    gulp.watch([
        'src/*',
        'scss/*'
    ], gulp.series('build'))
});