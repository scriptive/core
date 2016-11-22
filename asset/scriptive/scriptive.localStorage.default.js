name:{},
storage:win.localStorage,
select:function(key,state) {
  var val = this.storage.getItem(key);
  try {
    this.name[key] = (val?JSON.parse(val):{});
  } catch (e) {
    this.name[key] = val;
  } finally {
    return this;
  }
},
insert:function(key,val) {
  if (typeof (val) == 'object') {
    this.storage.setItem(key,JSON.stringify(val));
  } else {
    this.storage.setItem(key,val);
  }
  this.name[key] = val;
  return this;
},
update:function(key,val) {
  return this.insert(key,val||this.name[key]);
},
delete:function(key) {
  this.storage.removeItem(key);
  return this;
}