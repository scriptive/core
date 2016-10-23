//DEFAULT
var path=require('path'),Argv=require('minimist')(process.argv);
//COMMON PACKAGE
var fs=require('fs-extra'),clc=require('cli-color'),extend=require('node.extend');
//REQUIRE PACKAGE
// ,minifyCss=require('gulp-minify-css')
var gulp=require('gulp'),sass=require('gulp-sass'),uglify=require('gulp-uglify'),concat=require('gulp-concat'),include=require('gulp-include');
// REQUIRE DATA
var Package=JSON.parse(fs.readFileSync('package.json'));

var Build = JSON.parse(fs.readFileSync(Package.configuration.build));
// GULP
var configRoot=Build.common.config.root;
var distRoot=Build.common.dist.root;
var assetRoot=Build.common.asset.root;
var devRoot=Build.common.dev.root;
var devLib=path.join(devRoot,Build.common.dev.lib);

//SASS
gulp.task('sass', function () {
  return gulp
  .src(path.join(assetRoot,'sass','*([^A-Z0-9-]).scss'))//!([^A-Z0-9-])
  .pipe(sass(
    {
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      //sourceComments: 'map',//normal, map
      outputStyle: 'expanded'//compressed, expanded
    }
  ).on('error', sass.logError))
  .pipe(gulp.dest(path.join(devRoot,'css')));
});
//Scripts
gulp.task('scripts',function(){
  gulp.src(path.join(assetRoot,'js','*([^A-Z0-9-]).js'))
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
  .pipe(gulp.dest(path.join(devRoot,'js')));
});
// fileSystask
gulp.task('filesystask',function(){
  gulp.src(path.join(assetRoot,'filesystask','fileSystask.js'))
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
  .pipe(gulp.dest(path.join(distRoot)));
});
// fileHtmltask
gulp.task('filehtmltask',function(){
  gulp.src(path.join(assetRoot,'filehtmltask','fileHtmltask.js'))
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
  .pipe(gulp.dest(path.join(distRoot)));
});
// scriptive
gulp.task('scriptive',function(){
  gulp.src(path.join(assetRoot,'scriptive','scriptive.js'))
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
  .pipe(gulp.dest(path.join(devRoot,devLib)))
  .pipe(gulp.dest(path.join(distRoot)));
});
//WATCH
gulp.task('watch', function() {
  gulp.watch(path.join(assetRoot,'sass','*.scss'), ['sass']);
  gulp.watch(path.join(assetRoot,'js','*.js'), ['scripts']);
  gulp.watch(path.join(assetRoot,'filesystask','*.js'), ['filesystask']);
  gulp.watch(path.join(assetRoot,'filehtmltask','*.js'), ['filehtmltask']);
  gulp.watch(path.join(assetRoot,'scriptive','*.js'), ['scriptive']);
});
//TASK
gulp.task('default', ['watch']);