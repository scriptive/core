var click = ('ontouchstart' in doc.documentElement)? "touchstart" : "click";
// NOTE: each Object & Array
var tmps ={};
Object.defineProperty(Object.prototype, "each", {
  enumerable: false,
  value:function(callback){
    var a={
      object: function(o) {
        var s=0, l = Object.keys(o).length;
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            s++; callback(i, o[i], o, s==l);
          }
        }
      },
      array: function(o) {
        // console.log('array');
        var l = o.length;
        for (var i = 0; i < l; i++) {
          callback(i, o[i], o, i==l-1);
        }
      }
    };
    // return obj[typeof this](this);
    return a[this.constructor === Object?'object':'array'](this);
  }
});
Object.defineProperties(Object.prototype,{
  merge:{
    value:function(){
      // {}.merge({});
      // to Reverse
      // {}.merge(true,{});
      var a = arguments,s;
      for (var o = 0, len = a.length; o < len; o++) {
        if (a[o].isObject()) {
          for (var i in a[o]) {
            try {
              // NOTE: Property in desination object set; update its value.
              if (s){
                // NOTE: Reverse is true, update only if orginal object hasNotOwnProperty
                if (!this.hasOwnProperty(i)){
                  this[i] = a[o][i];
                } else if (this[i].isArray() || a[o][i].isArray()) {
                  this[i] = this[i].merge(a[o][i]);
                } else {
                  this[i].merge(s,a[o][i]);
                }
              } else if (this[i].isArray() || this[i].isObject()) {
                this[i] = this[i].merge(a[o][i]);
              } else {
                this[i] = a[o][i];
              }
            } catch(e) {
              // NOTE: Property in desination object not set; create it and set its value.
              this[i] = a[o][i];
            }
          }
        } else if (o === 0){
          // NOTE: checking if Reverse set to be true
          s = a[o];
        }
      }
      return this;
    }
  },
  hasMethodProperty:{
    value:function(o){
      return this.hasOwnProperty(o) && this.isFunction(o);
    }
  },
  isEmpty:{
    value:function(){
      if (this.isObject()){
        return Object.keys(this).length === 0;
      } else if (this.isArray()){
        return this.length;
      }
    }
  },
  isFunction:{
    value:function(o){
      if (o){
        return typeof this[o]==='function';
      } else {
        return this.constructor === Function;
      }
    }
  },
  isNumeric:{
    value:function(o){
      if (o){
        return this.hasOwnProperty(o) && !isNaN(parseFloat(this[o])) && isFinite(this[o]);  
      } else {
        return !isNaN(parseFloat(this)) && isFinite(this);  
      }
    }
  },
  isObject:{
    value:function(){
      return this.constructor === Object;
    }
  },
  isArray:{
    value:function(){
      return this.constructor === Array;
    }
  },
  count:{
    value:function(){
      return Object.keys(this).length;
    }
  },
  paramater:{
    value:function(url){
      var o = this;// param = Object.keys(o).reduce(function(a,k){a.push(k+'='+encodeURIComponent(o[k]));return a},[]).join('&');
      if (url){
        if (!url.isArray()){
          url = [url];
        }
      } else {
        url = [];
      }
      url.push(Object.keys(o).reduce(function(a,k){a.push(k+'='+encodeURIComponent(o[k]));return a},[]).join('&'));
      return url.toSentence('/','?')
    }
  }
});
// NOTE: Array
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
  },
  merge:{
    value:function(o){
      return this.concat(o).filter(function(item, index,o) {
        return o.indexOf(item) === index;
      });
    }
  },
  unique:{
    value:function(){
      return this.filter(function(item, index,o) {
        return o.indexOf(item) === index;
      });
    }
  },
  // removeIfduplicate:{
  //   value:function(){
  //   }
  // },
  has:{
    value:function(o){
      if(this.indexOf(o) > -1){
        return o;
      } else {
        for (var i = 0; i < this.length; i++)if (this[i] == o) return o;
      }
    }
  },
  toSentence:{
    value:function(y,x){
      return (this.length > 1) ? [this.slice(0, -1).join(y || ', '), this.slice(-1)[0]].join(x || ' & ') : this.join();
    }
  }
});
// NOTE: Element, HTMLElement
Object.defineProperties(Element.prototype,{
  styleDisplay:{
    value:function(e) {
      if (e) {
        this.style.display = e; return this;
      } else {
        return win.getComputedStyle(this,null).getPropertyValue('display') !== 'none';
      }
    }
  },
  toggleDisplay:{
    value:function(resolve, reject) {
      var e = this.styleDisplay();
      if (e && typeof reject === 'function') reject(this); else if (typeof resolve === 'function') resolve(this);
      return this.styleDisplay(e?'none':'block');
    }
  },
  toggleClass:{
    value:function(e,resolve, reject) {
      this.classList.toggle(e);
      if (this.classList.contains(e) && typeof resolve === 'function') resolve(this); else if (typeof reject === 'function') reject(this);
      return this;
    }
  },
  removeClass:{
    value:function(e) {
      this.classList.remove(e); return this;
    }
  },
  addClass:{
    value:function(e) {
      this.classList.add(e); return this;
    }
  },
  hasClass:{
    value:function(e) {
      return this.classList.contains(e);
    }
  },
  removeAttr:{
    value:function(e) {
      this.removeAttribute(e); return this;
    }
  },
  addAttr:{
    value:function(i,e) {
      this.setAttribute(i, e); return this;
    }
  },
  addContent:{
    value:function(e) {
      this.innerHTML=e; return this;
    }
  },
  // getContent:{
  //   value:function(e) {
  //     return this.innerHTML;
  //   }
  // },
  // HTML DOM Reference: hasAttribute() Method
  // HTML DOM Reference: getAttribute() Method
  // HTML DOM Reference: setAttribute() Method
  emptyElement:{
    value:function() {
      while(this.firstChild)this.removeChild(this.firstChild); return this;
    }
  },
  removeElement:{
    value:function() {
      var e = this.parentNode; e.removeChild(this); return e;
    }
  },
  eventHandler:{
    value:function(handler,callback,s){
      if (this.hasOwnProperty(handler)) return true;
      this.addEventListener(handler,callback,s);
      this[handler] = true;
    }
  },
  removeHandler:{
    value:function(handler,callback,s){
      this.removeEventListener(handler,callback,s);
      delete this[handler];
    }
  },
  eventClick:{
    value:function(callback,s){
      if (this.hasOwnProperty(click)) return this;
      if (/touch/.test(click)){
        var i=true;
        this.addEventListener("touchstart", function(){ i=true; }, s);
        this.addEventListener("touchcancel", function(){ i=false; }, s);
        this.addEventListener("touchmove", function(){ i=false; }, s);
        this.addEventListener("touchend", function(e){ if(i)callback(e); }, s);
      } else {
        this.addEventListener(click,callback,s);
      }
      this[click] = true;
      return this;
    }
  },
  removeClick:{
    value:function(callback,s){
      if (this.hasOwnProperty(click)){
        if (/touch/.test(click)){
          var i=true;
          this.removeEventListener("touchstart", function(){ i=true; }, s);
          this.removeEventListener("touchcancel", function(){ i=false; }, s);
          this.removeEventListener("touchmove", function(){ i=false; }, s);
          this.removeEventListener("touchend", function(e){ if(i)callback(e); }, s);
        } else {
          this.removeEventListener(click,callback,s);
        }
        delete this[click];
      }
      return this;
    }
  }
});
// Object.defineProperty(Object.prototype, "eventHandler", {
//   enumerable: true,
//   configurable: true,
//   value:function(handler,callback,status){
//     console.log('org');
//     if (!this.hasOwnProperty(handler))this.addEventListener(handler,callback,status), this[handler] = true;
//   }
// });
// (function(win,doc){})(window,document);
/*
document.getElementById('idname');
document.getElementsByClassName('classname');
document.getElementsByTagName('div');
document.querySelectorAll(this);
document.querySelectorAll('[someAttr]')
document.querySelector('[someAttr]')
document.querySelector('.a');
for (var i = 0, len = o.length; i < len; i++) {}
Object.defineProperties(Object.prototype,{
  method_goes_here:{}
});
Object.defineProperty(Object.prototype, "method_goes_here", {});
*/