return new Promise(function(resolve, reject) {
  app.fileStorage = fileStorage(configuration.fileStorage, {
    success: function() {
      resolve();
    },
    fail: function(e) {
      reject(e);
    }
  }
 );
}).then(function(){
  return true;
},function(e){
  return e;
});