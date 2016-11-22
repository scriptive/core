Object.defineProperties(Object.prototype,{
  merge:{
    enumerable: false,
    value:function(src){
      for (var i in src) {
        try {
          // Property in desination object set; update its value.
          if ( src[i].constructor==Object ) {
            this[i].merge(src[i]);
          } else {
            this[i] = src[i];
          }
        } catch(e) {
          // Property in desination object not set; create it and set its value.
          this[i] = src[i];
        }
      }
      return this;
    }
  },
  each:{
    value:function(callback){
      var obj={
        object: function(o) {
          for (var i in o) {
            callback(i, o[i], o);
          }
        },
        array: function(o) {
          for (var i = 0, len = o.length; i < len; i++) {
            callback(o, i, o[i]);
          }
        }
      };
      return obj[typeof this](this);
    }
  },
  hasMethodProperty:{
    value:function(o){
      return this.hasOwnProperty(o) && this.isFunction(o);
    }
  },
  isFunction:{
    // isObject, isObject, isArray, 
    value:function(o){
      return typeof this[o]==='function';
    }
  }
});
Object.defineProperties(Array.prototype,{
  remove:{
    // var array = ['1', '2', '3'];
    // array.remove('2');
    value:function(){
      var item, o = arguments, i = o.length, x;
      while (i && this.length) {
        item = o[--i];
        while ((x = this.indexOf(item)) !== -1) {
          this.splice(x, 1);
        }
      }
      return this;
    }
  }
});
// Array.prototype.each = function(callback) {
//   for (var i = 0, len = this.length; i < len; i++) {
//     callback(i, this[i]);
//   }
// };
/*
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
*/
/*
Object.defineProperties(Object.prototype,{
  each:{
    value:function(callback){
      for(var i in this) {
        callback(i, this[i]);
      }
    }
  },
  byID:{
    value:function(){
      return document.getElementById(this);
    }
  },
  byClass:{
    value:function(){
      return document.getElementsByClassName(this);
    }
  },
  byTagName:{
    value:function(){
      return document.getElementsByTagName(this);
    }
  },
  byAttrNameAll:{
    value:function(){
      return document.querySelectorAll(this);
      //document.querySelectorAll('[someAttr]')
      //document.querySelector('[someAttr]')
    }
  },
  byAttrName:{
    value:function(){
      return document.querySelector(this);
    }
  }
});
*/
/*
Object.defineProperties(Object.prototype,{
  method_goes_here:{
  }
});
Object.defineProperty(Object.prototype, "method_goes_here", {
});
*/