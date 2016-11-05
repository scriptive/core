require('./../scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    if (this.status.success()){
      // npm run developer -- --dir=../scriptive.developer
      // npm run developer -- --pro=lst
      // npm run developer -- --pro=lst --dir=../scriptive.developer
      // npm run developer -- --pro=lst --dir=../scriptive.laisiangtho
      if (Argv.dir) {
        Argv.dir = path.join(Argv.dir);
      } else {
        Argv.dir = path.join(
          this.json.scriptive.common.public.root,
          this.json.scriptive.common.unique.replace('.n', this.json.scriptive.common.name)
            .replace('.o', 'developer')
            .replace('.v', this.json.scriptive.common.version)
            .replace('.b', this.json.scriptive.common.build)
        );
      }
      this.createDirectory(Argv.dir, response=> {
        this.status.msgDefault(response);
        this.process(this.json.scriptive.developer,path.join("./"), file=> {
          this.todo.push(file);
        });
        this.copy(done=>{
          if (this.json.scriptive.project && this.json.scriptive.project.root) {
            this.status.msgDefault(this.status.msg.Processing);
            this.process(this.json.scriptive.developer,this.json.scriptive.project.root, file=> {
              this.todo.push(file);
            });
            this.copy(done=>{
              this.status.msgDefault(this.status.msg.Completed);
            });
          } else {
            this.status.msgDefault(this.status.msg.Completed);
          }
        });
      },true);
    }
  },
  process:function(obj,directory,callback) {
    fs.readdirSync(directory).forEach(Name=>{
      if (obj.hasOwnProperty(Name)) {
        var dir = path.join(directory,Name);
        var file = path.parse(dir);
        var state = fs.statSync(dir);
        var objName = obj[Name];
        file.src=dir;
        file.des=path.join(Argv.dir,dir.replace(this.json.scriptive.project.root,''));
        if (this.custom.hasMethodProperty(objName)) {
          this.custom[objName].call(this,file,err=>{
            if (err) {
              if (typeof err === "string") {
                this.status.msgError(this.status.msg.Error.replace('{msg}', err));
              } else {
                this.status.msgError(this.status.msg.Error.replace('{msg}', dir));
              }
            } else {
              this.status.msgSuccess(this.status.msg.Ok.replace('Ok', this.json.scriptive.common.name).replace('{msg}', dir));
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
  custom:{
    packageJSON:function(file,callback) {
      var json = Object.assign({}, this.json.package);
      json.name = this.json.scriptive.common.name.toLowerCase().replace(/ /g, '-');
      json.description = this.json.scriptive.common.name+"'s description";
      delete json.keywords;
      delete json.author;
      delete json.license;
      delete json.repository;
      delete json.bugs;
      delete json.homepage;
      delete json.scripts.test;
      delete json.scripts.developer;
      fs.writeFile(file.des, JSON.stringify(json, null, 2), callback);
    },
    scriptiveJSON:function(file,callback) {
      var json = Object.assign({}, this.json.scriptive);
      delete json.developer;
      json.project={};
      fs.writeFile(file.des, JSON.stringify(json, null, 2), callback);
      delete this.json.scriptive.developer["package.json"];
      delete this.json.scriptive.developer["scriptive.json"];
      delete this.json.scriptive.developer["gulpfile.js"];
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
      json.name = this.json.scriptive.common.name;
      json.copyright = this.json.scriptive.common.name;
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
          this.status.msgSuccess(this.status.msg.Ok.replace('Ok', this.json.scriptive.common.name).replace('{msg}', file.src));
        }
        this.copy(callback);
      });
    } else {
      callback();
    }
  }
});