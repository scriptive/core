// IDEA: DEFAULT
var path = require('path'),
    Argv = require('minimist')(process.argv);
// IDEA: COMMON modules
var fs = require('fs-extra'),
    clc = require('cli-color'),
    extend = require('node.extend'),
    download = require('download'),
    got = require('got');
// TODO: task
var task = {
  todo:[],
  setting:{},
  status:{
    warns:[],
    error:[],
    msg:{
      No:{
        Init: "Nothing to initial!",
        OS : "No OS specified: {-- --os=?}",
        Config:"Package contains no configuration!",
        Build: "Package->configuration has no 'build' specified!",
        File: "file does not exist!"
      },
      Invalid:{
        OS : "the specified: {os} is not valid"
      },
      DataCopied: "Data Copied...",
      ENOENT: "{msg} does not exist, and skipped!",
      Ok: "Ok: {msg}",
      Error: "--{msg}"
    },
    string:function(q) {
      if (typeof q === 'object') {
        return q.join("\n");
      }
      return q;
    },
    success:function() {
      if (this.error.length) {
        this.exit(this.error);
      } else {
        return true;
      }
    },
    exit:function(msg) {
      if (msg) {
        this.msgDefault(this.string(msg));
      }
      process.exit(0);
    },
    msgError:function(q) {
      console.log(clc.red(this.string(q)));
    },
    msgSuccess:function(q) {
      console.log(clc.green(this.string(q)));
    },
    msgDefault:function(q) {
      console.log(clc.magenta(this.string(q)));
    }
  },
  // initial:function() {
  //   this.status.msgDefault(this.status.msg.No.Init);
  // }
};
module.exports = function(Options){
  // var self = this;
  this.path = path;
  this.Argv = Argv;
  this.fs = fs;
  this.clc = clc;
  this.extend = extend;
  this.download = download;
  this.got = got;
  if (Options.hasOwnProperty('json')){
    for (var fileName in Options.json) {
      if (Options.json.hasOwnProperty(fileName)) {
        try {
          Options.json[fileName] = JSON.parse(fs.readFileSync(Options.json[fileName]));
        } catch (e) {
          Options.json[fileName] = task.status.msg.No.File.replace('file', Options.json[fileName]);
          task.status.error.push(Options.json[fileName]);
        }
      }
    }
  }
  Object.defineProperties(Object.prototype, {
    Exists: {
      value: function(callback) {
        // HACK: callback(fs.existsSync(this.toString()));
        fs.exists(this.toString(), function(error) {
          callback(error);
        });
      }
    },
    Write: {
      value: function(content) {
        // HACK: callback(fs.writeFileSync(this.toString()), content, 'utf-8');
        fs.writeFile(this.toString(), content,'utf-8');
      }
    },
    Create: {
      value: function(callback) {
        fs.ensureDir(this.toString(), callback);
      }
    },
    Empty: {
      value: function(callback) {
        fs.emptyDir(this.toString(), callback);
      }
    },
    Copy: {
      value: function(callback) {
        fs.copy(this.src.toString(), this.des.toString(), function(error) {
          callback(error);
        });
      }
    },
    Read: {
      value: function(callback) {
        var o = this.toString();
        fs.readdirSync(o).forEach(function(fileName) {
          var dir = path.join(o, fileName);
          var file = path.parse(dir);
          var state = fs.statSync(dir);
          // HACK: file.src=dir;
          // HACK: file.dest='';
          callback(dir, file, state);
        });
      }
    },
    hasMethodProperty:{
      value:function(o,i){
        // return this.hasOwnProperty(o) && this.isFunction(o);
        if (this.hasOwnProperty(o) && this.isFunction(o)) {
          return i?this[o]():true;
        }
      }
    },
    isFunction:{
      value:function(o){
        return typeof this[o]==='function';
      }
    }
  });
  extend(true,task,Options);
  if (task.hasOwnProperty('id')){
    this[task.id] = task;
  }
  task.hasMethodProperty('initial',true);
  return task;
};