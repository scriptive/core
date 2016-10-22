//DEFAULT
var path=require('path'),Argv=require('minimist')(process.argv);
//COMMON PACKAGE
var fs=require('fs-extra'),clc=require('cli-color'),extend=require('node.extend');
//REQUIRE PACKAGE
// ,minifyCss=require('gulp-minify-css')
var gulp=require('gulp'),sass=require('gulp-sass'),uglify=require('gulp-uglify'),concat=require('gulp-concat'),include=require('gulp-include');
// REQUIRE DATA
var Package=JSON.parse(fs.readFileSync('package.json'));

var Configuration = JSON.parse(fs.readFileSync(Package.configuration.build));
// GULP
var productionRoot=Configuration.common.production.root;
var developmentRoot=Configuration.common.development.root;
var developmentAssets=path.join(developmentRoot,Configuration.common.development.assets);
//SASS
gulp.task('sass', function () {
  return gulp
  .src(path.join(developmentAssets,'sass','*([^A-Z0-9-]).scss'))//!([^A-Z0-9-])
  .pipe(sass(
    {
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      //sourceComments: 'map',//normal, map
      outputStyle: 'expanded'//compressed, expanded
    }
  ).on('error', sass.logError))
  .pipe(gulp.dest(path.join(developmentRoot,'css')));
});
//Scripts
gulp.task('scripts',function(){
  gulp.src(path.join(developmentAssets,'js','*([^A-Z0-9-]).js'))
  //.pipe(concat('all.min.js'))
  .pipe(include().on('error', console.log))
  .pipe(uglify({
    //mangle:false,
    output:{
      beautify: true, comments:'license'
    },
    compress:true,
    //outSourceMap: true,
    preserveComments:'license'
  }).on('error', console.log))
  .pipe(gulp.dest(path.join(developmentRoot,'js')));
});
// fileSystask
gulp.task('filesystask',function(){
  gulp.src(path.join(developmentAssets,'filesystask','fileSystask.js'))
  .pipe(include())
  .pipe(uglify({
    mangle:false,
    output:{
      beautify: false, comments:'license'
    },
    compress:true,
    preserveComments:'license'
  }).on('error', console.log))
  .pipe(concat('filesystask.min.js'))
  // .pipe(gulp.dest(path.join(developmentAssets,'filesystask')))
  .pipe(gulp.dest(path.join(productionRoot)));
});
// fileHtmltask
gulp.task('filehtmltask',function(){
  gulp.src(path.join(developmentAssets,'filehtmltask','fileHtmltask.js'))
  .pipe(include())
  .pipe(uglify({
    mangle:false,
    output:{
      beautify: false, comments:'license'
    },
    compress:true,
    preserveComments:'license'
  }).on('error', console.log))
  .pipe(concat('filehtmltask.min.js'))
  // .pipe(gulp.dest(path.join(developmentAssets,'filehtmltask')))
  .pipe(gulp.dest(path.join(productionRoot)));
});
// scriptive
gulp.task('scriptive',function(){
  gulp.src(path.join(developmentAssets,'scriptive','scriptive.js'))
  .pipe(include())
  .pipe(uglify({
    mangle:false,
    output:{
      beautify: false, comments:'license'
    },
    compress:true,
    preserveComments:'license'
  }).on('error', console.log))
  .pipe(concat('scriptive.min.js'))
  .pipe(gulp.dest(path.join(developmentRoot,'lib')))
  .pipe(gulp.dest(path.join(productionRoot)));
});
//WATCH
gulp.task('watch', function() {
  gulp.watch(path.join(developmentAssets,'sass','*.scss'), ['sass']);
  gulp.watch(path.join(developmentAssets,'js','*.js'), ['scripts']);
  gulp.watch(path.join(developmentAssets,'filesystask','*.js'), ['filesystask']);
  gulp.watch(path.join(developmentAssets,'filehtmltask','*.js'), ['filehtmltask']);
  gulp.watch(path.join(developmentAssets,'scriptive','*.js'), ['scriptive']);
});
//TASK
gulp.task('default', ['watch']);