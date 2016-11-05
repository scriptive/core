var gulp=require('gulp'),
sass=require('gulp-sass'),
uglify=require('gulp-uglify'),
concat=require('gulp-concat'),
include=require('gulp-include'),
data=require('./scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    if (this.status.success()){
      // gulp --dir=eba
      if (Argv.dir) {
        this.assetRoot= path.join(this.json.scriptive.common.public.root,Argv.dir,this.json.scriptive.common.asset.root);
        this.devRoot= path.join(this.json.scriptive.common.public.root,Argv.dir,this.json.scriptive.common.dev.root);
      } else {
        this.assetRoot=this.json.scriptive.common.asset.root;
        this.devRoot=this.json.scriptive.common.dev.root;
      }
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
  this.src(path.join(data.json.scriptive.common.asset.root,'scriptive','scriptive.js'))
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
  .pipe(this.dest(data.json.scriptive.common.dist.root))
  .pipe(this.dest(path.join(data.devRoot,data.json.scriptive.common.dev.lib)));
});
// fileSystask
gulp.task('filesystask',function(){
  this.src(path.join(data.json.scriptive.common.asset.root,'filesystask','fileSystask.js'))
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
  .pipe(this.dest(data.json.scriptive.common.dist.root));
});
// fileHtmltask
gulp.task('filehtmltask',function(){
  this.src(path.join(data.json.scriptive.common.asset.root,'filehtmltask','fileHtmltask.js'))
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
  .pipe(this.dest(data.json.scriptive.common.dist.root));
});
//endDeveloper
gulp.task('watch', function() {
  this.watch(path.join(data.assetRoot,'sass','*.scss'), ['sass']);
  this.watch(path.join(data.assetRoot,'js','*.js'), ['scripts']);
  //scriptDeveloper
  this.watch(path.join(data.json.scriptive.common.asset.root,'filesystask','*.js'), ['filesystask']);
  this.watch(path.join(data.json.scriptive.common.asset.root,'filehtmltask','*.js'), ['filehtmltask']);
  this.watch(path.join(data.json.scriptive.common.asset.root,'scriptive','*.js'), ['scriptive']);
  //scriptDeveloper
});
//TASK
gulp.task('default', ['watch']);
