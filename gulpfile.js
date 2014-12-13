var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('greetings', function() {
    // place code for your default task here
    console.log('Hello Barcampers!');
});

gulp.task('test', function() {
    return gulp.src('specs/**/*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

//gulp.watch(['specs/**/*.js'], function(events) {
//
//});


gulp.task('default', ['test']);