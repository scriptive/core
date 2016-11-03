require('./../scripts/task')({
  json:{
    package:'package.json',
    scriptive:'scriptive.json'
  },
  initial:function() {
    if (this.status.success()){
      this.process();
    }
  },
  process:function() {
    for(var file in this.json.scriptive.common.library) { 
      this.todo.push(file);
    }
    this.download(response=>{
      this.status.exit('Done');
    });
  },
  download:function(callback){
    if (this.todo.length) {
      var file = this.todo.shift();
      var fileDownload = this.json.scriptive.common.library[file];
      var jDev = this.json.scriptive.common.dev;
      var fileSave = path.join(jDev.root,jDev.lib,file);
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
        // console.log(error);
        this.status.msgError(this.status.msg.No.File.replace('file',file));
        this.download(callback);
      });
    } else {
      callback();
    }
  }
});