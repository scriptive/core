var gulp=require('gulp'),
sass=require('gulp-sass'),
uglify=require('gulp-uglify'),
concat=require('gulp-concat'),
include=require('gulp-include'),
data=require('./dist/task')({
  json:{
    package:'package.json',
    build:'config/build.json'
  },
  initial:function() {
    if (this.status.success()){
      this.distRoot=this.json.build.common.dist.root;
      this.assetRoot=this.json.build.common.asset.root;
      this.devRoot=this.json.build.common.dev.root;
      this.devLib=path.join(this.devRoot,this.json.build.common.dev.lib);
    }
  }
});
//SASS
gulp.task('sass', function () {
  this.src(path.join(data.assetRoot,'sass','*([^A-Z0-9-]).scss'))//!([^A-Z0-9-])
  .pipe(sass(
    {
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      //sourceComments: 'map',//normal, map
      outputStyle: 'expanded'//compressed, expanded
    }
  ).on('error', sass.logError))
  .pipe(this.dest(path.join(data.devRoot,'css')));
});
//Scripts
gulp.task('scripts',function(){
  this.src(path.join(data.assetRoot,'js','*([^A-Z0-9-]).js'))
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
  .pipe(this.dest(path.join(data.devRoot,'js')));
});
//startDeveloper
gulp.task('scriptive',function(){
  this.src(path.join(data.assetRoot,'scriptive','scriptive.js'))
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
  .pipe(this.dest(data.devLib))
  .pipe(this.dest(data.devLib));
});
// fileSystask
gulp.task('filesystask',function(){
  this.src(path.join(assetRoot,'filesystask','fileSystask.js'))
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
  .pipe(this.dest(data.distRoot));
});
// fileHtmltask
gulp.task('filehtmltask',function(){
  this.src(path.join(data.assetRoot,'filehtmltask','fileHtmltask.js'))
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
  .pipe(this.dest(data.distRoot));
});
//endDeveloper
gulp.task('watch', function() {
  this.watch(path.join(data.assetRoot,'sass','*.scss'), ['sass']);
  this.watch(path.join(data.assetRoot,'js','*.js'), ['scripts']);
  //scriptDeveloper
  this.watch(path.join(data.assetRoot,'filesystask','*.js'), ['filesystask']);
  this.watch(path.join(data.assetRoot,'filehtmltask','*.js'), ['filehtmltask']);
  this.watch(path.join(data.assetRoot,'scriptive','*.js'), ['scriptive']);
  //scriptDeveloper
});
//TASK
gulp.task('default', ['watch']);
