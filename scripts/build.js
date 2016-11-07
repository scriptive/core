require('./../scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    /*
    npm run build -- --os=
    npm run build -- --os=ios --pro=lst
    npm run build -- --os=ios --pro=eba
    npm run build -- --os=ios --dir=../scriptive.appName --pro=eba
    npm run build --  --os=web --dir=docs
    */
    if (this.status.success()){
      if (Argv.os) {
        if (this.json.scriptive.individual.hasOwnProperty(Argv.os)) {
          this.setting = extend(true, this.json.scriptive.common, this.json.scriptive.individual[Argv.os]);
          if (Argv.dir) {
            if (this.setting.hasOwnProperty(Argv.dir) && this.setting[Argv.dir].root) {
              if (this.setting[Argv.dir].root == "docs") {
                if (this.json.scriptive.project && this.json.scriptive.project.root) {
                  Argv.dir = path.join(this.json.scriptive.project.root,Argv.dir);
                }
              } else {
                this.status.exit(this.status.msg.Danger);
              }
            }
            Argv.dir = path.join(Argv.dir);
          } else {
            Argv.dir = path.join(
              this.setting.public.root,
              this.setting.unique.replace('.n', this.setting.name)
                .replace('.o', Argv.os)
                .replace('.v', this.setting.version)
                .replace('.b', this.setting.build)
            );
          }
          if (!this.setting.dev.main) {
            this.setting.dev.main = Argv.os;
          }
          this.createDirectory(Argv.dir, response=> {
            this.status.msgDefault(response);
            Argv.root = path.join(this.setting.dev.root);
            this.process(Argv.root,response=> {
              if (this.json.scriptive.project && this.json.scriptive.project.root) {
                this.status.msgDefault(this.status.msg.Processing);
                Argv.root = path.join(this.json.scriptive.project.root,Argv.root);
                this.setting.image.root = path.join(this.json.scriptive.project.root,this.setting.image.root);
                this.setting.config.root = path.join(this.json.scriptive.project.root,this.setting.config.root);
                this.process(Argv.root,response=> {
                  this.status.msgDefault(this.status.msg.Completed);
                });
              } else {
                this.status.msgDefault(this.status.msg.Completed);
              }
            });
          },true);
        } else {
          this.status.exit(this.status.msg.Invalid.OS.replace('{os}', Argv.os));
        }
      } else {
        this.status.exit(this.status.msg.No.OS);
      }
    }
  },
  process:function(dir,callback) {
    this.readDevelopment(dir, file=> {
      if (file) {
        this.todo.push(file);
      }
    });
    this.copy(done=>{
      //Development done
      this.todo.push({
        'src': path.join(this.setting.image.root, Argv.os),
        'des': path.join(Argv.dir, 'img')
      });
      this.copy(done=> {
        // Image done
        this.todo.push({
          'src': path.join(this.setting.config.root, Argv.os),
          'des': Argv.dir
        });
        this.copy(done => {
          callback();
        });
      });
    });
  },
  readDevelopment: function(o, callback) {
    if (fs.existsSync(o)) {
      fs.readdirSync(o).forEach(fileName=>{
        var dir = path.join(o, fileName);
        var file = path.parse(dir);
        var state = fs.statSync(dir);
        if (state.isFile()) {
          file.src = dir;
          var dirName = file.dir.split(path.sep).pop();
          if (dirName == this.setting.dev.root) {
            if (Object.keys(this.setting.dist.file.root).every(reg=> {
                  return new RegExp(reg).test(fileName) === this.setting.dist.file.root[reg];
                })){
                  if (this.setting.dev.main == file.name && file.ext == '.html') {
                      file.des = path.join(Argv.dir, this.setting.dist.main + file.ext);
                  }else{
                      file.des = path.join(Argv.dir, fileName);
                  }
              callback(file, state);
            }
          } else {
            if (Object.keys(this.setting.dist.file[dirName]).every(reg=> {
                return new RegExp(reg).test(fileName) === this.setting.dist.file[dirName][reg];
              })) {
              file.des = path.join(dir.replace(Argv.root, Argv.dir));
              callback(file, state);
            }
          }
        } else if (state.isDirectory()) {
          if (this.setting.dist.file.hasOwnProperty(fileName)) this.readDevelopment(dir, callback);
        }
      });
    } else {
      callback();
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
          this.status.msgSuccess(this.status.msg.Ok.replace('Ok', this.setting.name).replace('{msg}', file.src.replace(/\\/g,"/").replace('dev/','')));
        }
        this.copy(callback);
      });
    } else {
      callback();
    }
  }
});