/*
var util =require('util');
var error=clc.red.bold, warn=clc.yellow, notice=clc.blue, success=clc.green;
*/
// IDEA: DEFAULT
var path = require('path'),
    Argv = require('minimist')(process.argv);
// IDEA: COMMON PACKAGE
var fs = require('fs-extra'),
    clc = require('cli-color'),
    extend = require('node.extend');
// IDEA: REQUIRE PACKAGE
var Message = {
    "NoOS": "No OS specified: {-- --os=?}",
    "NoOSValid": "the specified: {os} is not valid",
    "DataCopied": "Data Copied...",
    "MsgOk": "Ok: {msg}",
    "MsgError": "{msg}",
    "NoConfig": "Package contains no configuration!",
    "NoConfigValid": "Package->configuration has no 'build' specified!",
    "FileNotExist": "file does not exist!",
    "ENOENT": "{msg} does not exist, and skipped!"
};
// NOTE: REQUIRE DATA
var Package = JSON.parse(fs.readFileSync('package.json'));

// var configuration = JSON.parse(fs.readFileSync(Package.configuration.build));
// NOTE: SETTING, TASK
/*
"laisiangtho": {
    "^[a-z\\d]+.json$": true
},
*/
// console.log(Package.configuration.build);
var Setting = {},
Configuration={},
Task = {
  todo: [],
  init: function() {
    // Package.configuration.build
    if (Package.hasOwnProperty('configuration')) {
      if (Package.configuration.hasOwnProperty('build')) {
        try {
          Configuration = JSON.parse(fs.readFileSync(Package.configuration.build));
          this.start();
        }
        catch (e) {
          this.exit(Message.FileNotExist.replace('file', Package.configuration.build));
        }
      } else {
        this.exit(Message.NoConfigValid.replace('configuration','configuration').replace('build','build'));
      }
    } else {
      this.exit(Message.NoConfig.replace('configuration','configuration'));
    }
  },
  start: function() {
    if (Argv.os) {
      if (Configuration.individual.hasOwnProperty(Argv.os)) {
        Setting = extend(true, Configuration.common, Configuration.individual[Argv.os]);
        if (!Setting.development.main) Setting.development.main = Argv.os;
        Setting.os = Argv.os;
        //Package.name,process.env.npm_package_name
        Setting.unique = Setting.unique.replace('.n', Setting.name).replace('.o', Argv.os).replace('.v', Setting.version).replace('.b', Setting.build);
        Setting.development.dir = path.join(Setting.development.root);
        if (Argv.dir) {
          Setting.production.dir = path.join(Argv.dir);
        } else {
          Setting.production.dir = path.join(Setting.production.root, Setting.unique);
        }
        Task.create.production(Setting.production.dir, function(msg) {
          console.log('creating', Setting.os);
          Task.read.development(Setting.development.dir, function(file, state) {
            Task.todo.push(file);
          });
          Task.copy(function() {
            console.log('Development');
            Task.todo.push({
              'src': path.join('image', Setting.os),
              'des': path.join(Setting.production.dir, 'img')
            });
            Task.copy(function() {
              console.log('Image');
              Task.todo.push({
                'src': path.join('config', Setting.os),
                'des': Setting.production.dir
              });
              Task.copy(function() {
                console.log('Configuration');
              });
            });
          });
        });
      } else {
        Task.exit(Message.NoOSValid.replace('{os}', Argv.os));
      }
    } else {
      Task.exit(Message.NoOS);
    }
  },
  create: {
    production: function(dir, callback) {
      dir.Exists(function(err) {
        if (err) {
          // NOTE: directory exists
          dir.Empty(function(err) {
            // NOTE: make it empty
            if (err) {
              Task.exit(err);
            } else {
              callback('current directory destroyed and rebuild empty!');
            }
          });
        } else {
          // NOTE: new directory
          dir.Create(function(err) {
            if (err) {
              Task.exit(err);
            } else {
              callback('new directory created!');
            }
          });
        }
      });
    }
  },
  read: {
    development: function(o, callback) {
      fs.readdirSync(o).forEach(function(fileName) {
        var dir = path.join(o, fileName);
        var file = path.parse(dir);
        var state = fs.statSync(dir);
        if (state.isFile()) {
          file.src = dir;
          var dirName = file.dir.split(path.sep).pop();
          if (dirName == Setting.development.root) {
            if (Object.keys(Setting.production.file.root).every(function(reg) {
                  return new RegExp(reg).test(fileName) === Setting.production.file.root[reg];
                })){
                  if (Setting.development.main == file.name && file.ext == '.html') {
                      file.des = path.join(Setting.production.dir, Setting.production.main + file.ext);
                  }else{
                      file.des = path.join(Setting.production.dir, fileName);
                  }
              callback(file, state);
            }
          } else {
            if (Object.keys(Setting.production.file[dirName]).every(function(reg) {
              // console.log(dirName,reg);
                return new RegExp(reg).test(fileName) === Setting.production.file[dirName][reg];
              })) {
              file.des = path.join(dir.replace(Setting.development.root, Setting.production.dir));
              callback(file, state);
            }
          }
        } else if (state.isDirectory()) {
          if (Setting.production.file.hasOwnProperty(fileName)) Task.read.development(dir, callback);
        }
      });
    }
  },
  copy: function(callback) {
    if (Task.todo.length) {
      var file = Task.todo.shift();
      file.Copy(function(err) {
        if (err) {
          if (Message.hasOwnProperty(err.code)) {
            Task.msg.error(Message[err.code].replace('{msg}', file.src));
          } else {
            Task.msg.error(Message.MsgError.replace('{msg}', err));
          }
        } else {
          Task.msg.success(Message.MsgOk.replace('Ok', Setting.os).replace('{msg}', file.src));
        }
        Task.copy(callback);
      });
    } else {
      callback();
    }
  },
  msg: {
    error: function(msg) {
      console.log(clc.red(msg));
    },
    success: function(msg) {
      console.log(clc.green(msg));
    }
  },
  exit: function(msg) {
    Task.msg.error(msg);
    process.exit(0);
  }
};
Object.defineProperties(Object.prototype, {
  Exists: {
    value: function(callback) {
      // HACK: callback(fs.existsSync(this.toString()));
      fs.exists(this.toString(), function(error) {
        callback(error);
      });
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
  }
});
Task.init();