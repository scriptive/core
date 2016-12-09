require('./../scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    if (this.status.success()){
      if (Argv.dir) {
        if (this.json.scriptive.common.hasOwnProperty(Argv.dir) && this.json.scriptive.common[Argv.dir].root) {
          this.status.exit(this.status.msg.Danger);
        } else {
          Argv.dir = path.join(Argv.dir);
        }
      } else {
        Argv.dir = path.join(
          this.json.scriptive.common.pro.root,
          this.json.scriptive.common.unique.replace('.n', this.json.scriptive.common.name)
            .replace('.o', 'developer')
            .replace('.v', this.json.scriptive.common.version)
            .replace('.b', this.json.scriptive.common.build)
        );
      }
      if (Argv.dev) {
        if (this.command.hasOwnProperty(Argv.dev)) {
          this.command[Argv.dev].call(this,response=>{
            this.status.msgDefault(response);
          });
        } else {
          this.status.exit(this.status.msg.Unknown);
        }
      } else {
        this.commandDeveloper(progress=>{
          this.status.msgDefault(progress);
        }, complete=>{
          this.status.msgDefault(complete);
        });
      }
    }
  },
  command: {
    create:function(callback) {
      /*
      Argv.id check -> add then copy resource
      "project": {
        "Argv.id":{
          "root":"Argv.dir"
        }
      }
      */
      // npm run create -- --id=ok --dir=pro/test/
      if (Argv.id && Argv.dir) {
        this.command.connect.call(this,response=>{
          this.status.msgDefault(response);
          var scriptive_developer_extend = ['scriptive.json','asset','dev'];
          for (var id in this.json.scriptive.developer) {
            if (this.json.scriptive.developer.hasOwnProperty(id)) {
              if (scriptive_developer_extend.indexOf(id) < 0) {
                delete this.json.scriptive.developer[id];
              } 
            }
          }
          this.commandDeveloper(progress=>{
            this.status.msgDefault(progress);
          }, complete=>{
            this.status.msgDefault(complete);
          });
        });
      } else {
        this.status.msgDefault(this.status.msg.No.Init);
      }
    },
    connect:function(callback) {
      /*
      Argv.id check -> add
      "project": {
        "Argv.id":{
          "root":"Argv.dir"
        }
      }
      */
      // npm run connect -- --id=ok --dir=pro/test/
      if (Argv.id && Argv.dir) {
        var nameObj={project:{}};
        nameObj.project[Argv.id]={root:Argv.dir.replace(/\\/g,'/')};
        fs.writeFile('scriptive.json', JSON.stringify(extend(true,this.json.scriptive,nameObj), null, 2), function(err){
          callback(err||'Connected');
        });
      } else {
        callback(this.status.msg.No.Init);
      }
    },
    disconnect:function(callback) {
      /*
      Argv.id check -> remove
      "project": {
        "Argv.id":{
          "root":"Argv.dir"
        }
      }
      */
      // npm run disconnect -- --id=newapp
      if (Argv.id && this.json.scriptive.hasOwnProperty('project')) {
        delete this.json.scriptive.project[Argv.id];
        fs.writeFile('scriptive.json', JSON.stringify(this.json.scriptive, null, 2), function(err){
          callback(err||'Disconnected');
        });
      } else {
        callback('Disconnected');
      }
    }
  },
  commandDeveloper:function(progress,complete) {
    // npm run developer -- --dir=../scriptive.developer
    // npm run developer -- --pro=lst
    // npm run developer -- --pro=lst --dir=../scriptive.developer
    // npm run developer -- --pro=lst --dir=test
    // npm run developer -- --pro=lst --dir=../scriptive.laisiangtho
    this.createDirectory(Argv.dir, response=> {
      progress(response);
      this.process(this.json.scriptive.developer,path.join("./"), file=> {
        this.todo.push(file);
      });
      this.copy(done=>{
        if (this.json.scriptive.project && this.json.scriptive.project.root) {
          progress(this.status.msg.Processing);
          this.process(this.json.scriptive.developer,this.json.scriptive.project.root, file=> {
            this.todo.push(file);
          });
          this.copy(done=>{
            complete(this.status.msg.Completed);
          });
        } else {
          complete(this.status.msg.Completed);
        }
      });
    },true);
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
      delete json.project;
      for (var os in json.individual) {
        if (json.individual.hasOwnProperty(os)) {
          json.individual[os]={dist: {} };
        }
      }
      for (var name in json.common) {
        if (json.common.hasOwnProperty(name)) {
          if (typeof json.common[name] === 'object') {
            if (json.common[name].file){
              json.common[name]={file:{}};
            } else if (Object.getOwnPropertyNames(json.common[name]).length == 0) {
              // delete json.common[name];
            } else {
              delete json.common[name];
            }
          } else if (name == 'name') {
            if (Argv.id){
              json.common[name] = Argv.id;
            }
          } else {
            delete json.common[name];
          }
        }
      }
      // json.common.library={};
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