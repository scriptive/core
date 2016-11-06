// IDEA: DEFAULT
var path = require('path'),
    Argv = require('minimist')(process.argv);
// IDEA: COMMON modules
var fs = require('fs-extra'),
    clc = require('cli-color'),
    extend = require('node.extend');
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
        File: "file does not exist!",
        Dir:'Directory not exists!'
      },
      Yes:{
        Dir:'Directory created!',
        Empty:'Directory emtpy!'
      },
      Invalid:{
        OS : "the specified: {os} is invalid!"
      },
      Create:'Obj created!',
      Empty:'Obj emptied!',
      Exists:'Obj exists!',
      DataCopied: "Data Copied...",
      ENOENT: "{msg} does not exist, and skipped!",
      Ok: "Ok: {msg}",
      Error: "--{msg}",
      Danger: "Processing task might destory your works...",
      Processing: "Task Processing...",
      Completed: "Task Completed!"
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
  createDirectory:function(dir, callback, empty) {
    dir.Exists(err =>{
      if (err) {
        // NOTE: empty exists directory
        if (empty) {
          dir.Empty(err => {
            if (err) {
              this.status.exit(err);
            } else {
              callback(this.status.msg.Empty.replace('Obj', dir));
            }
          });
        } else {
          callback(this.status.msg.Exists.replace('Obj', dir));
        }
      } else {
        // NOTE: create new directory
        dir.Create(err => {
          if (err) {
            this.status.exit(err);
          } else {
            callback(this.status.msg.Create.replace('Obj', dir));
          }
        });
      }
    });
  }
};
module.exports = function(Config){
  this.path = path;
  this.Argv = Argv;
  this.fs = fs;
  this.clc = clc;
  this.extend = extend;
  if (Config.hasOwnProperty('json')){
    for (var file in Config.json) {
      if (Config.json.hasOwnProperty(file)) {
        try {
          var fileName = Config.json[file];
          Config.json[file] = JSON.parse(fs.readFileSync(Config.json[file]));
          if (Argv.pro && Config.json[file].project && Config.json[file].project[Argv.pro]) {
            // Ok: argument, project in json, Directory? 
            Config.json[file].project.root = path.join(Config.json[file].project[Argv.pro].root);
            // console.log('asdfasd',path.join(Config.json[file].project[Argv.pro].root,'package.json'));
            // path.join(Config.json[file].project[Argv.pro].root,'package.json').Exists(function(err){
            //   console.log('asdfasd',err);
            // });
            try {
              extend(true,Config.json[file],JSON.parse(fs.readFileSync(path.join(Config.json[file].project.root,fileName))));
            } catch(e) {
              task.status.warns.push(task.status.msg.No.File.replace('file', fileName));
            }
          }
        } catch (e) {
          Config.json[file] = task.status.msg.No.File.replace('file', fileName);
          task.status.error.push(Config.json[file]);
        }
      }
    }
  }
  Object.defineProperties(Object.prototype, {
    Exists: {
      value: function(callback) {
        // HACK: callback(fs.existsSync(this.toString()));
        fs.exists(this.toString(), callback);
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
        fs.copy(this.src.toString(), this.des.toString(),{replace:true},function(error) {
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
  extend(true,task,Config);
  if (task.hasOwnProperty('id')){
    this[task.id] = task;
  }
  task.hasMethodProperty('initial',true);
  return task;
};