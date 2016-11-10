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
      agent:function(fileMeta){
        if (win.addEventListener) {
          win.addEventListener(Config.Orientation.evt, this.orientate, false);
        } else if (win.attachEvent) {
          win.attachEvent(Config.Orientation.evt, this.orientate);
        } else {
          win[Config.Orientation.evt] = this.orientate;
        }
        this.orientate();
        var fileAgent=[], template=[], 
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

        if (this.platform.ios()) {
          Config.Device = name.ios;
        } else if (this.platform.android()) {
          Config.Device = name.android;
        } else if (this.platform.hasMethodProperty(Config.Device)) {
          // NOTE: only deploying
        } else {
          // NOTE: if Config.Screen is not equal to desktop, {default.web.mobile} to avoid error, but need to update later
          // if (Config.Screen != name.desktop) {
          //   Config.Screen = name.desktop;
          // }
          Config.Device = name.defaults;
        }
        // NOTE: for js, css
        fileAgent.push(Config.Screen, Config.Platform,Config.Device);
        // NOTE: for html
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
        var file = [], fileName = [];
        if (typeof(fileMeta) == "object") {
          for (var id in fileAgent) {
            fileName.push(fileAgent[id]);
            for (var fileType in fileMeta) {
              if (fileMeta.hasOwnProperty(fileType) && typeof(fileMeta[fileType]) === 'object') {
                if (fileMeta[fileType].filter(function(i) {return i == id}).length) {
                  file.push({type: fileType, name: fileName.join('.')});
                }
              }
            }
          }
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
      oblige:function(fileMeta){
        // app.meta.attach(app.meta.oblige(Config.Meta).concat(app.device.agent()));
        var file = [
          // {type: 'script', name: 'localforage.min'},
          // {type: 'script', name: 'data.bible'},
          // {type: 'script', name: 'data.config'}
        ];
        for (var type in fileMeta) {
          for (var src in fileMeta[type]) {
            file.push({type: type, name: fileMeta[type][src].replace(' ','.')});
          }
        }
        return file;
      },
      append:function(deviceAgent){
        delete Config.Meta.agent;
        Config.Meta = this.oblige(Config.Meta).concat(deviceAgent);
        this.attach();
      },
      attach:function(){
        try {
          var o = this, x = Config.Meta.shift(), y = x.type, url = (x.dir || o.locale[y].dir) + x.name + o.locale[y].extension,
          req = doc.createElement(y);
          o.locale[y].attr.each(function(i,v){
            req[i] = v || url;
          });
          req.onerror = function() {
            o.attach();
          };
          req.onload = function() {
            app.root.notification(x.name);
            if (Config.Meta.length) { o.attach(); } else { o.listen(); }
          };
          doc.head.appendChild(req);
        } catch (e) {
          this.listen();
        }
        // doc.head.appendChild(req);
        // doc.getElementsByTagName('head')[0].appendChild(req);
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
        Meta:{
          // script:['data bible','data config'],
          agent:{script:[0,1,2],link:[0,1,2]}
        },
        Execute:['Action'],T:[],
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
          if (typeof Config.Meta == 'object'){
            app.meta.append(app.device.agent(Config.Meta.agent));
          } else {
            app.meta.listen();
          }
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
      },
      localStorage:{
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
// =require scriptive.Prototype.Custom.js