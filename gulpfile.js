var gulp=require('gulp'),
sass=require('gulp-sass'),
uglify=require('gulp-uglify'),
concat=require('gulp-concat'),
include=require('gulp-include'),
replace=require('gulp-replace'),
exec=require('child_process').exec,
eventStream = require('event-stream');
var data=require('./scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  version:{
  },
  initial:function() {
    if (this.status.success()){
      // gulp --pro=lst
      this.json.scriptive.app['buildDate'] = new Date().toISOString().slice(0,10).replace(/-/g,'.');
      // this.BuildDate = new Date().toISOString().slice(0,10).replace(/-/g,'.');
      // this.BuildDate = this.json.package.version;
      if (this.json.scriptive.project && this.json.scriptive.project.root) {
        this.assetRoot = path.join(this.json.scriptive.project.root,this.json.scriptive.app.asset.root);
        this.devRoot = path.join(this.json.scriptive.project.root,this.json.scriptive.app.dev.root);
        if (this.json.scriptive.gulp.hasOwnProperty('custom'))this.custom(this.json.scriptive.gulp.custom,this.json.scriptive.project.root);
      } else {
        this.assetRoot = path.join(this.json.scriptive.app.asset.root);
        this.devRoot = path.join(this.json.scriptive.app.dev.root);
      }
      extend(this.AssetSASS,this.json.scriptive.gulp.sass);
      extend(this.AssetJS,this.json.scriptive.gulp.js);
    }
  },
  AssetSASS:{
    debugInfo: true,
    lineNumbers: false,
    errLogToConsole: true,
    // sourceComments: "normal",//normal, map
    outputStyle: "compact"//compact, compressed, expanded
  },
  AssetJS:{
    //mangle:false,
    output:{
      beautify: true, 
      comments:"license"
    },
    compress:true,
    //outSourceMap: true,
    preserveComments:"license"
  },
  watch:['watch'],
  custom:function(obj,root){
    Object.keys(obj).forEach(name=>{
      var o=obj[name], src = path.join(root,o.source);
      gulp.task(name, task=>{
        var w = gulp.src(src);
        for(var i in o.pipe)w=w.pipe(require(i)(o.pipe[i]));
        w.pipe(replace(/\{(application.*?)\}/gm,  data.replace.app))
        w.pipe(replace(/\{((package|scriptive).*?)\}/gm,  data.replace.json))
        if (o.target.constructor === Array){
          o.target.map(dir=>{w=w.pipe(gulp.dest(path.join(root,dir)))});
        } else {
          w=w.pipe(gulp.dest(path.join(root,o.target)));
        }
        return w;
      });
      this.watch.push(name);
      gulp.watch(o.hasOwnProperty('watch')?path.join(root,o.watch):src,[name]);
    });
  },
  replace:{
    // version:function(){
    //   return 'v' +data.json.scriptive.app.version;
    // },
    app:function(){
      var e = data.json.scriptive.app;
      arguments[1].split('.').forEach(function(v){
        if (e.hasOwnProperty(v))e=e[v];
      });
      return (typeof e === 'string')?e:arguments[0];
    },
    json:function(){
      var e = data.json;
      arguments[1].split('.').forEach(function(v){
        if (e.hasOwnProperty(v))e=e[v];
      });
      // return (typeof e === 'string')?e:arguments[0];
      return (typeof e === 'string')?e:arguments[0];
    }
  }
});
//SASS
gulp.task('AssetSASS', function () {
  this.src(path.join(data.assetRoot,'sass','*([^A-Z0-9-]).scss'))//!([^A-Z0-9-])
  .pipe(sass(data.AssetSASS).on('error', sass.logError))
  .pipe(this.dest(path.join(data.devRoot,'css')));
});
//Scripts
gulp.task('AssetJS',function(){
  this.src(path.join(data.assetRoot,'js','*([^A-Z0-9-]).js'))
  .pipe(include().on('error', console.log))
  .pipe(replace(/\{(application.*?)\}/gm,  data.replace.app))
  .pipe(replace(/\{((package|scriptive).*?)\}/gm,  data.replace.json))
  .pipe(uglify(data.AssetJS).on('error', console.log))
  .pipe(this.dest(path.join(data.devRoot,'js')));
});
//startDeveloper
gulp.task('scriptive',function(){
  this.src(path.join(data.json.scriptive.app.asset.root,'scriptive','scriptive.js'))
  .pipe(include())
  .pipe(replace(/\{(application.*?)\}/gm,  data.replace.app))
  .pipe(replace(/\{((package|scriptive).*?)\}/gm,  data.replace.json))
  .pipe(uglify({
    mangle:true,
    output:{
      beautify: false, comments:'license'
    },
    compress:true,
    preserveComments:'license'
  }).on('error', console.log))
  .pipe(concat('scriptive.min.js'))
  .pipe(this.dest(data.json.scriptive.app.dist.root))
  .pipe(this.dest(path.join(data.devRoot,data.json.scriptive.app.dev.lib)));
});
// fileStorage
/*
gulp.task('filestorage',function(){
  this.src(path.join(data.json.scriptive.app.asset.root,'filestorage','fileStorage.js'))
  .pipe(include())
  .pipe(uglify({
    mangle:false,
    output:{
      beautify: false, comments:'license'
    },
    compress:true,
    preserveComments:'license'
  }).on('error', console.log))
  .pipe(concat('filestorage.min.js'))
  .pipe(this.dest(data.json.scriptive.app.dist.root));
});
*/
// fileSystask
/*
gulp.task('filesystask',function(){
  this.src(path.join(data.json.scriptive.app.asset.root,'filesystask','fileSystask.js'))
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
  .pipe(this.dest(data.json.scriptive.app.dist.root));
});
*/
// fileHtmltask
gulp.task('filehtmltask',function(){
  this.src(path.join(data.json.scriptive.app.asset.root,'filehtmltask','fileHtmltask.js'))
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
  .pipe(this.dest(data.json.scriptive.app.dist.root));
});
//endDeveloper
gulp.task('watch', function() {
  this.watch(path.join(data.assetRoot,'sass','*.scss'), ['AssetSASS']);
  this.watch(path.join(data.assetRoot,'js','*.js'), ['AssetJS']);
  //scriptDeveloper
  // this.watch(path.join(data.json.scriptive.app.asset.root,'filestorage','*.js'), ['filestorage']);
  // this.watch(path.join(data.json.scriptive.app.asset.root,'filesystask','*.js'), ['filesystask']);
  this.watch(path.join(data.json.scriptive.app.asset.root,'filehtmltask','*.js'), ['filehtmltask']);
  this.watch(path.join(data.json.scriptive.app.asset.root,'scriptive','*.js'), ['scriptive']);
  //scriptDeveloper
});
//TASK
gulp.task('default', data.watch);
