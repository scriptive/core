var localName = local.name, 
  fO = {
    page: 'home', q: '', result: ''
  },
  fM = {
    page: function(i, o, d) {
      localName.query[i] = configuration.page.hasOwnProperty(o.toLowerCase())?o.toLowerCase():d;
    },
    q: function(i, o, d) {
      localName.query[i] = decodeURIComponent(o);
    }
};
return new Promise(function(resolve, reject) {
  try {
    if (localName.query.isEmpty()){
      localName.query.merge(fO,configuration.hash);
    } else {
      localName.query.merge(configuration.hash);
    }
    localName.query.each(function(i,v,o,s){
      if (fM.isFunction(i))fM[i](i, v, fO[i]);
    });
    resolve();
  } catch (e) {
    reject(e);
  }
}).then(function() {
  local.update('query');
  return true;
}, function(e) {
  return e;
});