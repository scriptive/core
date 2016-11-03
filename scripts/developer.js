require('./../scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    if (this.status.success()){
      global.packageName = this.json.package.name;
      this.setting = this.json.scriptive.common;
      // npm run build-developer -- --dir=../scriptive.developer
      if (!Argv.dir) {
        Argv.dir = path.join(this.setting.public.root,this.setting.public.developer);
      }
      this.createPublic(Argv.dir, response=> {
        this.process(this.json.scriptive.developer,"./", file=> {
          this.todo.push(file);
        });
        this.copy(done=>{
          this.status.msgSuccess(this.status.msg.Completed);
        });
      });
    }
  },
  process:function(obj,directory,callback) {
    fs.readdirSync(directory).forEach(Name=>{
      var dir = path.join(directory,Name);
      var file = path.parse(dir);
      var state = fs.statSync(dir);
      // var desDir = directory;
      if (obj.hasOwnProperty(Name)) {
        var objName = obj[Name];
        file.src=dir;
        file.des=path.join(Argv.dir,dir);
        if (this.custom.hasMethodProperty(objName)) {
          this.custom[objName](file,err=>{
            if (err) {
              this.status.msgError(this.status.msg.Error.replace('{msg}', dir));
            } else {
              this.status.msgSuccess(this.status.msg.Ok.replace('Ok', packageName).replace('{msg}', dir));
            }
          });
        } else if (objName === true) {
          callback(file);
        } else {
          this.process(objName,dir,callback);
        }
      } 
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
  custom:{
    packageJSON:function(file,callback) {
      var json = JSON.parse(fs.readFileSync(file.src));
      json.name = 'Appname';
      json.description = 'Appname description';
      delete json.keywords;
      delete json.author;
      delete json.license;
      delete json.repository;
      delete json.bugs;
      delete json.homepage;
      delete json.scripts['build-developer'];
      fs.writeFile(file.des, JSON.stringify(json, null, 2), callback);
    },
    scriptiveJSON:function(file,callback) {
      var json = JSON.parse(fs.readFileSync(file.src));
      delete json.developer;
      delete json.common.public.developer;
      fs.writeFile(file.des, JSON.stringify(json, null, 2), callback);
    },
    gulpfileJS:function(file,callback) {
      var js = fs.readFileSync(file.src, "utf8");
      if (js) {
        js = js.toString()
        .replace( /(\/\/startDeveloper)[\s\S]+(\/\/endDeveloper)/, "//Watch" )
        .replace( /(\/\/scriptDeveloper)+[\s\S]+(\/\/scriptDeveloper)/, "" );
        fs.writeFile(file.des, js, callback);
      }
    },
    fontelloConfigJSON:function(file,callback) {
      var json = JSON.parse(fs.readFileSync(file.src));
      json.name = packageName;
      json.copyright = packageName;
      // mkdir,ensureDir
      fs.ensureDir(path.dirname(file.des),function(err) {
        fs.writeFile(file.des, JSON.stringify(json, null, 2), callback);
      });
    },
    copy:function(file,callback) {
      file.Copy(callback);
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
          this.status.msgSuccess(this.status.msg.Ok.replace('Ok', packageName).replace('{msg}', file.src));
        }
        this.copy(callback);
      });
    } else {
      callback();
    }
  }
});