if (app.hasOwnProperty('header')){
  if (app.header.hasOwnProperty('container')){
    var container = app.header.container(), ul=container.firstElementChild, li=ul.lastElementChild,
    olDefault = li.firstElementChild, 
    olCurrent = li.querySelector('ul.'+app.localStorage.name.query.page),
    olActive = li.querySelector('ul.active');
    return new Promise(function(resolve, reject) {
      if (olCurrent){
        if (olCurrent.classList.contains('active') !== true) {
          if (olActive)olActive.classList.remove('active');
          olCurrent.classList.add('active');
          resolve();
        } else {
          reject();
        }
      } else if (olDefault.classList.contains('active') !== true) {
        if (olDefault != olActive && olActive)olActive.classList.remove('active');
        olDefault.classList.add('active');
        resolve();
      } else {
        reject();
      }
    }).then(function(){
      return true;
    },function(){
      return false;
    });
  }
}