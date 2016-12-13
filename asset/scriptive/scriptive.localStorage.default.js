name:{},
storage:win.localStorage,
select:function(key,val) {
  var val = this.storage.getItem(this.ids(key));
  try {
    this.name[key] = (val?JSON.parse(val):{});
  } catch (e) {
    this.name[key] = val;
  } finally {
    return this;
  }
},
insert:function(key,val) {
  var id = this.ids(key);
  if (typeof (val) == 'object') {
    this.storage.setItem(id,JSON.stringify(val));
  } else {
    this.storage.setItem(id,val);
  }
  this.name[key] = val;
  return this;
},
update:function(key,val) {
  return this.insert(key,val||this.name[key]);
},
delete:function(key) {
  this.storage.removeItem(this.ids(key));
  return this;
},
ids:function(key) {
  return app.root.config.idUnique.replace(/unique/,key);
}