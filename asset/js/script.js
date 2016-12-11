(function(app) {
  app.load = function(o) {
    console.log("loaded");
    // var test = this.what();
    // // console.log(test);
    // test.then(function(e){
    //     // NOTE: when done
    //     console.log('what',e);
    //     // return e;
    // });
    // console.log(app.localStorage.insert('isObj',[1,2]).name.isObj);
    // app.localStorage.insert('isObj',[1,2]);
    // app.localStorage.select('isObjs');
    // console.log(app.localStorage.name.isObjs);
    // app.localStorage.name.isObj['new']='testing';
    // app.localStorage.update('isObj');
    // console.log(app.localStorage.name.isObj);
    // app.localStorage.update('love');

  };
  app.what =function(){
    return new Promise(function(resolve, reject) {
      // resolve('Ok');
      reject('Error');
    }).then(function(e) {
        // NOTE: if success
        console.log('if success',e);
        return e;
    }, function(e) {
        // NOTE: if fail
        console.log('if fail',e);
        return e;
    }).then(function(e){
        // NOTE: when done
        console.log('when done',e);
        return e;
    });
  }
}(scriptive("app")));