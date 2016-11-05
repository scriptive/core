var got = require('got');
require('./../scripts/task')({
  json:{
    scriptive:'scriptive.json'
  },
  initial:function() {
    // npm run download -- --pro=eba
    if (this.status.success()){
      if (this.json.scriptive.project && this.json.scriptive.project.root) {
        this.json.scriptive.common.dev.root = path.join(this.json.scriptive.project.root,this.json.scriptive.common.dev.root);
      } 
      this.process();
    }
  },
  process:function() {
    for(var file in this.json.scriptive.common.library) { 
      this.todo.push(file);
    }
    this.download(response=>{
      this.status.exit(this.status.msg.Completed);
    });
  },
  download:function(callback){
    if (this.todo.length) {
      var file = this.todo.shift();
      var fileDownload = this.json.scriptive.common.library[file];
      var fileSave = path.join(this.json.scriptive.common.dev.root,this.json.scriptive.common.dev.lib,file);
      got(fileDownload).then(response => {
        fs.outputFile(fileSave, response.body, error => {
          if (error) {
            this.status.msgError(error);
          } else {
            this.status.msgSuccess(file);
          }
          this.download(callback);
        });
      }).catch(error => {
        this.status.msgError(this.status.msg.No.File.replace('file',file));
        this.download(callback);
      });
    } else {
      callback();
    }
  }
});