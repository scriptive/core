var rmdir = require('rmdir');
require('./../dist/task')({
  // id:'app',
  json:{
    package:'package.json',
    build:'config/build.json'
  },
  initial:function() {
    this.rmDir("public/d/d");
  },
  rmDir:function(dirPath) {
    if( fs.existsSync(dirPath) ) {
      fs.readdirSync(dirPath).forEach((file,index)=>{
        var curPath =path.join(dirPath,file);
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          this.rmDir(curPath);
        } else { // delete file
          var msgFile = fs.unlinkSync(curPath);
          if (msgFile){
            console.log(file,msgFile);
          } else {
            console.log(file);
          }
        }
      });
      var msgDir = fs.rmdirSync(dirPath);
      if (msgDir){
        console.log(dirPath,msgDir);
      }
    }
  },
  initial_org:function() {
    if (this.status.success()){
      this.setting = this.json.build.common;
      this.setting.public.dir = path.join(this.setting.public.root);
      this.developerRoot = path.join(this.setting.public.dir,'abc');
      this.createPublic(this.developerRoot, response=> {
        this.package(error=> {
          if (error) {
            this.status.exit(error);
          } else {
            this.gulpfile(error=> {
              if (error) {
                this.status.exit(error);
              } else {
                this.process(this.json.build.developer,"./", file=> {
                  // console.log('??',file);
                  this.todo.push(file);
                });
                this.copy(done=>{
                  console.log('done');
                });
              }
            });
          }
        });
      });
    }
  },
  process:function(obj,directory,callback) {
    fs.readdirSync(directory).forEach(Name=>{
      var dir = path.join(directory,Name);
      var file = path.parse(dir);
      var state = fs.statSync(dir);
      var desDir = directory;
      if (obj.hasOwnProperty(Name)) {
        if (obj[Name] == true) {
          file.src=dir;
          file.des=path.join(this.developerRoot,dir);
          callback(file);
        } else {
          if (state.isFile()){
            console.log('file',Name);
          }
          this.process(obj[Name],dir,callback);
        }
        /*
        if (state.isFile()){
          callback(file);
        } else {
          // console.log('dir',Name);
          this.process(obj[Name],dir,callback);
        }
        */
        
        // console.log(typeof obj[Name]);
      }
      /*
      file.src=dir;
      if (obj.hasOwnProperty(Name)) {
        if (state.isFile()){
          // console.log('file',Name);
          file.des=path.join(this.developerRoot,Name);
          callback(file);
        } else {
          // console.log('dir',Name);
          this.process(obj[Name],dir,callback);
        }
      }
      */
      /*
      file.src=dir;
      file.des=path.join(this.developerRoot,Name);
      callback(file);
      */
    });
  },
  createPublic: function(dir, callback) {
    dir.Exists(error =>{
      if (error) {
        // NOTE: directory exists
        callback('Directory exists');
      } else {
        // NOTE: new directory
        dir.Create(error => {
          if (error) {
            this.status.exit(error);
          } else {
            callback('New directory created!');
          }
        });
      }
    });
  },
  package:function(callback) {
    var json = extend(false, this.json.package);
    json.name = 'Appname';
    json.description = 'Appname description';
    delete json.keywords;
    delete json.author;
    delete json.license;
    delete json.repository;
    delete json.bugs;
    delete json.homepage;
    delete json.scripts['build-developer'];
    json = JSON.stringify(json, null, 2);
    var packageJSON = path.join(this.developerRoot,'package.json');
    fs.writeFile(packageJSON, json, callback);
  },
  gulpfile:function(callback) {
    var data = fs.readFileSync('./gulpfile.js', "utf8");
    if (data) {
      data = data.toString()
      .replace( /(\/\/startDeveloper)[\s\S]+(\/\/endDeveloper)/, "//Watch" )
      .replace( /(\/\/scriptDeveloper)+[\s\S]+(\/\/scriptDeveloper)/, "" );
      fs.writeFile(path.join(this.developerRoot,'gulpfile.js'), data, callback);
    }
  },
  copy: function(callback) {
    if (this.todo.length) {
      var file = this.todo.shift();
      file.Copy(error => {
        if (error) {
          if (this.status.msg.hasOwnProperty(error.code)) {
            this.status.msgError(this.status.msg[error.code].replace('{msg}', file.src));
          } else {
            this.status.msgError(this.status.msg.Error.replace('{msg}', error));
          }
        } else {
          // this.status.msgSuccess(this.status.msg.Ok.replace('Ok', this.setting.unique).replace('{msg}', file.src.replace('dev','')));
          // var msg = file.des.replace('dev',this.setting.name);
          // this.status.msg.Ok.replace('Ok', this.setting.os).replace('{msg}', file.src.replace('dev',this.setting.name));
          // this.status.msgSuccess(this.status.msg.Ok.replace('Ok', this.setting.os).replace('{msg}', file.src.replace('dev',this.setting.name)));
          this.status.msgSuccess(this.status.msg.Ok.replace('Ok', this.setting.name).replace('{msg}', file.src.replace(/\\/g,"/").replace('dev/','')));
          // console.log(file.des);
        }
        this.copy(callback);
      });
    } else {
      callback();
    }
  }
  
});