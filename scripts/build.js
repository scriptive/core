require('./../scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    if (this.status.success()){
      if (Argv.os) {
        if (this.json.scriptive.individual.hasOwnProperty(Argv.os)) {
          this.setting = extend(true, this.json.scriptive.common, this.json.scriptive.individual[Argv.os]);
          if (!this.setting.dev.main) this.setting.dev.main = Argv.os;
          this.setting.os = Argv.os;
          //Package.name,process.env.npm_package_name
          this.setting.unique = this.setting.unique.replace('.n', this.setting.name).replace('.o', Argv.os).replace('.v', this.setting.version).replace('.b', this.setting.build);
          this.setting.dev.dir = path.join(this.setting.dev.root);
          if (Argv.dir) {
            this.setting.dist.dir = path.join(Argv.dir);
          } else {
            this.setting.dist.dir = path.join(this.setting.dist.dir, this.setting.unique);
          }
          this.process();
        } else {
          this.status.exit(this.status.msg.Invalid.OS.replace('{os}', Argv.os));
        }
      } else {
        this.status.exit(this.status.msg.No.OS);
      }
    }
  },
  process:function() {
    this.createProduction(this.setting.dist.dir, response=> {
      console.log('creating', this.setting.os,'(',this.setting.unique,')');
      this.readDevelopment(this.setting.dev.dir, file=> {
        this.todo.push(file);
      });
      this.copy(done=>{
        //Development done
        this.todo.push({
          'src': path.join(this.setting.image.root, this.setting.os),
          'des': path.join(this.setting.dist.dir, 'img')
        });
        this.copy(done=> {
          // Image done
          this.todo.push({
            'src': path.join(this.setting.config.root, this.setting.os),
            'des': this.setting.dist.dir
          });
          this.copy(done => {
            // Configuration done
          });
        });
      });
    });
  },
  createProduction: function(dir, callback) {
    dir.Exists(error =>{
      if (error) {
        // NOTE: directory exists
        dir.Empty(error => {
          // NOTE: make it empty
          if (error) {
            this.status.exit(error);
          } else {
            callback('current directory destroyed and rebuild empty!');
          }
        });
      } else {
        // NOTE: new directory
        dir.Create(error => {
          if (error) {
            this.status.exit(error);
          } else {
            callback('new directory created!');
          }
        });
      }
    });
  },
  readDevelopment: function(o, callback) {
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
                    file.des = path.join(this.setting.dist.dir, this.setting.dist.main + file.ext);
                }else{
                    file.des = path.join(this.setting.dist.dir, fileName);
                }
            callback(file, state);
          }
        } else {
          if (Object.keys(this.setting.dist.file[dirName]).every(reg=> {
            // console.log(dirName,reg);
              return new RegExp(reg).test(fileName) === this.setting.dist.file[dirName][reg];
            })) {
            file.des = path.join(dir.replace(this.setting.dev.root, this.setting.dist.dir));
            callback(file, state);
          }
        }
      } else if (state.isDirectory()) {
        if (this.setting.dist.file.hasOwnProperty(fileName)) this.readDevelopment(dir, callback);
      }
    });
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