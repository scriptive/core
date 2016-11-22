/*!
    scriptive -- Javascript application service
    Version 1.0.1
    https://scriptive.github.io/core
    (c) 2016
*/
(function(os,win,doc) {
  'use strict';
  // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  var ob='app',Config={};
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
      // =require scriptive.Device.default.js
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
          // {type: 'script', name: 'data.setting'},
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
        // =require scriptive.Config.default.js
      }, 
      scriptive:{
        version:'2.1.23.2016.1.5'
      },
      document:function(response){
        // Object.assign.call(response, {config: {}});
        response.merge({config: {}});
        Config = this.config.merge(response.config);
        app.ready(function(event){
          if (response.hasOwnProperty('ready')){
            response.ready.call(app.root,event);
          }
          if (typeof Config.msg.info == 'string'){
            Config.msg.info = doc.querySelector(Config.msg.info);
          }
          if (typeof (Config.Orientation) == 'object') {
            app.device.orientate((Object.prototype.hasOwnProperty.call(window, "onorientationchange")) ? "orientationchange" : "resize");
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
        // =require scriptive.localStorage.default.js
      }
      // tmp:function(){
      //   console.log('tmp');
      // }
    }
  };
  win[os] = function(a){
    return new app.init(a);
  }
}("scriptive",window,document));
// =require scriptive.define.Properties.js
// require scriptive.Array.prototype.js
// require scriptive.Object.prototype.js