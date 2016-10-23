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
    extend = require('node.extend'),
    download = require('download'),
    got = require('got');
// IDEA: REQUIRE PACKAGE
var Message = {
    "NoOS": "No OS specified: {-- --os=?}",
    "NoOSValid": "the specified: {os} is not valid",
    "DataCopied": "Data Copied...",
    "MsgOk": "Ok: {msg}",
    "MsgError": "--{msg}",
    "NoConfig": "Package contains no configuration!",
    "NoConfigValid": "Package->configuration has no 'build' specified!",
    "FileNotExist": "file does not exist!"
};
// NOTE: REQUIRE DATA
var Package = JSON.parse(fs.readFileSync('package.json'));

// var configuration = JSON.parse(fs.readFileSync(Package.configuration.build));
// NOTE: SETTING, TASK

// console.log(Package.configuration.build);
var Setting = {},
Build={},
Task = {
  todo: [],
  init: function() {
    // Package.configuration.build
    if (Package.hasOwnProperty('configuration')) {
      if (Package.configuration.hasOwnProperty('build')) {
        try {
          Build = JSON.parse(fs.readFileSync(Package.configuration.build));
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
    Setting = Build.common;
    // Setting.unique = Setting.unique.replace('.n', Package.name).replace('.o', Argv.os).replace('.v', Setting.version).replace('.b', Setting.build);
    Setting.dev.dir = path.join(Setting.dev.root);
    Setting.dev.lib = path.join(Setting.dev.root,Setting.dev.lib);
    // console.log(Setting.dev.dir);
    for(var file in Setting.library) { 
      this.todo.push(file);
    //  if (Setting.library.hasOwnProperty(file)) {
    //    this.todo.push(file);
    //  }
    }
    this.download(response=>{
      this.exit('done');
    });
  },
  download:function(callback){
    if (this.todo.length) {
      var file = this.todo.shift();
      // console.log(file,this.todo);
      var urlDownload = Setting.library[file];
      var urlSave = path.join(Setting.dev.lib,file);
      got(urlDownload).then(response => {
        /*
        got.stream(urlDownload).on('error', error=>{
          // console.log(1,file);
          this.msg.success(file);
        }).on('response', response=>{
          // console.log(2,file);
          this.msg.success(file);
        }).on('redirect', response=>{
          console.log('adfd');
        }, this.download(callback)).pipe(fs.createWriteStream(urlSave));
        */
        fs.outputFile(urlSave, response.body, function (err) {
          if (err) {
            Task.msg.error(err);
          } else {
            Task.msg.success(file);
          }
          Task.download(callback);
        });
      }).catch(error => {
        this.msg.error(file);
        this.download(callback);
      });
    } else {
      // console.log(this.todo);
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
Task.init();