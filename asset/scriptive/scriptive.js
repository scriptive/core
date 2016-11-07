/*!
    scriptive -- Javascript application service
    Version 1.0.0
    https://scriptive.github.io/script
    (c) 2016
    root->initial{meta,device}->listen->initiate
*/
(function(win,doc) {
  'use strict';
  // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  var os = 'scriptive',ob='app',Config={};
  var app={
    todo:{
      1:'a'
    },
    init:function(a){
      var id=typeof a;
      if (app.fn.hasOwnProperty(id)){
        return app.fn[id](a);
      }
    },
    ready:function(callback){
      doc.addEventListener("DOMContentLoaded", callback, false );
    },
    fn:{
      object:function(a){
        return app.assign();
      },
      string:function(a){
        return win[a] = app.assign();
      }
    },
    assign:function(){
      return this.root.merge(win[os]);
    },
    device:{
      platform:{
        is:function(needle){return navigator.userAgent.toLowerCase().indexOf(needle) !== -1;},
        ios:function(){return this.iphone() || this.ipod() || this.ipad();},
        iphone:function(){return !this.windows() && this.is('iphone');},
        ipod:function(){return this.is('ipod');},
        ipad:function(){return this.is('ipad');},
        android:function(){return !this.windows() && this.is('android');},
        ADP:function(){return this.android() && this.is('mobile');},
        ADT:function(){return this.android() && !this.is('mobile');},
        blackberry:function(){return this.is('blackberry') || this.is('bb10') || this.is('rim');},
        BBP:function(){return this.blackberry() && !this.is('tablet');},
        BBT:function(){return this.blackberry() && this.is('tablet');},
        windows:function(){return this.is('windows');},
        WDP:function(){return this.windows() && this.is('phone');},
        WDT:function(){return this.windows() && (this.is('touch') && !this.WDP());},
        fxos:function(){return (this.is('(mobile;') || this.is('(tablet;')) && this.is('; rv:');},
        FFP:function(){return this.fxos() && this.is('mobile');},
        FFT:function(){return this.fxos() && this.is('tablet');},
        meego:function(){return this.is('meego');},
        cordova:function(){return win.cordova && location.protocol === 'file:';},
        chrome:function(){return Config.Platform === 'chrome';},
        nodeWebkit:function(){return typeof window.process === 'object';},
        mobile:function(){return this.ADP() || this.iphone() || this.ipod() || this.WDP() || this.BBP() || this.FFP() || this.meego();},
        tablet:function(){return this.ipad() || this.ADT() || this.BBT() || this.WDT() || this.FFT();}
        // desktop:function(){return !this.tablet() && !this.mobile();}
      },
      agent:function(){
        if (win.addEventListener) {
          win.addEventListener(Config.Orientation.evt, this.orientate, false);
        } else if (win.attachEvent) {
          win.attachEvent(Config.Orientation.evt, this.orientate);
        } else {
          win[Config.Orientation.evt] = this.orientate;
        }
        this.orientate();
        var d=[], template=[], 
          name ={
            desktop:'desktop', tablet:'tablet', mobile:'mobile', 
            ios:'ios', android:'android', defaults:'default',
            web:'web', app:'app'
          };
        Config.isCordova = this.platform.cordova();
        Config.isChrome = this.platform.chrome();
        if (!Config.Platform) Config.Platform = name.web;
        if (!Config.Screen) Config.Screen = name.desktop;
        if (this.platform.mobile()) {
          Config.Screen = name.mobile;
        } else if (this.platform.tablet()) {
          Config.Screen = name.tablet;
        } 
        // NOTE: for js, css
        d.push(Config.Screen, Config.Platform);
        if (this.platform.ios()) {
          Config.Device = name.ios;
        } else if (this.platform.android()) {
          Config.Device = name.android;
          // this.platform.hasMethodProperty(Config.Device)
        } else if (this.platform.hasMethodProperty(Config.Device)) {
          // NOTE: only deploying
        } else {
          // NOTE: if Config.Screen is not equal to desktop, {default.web.mobile} to avoid error, but need to update later
          // if (Config.Screen != name.desktop) {
          //   Config.Screen = name.desktop;
          // }
          Config.Device = name.defaults;
        }
        d.push(Config.Device);
        Config.DeviceTemplate = [Config.Device, Config.Platform, Config.Screen];
        /*
        chrome: {
          Device:'chrome', Platform:'app', Screen:'desktop'
        }
        ios: {
          Device:'ios', Platform:'app', Screen:'mobile'
        }
        android: {
          Device:'android', Platform:'app', Screen:'mobile'
        }
        default: {
          Platform:'web'
        }
        */
        var file = [], df = [];
        for (var i in d) {
          df.push(d[i]);
          var fl = df.join('.');
          file.push({type: 'link', name: fl}, {type: 'script', name: fl});
        }
        return file;
      },
      orientate:function(){
        doc.querySelector("html").setAttribute('class',(win.innerHeight < win.innerWidth?Config.Orientation.landscape:Config.Orientation.portrait));
      }
    },
    meta:{
      locale:{
        script: {
          attr: {
            src: null
          },
          extension: '.js',
          dir: 'js/'
        },
        link: {
          attr: {
            rel: 'stylesheet',
            href: null
          },
          extension: '.css',
          dir: 'css/'
        }
      },
      oblige:function(q){
        // app.meta.attach(app.meta.oblige(Config.Meta).concat(app.device.agent()));
        var file = [
          // {type: 'script', name: 'localforage.min'},
          // {type: 'script', name: 'data.bible'},
          // {type: 'script', name: 'data.config'}
        ];
        for (var type in q) {
          for (var src in q[type]) {
            file.push({type: type, name: q[type][src].replace(' ','.')});
          }
        }
        return file;
      },
      append:function(){
        Config.Meta = this.oblige(Config.Meta).concat(app.device.agent());
        this.attach();
      },
      attach:function(){
        var o = this, x = Config.Meta.shift(), y = x.type, url = (x.dir || o.locale[y].dir) + x.name + o.locale[y].extension,
        req = doc.createElement(y);
        o.locale[y].attr.each(function(i,v){
          req[i] = v || url;
        });
        req.onload = function() {
          app.root.notification(x.name);
          if (Config.Meta.length) { 
            o.attach();
          } else {
            o.listen();
          }
        };
        doc.head.appendChild(req);
        //doc.getElementsByTagName('head')[0].appendChild(req);
      },
      listen:function(){
        app.root.notification('class','icon-database');
        if (Config.isCordova) {
          app.root.notification('getting Device ready');
          doc.addEventListener("deviceready", this.initiate, false);
        } else {
          this.initiate();
        }
      },
      initiate:function(){
        Config.Execute.each(function(i,v){
          i = (typeof v === 'object') ? Object.keys(v)[0] : v;
          app.root.execute.call(app.root,i.split(' '),v[i]);
        });
      }
    },
    root:{
      todo:{
      }, 
      config:{
        Meta:[],Execute:['Action'],T:[],
        // load, event, task
        Handler: ('ontouchstart' in document.documentElement ? "touchstart" : "click"),
        On: 'fO', Hash: 'hashchange', Device: 'desktop', Platform: 'web', Layout: null, Browser: 'chrome',
        fileSystask:'Chrome', //temporary
        Orientation: {change: 'D1699',landscape: 'landscape',portrait: 'portrait'},
        note: {}, lang: {}, query: {},
        lookup: {
            setting: {},book: {}
        },
        previous: {},
        todo: {
            Orientation: true,
            // NOTE: if Template=true will be loaded Template!
            Template: true
        },
        container: {},
        msg: {
            info: '#msg'
        }
      }, 
      scriptive:{
        version:'2.1.23.2016.1.5'
      },
      document:function(response){
        // Object.assign.call(response, {config: {}});
        response.merge({config: {}});
        Config = this.config.merge(response.config);
        app.ready(function(event){
          Config.Orientation.evt = (Object.prototype.hasOwnProperty.call(window, "onorientationchange")) ? "orientationchange" : "resize";
          if (response.hasOwnProperty('ready')){
            response.ready.call(app.root,event);
          }
          if (typeof Config.msg.info == 'string'){
            Config.msg.info = doc.querySelector(Config.msg.info);
          }
          app.meta.append();
        });
      },
      notification:function(){
        // app.notification('msg');
        // app.notification('class','blink');
        // app.notification('msg','class','blink');
        if (this.config.msg.info !== null) {
          if (arguments.length > 1){
            this.config.msg.info.setAttribute(arguments[0],arguments[1])
          } else {
            this.config.msg.info.innerHTML=arguments[0];
          }
          return this.config.msg.info;
        }
      },
      execute:function(x,y) {
        var i=x.shift();
        if (this.hasOwnProperty(i)){
          if (this.isFunction(i)){
            return this[i](y);
          } else if (x.length) {
            return app.root.execute.call(this[i],x,y);
          }
        }
        return false;
      },
      handler:function() {
        // querySelector,querySelectorAll
        var element = doc.getElementsByClassName(Config.On);
        for (var i = 0; i < element.length; i++) {
          element[i].addEventListener(Config.Handler, (function(event) {
            var query = this.getAttribute('class').split(' ').filter(function(e){return e}).remove(Config.On);
            app.root.execute.call(app.root,query,event);
          }));
        }​
      },
      metalink:function() {
        arguments[0].each(function(i,v){
          win[v] = doc.querySelector('link[rel=0]'.replace(0,v)).getAttribute('href');
        });
      },
      metacontent:function() {
        arguments[0].each(function(i,v){
          win[v] = doc.querySelector('meta[name=0]'.replace(0,v)).getAttribute('content');
        });
      }
      // tmp:function(){
      //   console.log('tmp');
      // }
    }
  };
  win[os] = function(a){
    return new app.init(a);
  }
}(window,document));
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