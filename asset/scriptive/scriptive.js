/*!
    scriptive -- Javascript application service
    Version {package.version}-{application.buildDate}
    https://scriptive.github.io/core
*/
(function(a0,win,doc) {
  'use strict';
  // =require scriptive.define.Properties.js
  // win.indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
  var a1='app',a1Unique=':unique',
  core={
    i0:function(a){
      var i=typeof a;
      if (core.f0.hasOwnProperty(i)) return core.f0[i](a);
    },
    f0:{
      object:function(a){
        return app.merge(a);
      },
      string:function(a){
        a1 = a; return win[a] = app;
      }
    },
    // callback:{
    //   before:function(e){
    //     // NOTE: before processing the task!
    //     return e;
    //   },
    //   progress:function(e){
    //     // NOTE: while processing!  completed 'Percentage' return!
    //     return e;
    //   },
    //   done:function(e){
    //     // NOTE: upon completion, either success or fail!
    //     return e;
    //   },
    //   fail:function(e){
    //     // NOTE: only the task fail, if not success!
    //     return e;
    //   },
    //   success:function(e){
    //     // NOTE: only the task success, if not fail
    //     return e;
    //   }
    // },
    device:{
      // =require scriptive.Device.default.js
    },
    hash:function(){
      var r=app.config.hash,q,o=win.location.hash.split('?');
      // var o = win.location.href.slice(win.location.href.indexOf('#') + 1).split('?')
        if (o.length){
          var hash = o[0].split('/');
          for(var i = 0; i < hash.length; i++){
            if (hash[i]) {
              if (i == 0){
                r['page']=hash[i].replace(/#/,'');
              } else {
                r[i]=hash[i];
              }
            }
          }
          if (o.length > 1){
            var search = /([^\?#&=]+)=([^&]*)/g;
            while (q = search.exec(o[1])) r[q[1]] = q[2];
          }
        }
      return r;
    },
    idUnique:function(id) {
      if (app.config.hasOwnProperty('idUnique')){
        if (app.config.idUnique.search(a1Unique) < 0 ) app.config.idUnique = app.config.idUnique+a1Unique;
      } else if (typeof id == 'string'){
        if (id.search(a1Unique) < 0 ){
          app.config.idUnique = id+a1Unique;
        } else {
          app.config.idUnique = id;
        }
      } else {
        app.config.idUnique = a1+a1Unique;
      }
    },
    data:{
      execute:function(x,y) {
        var i=x.shift();
        if (this.hasOwnProperty(i)){
          if (this.isFunction(i)){
            return this[i](y);
          } else if (x.length) {
            return core.data.execute.call(this[i],x,y);
          }
        }
        return false;
      },
      link:function(s) {
        doc.querySelectorAll('[0]'.replace(0,s)).each(function(i,e){
          if (e.styleDisplay())
            e.eventClick(function() {
              core.data.execute.call(app,e.getAttribute(s).split(' ').filter(function(e){return e}),e);
            });
        });
      },
      content:function(s) {
        doc.querySelectorAll('[0]'.replace(0,s)).each(function(i,e){
          if (e.styleDisplay())
            core.data.execute.call(app,e.getAttribute(s).split(' ').filter(function(e){return e}),e);
        });
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
        // core.meta.attach(core.meta.oblige(app.config.Meta).concat(core.device.agent()));
        var file = [
          // {type: 'script', name: 'data.setting'},
          // {type: 'script', name: 'data.config'}
        ];
        for (var type in fileMeta) {
          for (var src in fileMeta[type]) {
            file.push({type: type, name: fileMeta[type][src].toString().replace(' ','.')});
          }
        }
        return file;
      },
      append:function(deviceAgent){
        // TODO: remove comment
        delete app.config.Meta.agent;
        app.config.Meta = this.oblige(app.config.Meta).concat(deviceAgent);
        this.attach();
      },
      attach:function(){
        try {
          var o = this, x = app.config.Meta.shift(), y = x.type, url = (x.dir || o.locale[y].dir) + x.name + o.locale[y].extension,
          req = doc.createElement(y);
          o.locale[y].attr.each(function(i,v){
            req[i] = v || url;
          });
          req.onerror = function() {
            o.attach();
          };
          req.onload = function() {
            app.notification(x.name);
            if (app.config.Meta.length) { o.attach(); } else { o.listen(); }
          };
          doc.head.appendChild(req);
        } catch (e) {
          this.listen();
        }
        // doc.head.appendChild(req);
        // doc.getElementsByTagName('head')[0].appendChild(req);
      },
      listen:function(){
        app.notification('getting Ready...');
        if (app.config.isCordova) {
          doc.addEventListener("deviceready", this.initiate, false);
        } else {
          this.initiate();
        }
      },
      initiate:function(){
        core.hash(),app.config.Execute.each(function(i,v){
          i = (typeof v === 'object') ? Object.keys(v)[0] : v;
          core.data.execute.call(app,i.split(' '),v[i]);
        });
      }
    }
  },
  app={
    config:{
      // =require app.Configuration.js
    },
    document:function(response){
      if (response.hasOwnProperty('config') && response.config.constructor === Object){
        app.config.merge(response.config);
        if (response.config.hasOwnProperty('Meta')){
          if (response.config.Meta.hasOwnProperty('agent'))app.config.Meta.agent=response.config.Meta.agent;
        }
      }
      doc.addEventListener("DOMContentLoaded", function(event){
        // NOTE: Configuration
        if (response.hasOwnProperty('ready'))response.ready.call(app,event);
        // NOTE: Message
        if (typeof app.config.msg.info == 'string')app.config.msg.info = doc.querySelector(app.config.msg.info);
        core.idUnique(app.config.id);
        // NOTE: Orientation
        if (app.config.Orientation.isEmpty() != true)core.device.orientate(win.hasOwnProperty.call(win, "onorientationchange") ? "orientationchange" : "resize");
        // core.device.orientate((Object.prototype.hasOwnProperty.call(win, "onorientationchange")) ? "orientationchange" : "resize");
        // NOTE: Prepare
        if (typeof app.config.Meta === 'object'){
          core.meta.append(core.device.agent(app.config.Meta.agent));
        } else {
          core.meta.listen();
        }
        // NOTE: Observer
        // app.Observer = new MutationObserver(function(mutations) { app.dataLink(); });
        // app.Observer.observe(doc.body, {attributes: true, subtree:true });
        new MutationObserver(function(mutations) {
          app.dataLink();
        }).observe(doc.body, {attributes: true, subtree:true });
        // { attributes: true,childList: true, characterData: true, subtree:true }
      }, false);
    },
    notification:function(){
      // core.notification('msg');
      // core.notification('class','blink');
      // core.notification('msg','class','blink');
      if (app.config.msg.info !== null) {
        if (arguments.length > 1){
          app.config.msg.info.setAttribute(arguments[0],arguments[1]);
        } else {
          app.config.msg.info.innerHTML=arguments[0];
        }
        return app.config.msg.info;
      }
    },
    // dataExecute:function(x,y) {
    //   return core.data.execute.call(this,x,y);
    // },
    dataLink:function(d) {
      core.data.link(d?d:app.config.dataLink);
    },
    dataContent:function(d) {
      core.data.content(d?d:app.config.dataContent);
    },
    metaLink:function(e) {
      e.each(function(i,v){
        win[v] = doc.querySelector('link[rel=0]'.replace(0,v)).getAttribute('href');
      });
    },
    metaContent:function(e) {
      e.each(function(i,v){
        win[v] = doc.querySelector('meta[name=0]'.replace(0,v)).getAttribute('content');
      });
    },
    localStorage:{
      // =require app.localStorage.default.js
    },
    // eventHash eventHash, hashContent
    hashChange:function(callback){
      win.addEventListener('hashchange', function(event){
        if (typeof callback === 'function')core.hash(),callback(event);
      },false);
    },
    elementCreate: function(e) {
      return doc.createElement(e);
    },
    elementSelect: function(e) {
      return doc.querySelector(e);
      // return doc.body.querySelector(e);
    },
    elementId: function(e) {
      return doc.getElementById(e);
    },
    elementAll: function(e) {
      return doc.querySelectorAll(e);
    },
    elementClassname: function(e) {
      return doc.getElementsByClassName(e);
    },
    elementTagname: function(e) {
      return doc.getElementsByTagName(e);
    },
    // toggleMenu, toggleDialog, toggleNav, toggleHeader
    // switchMenu, openMenu, openDialog, openNav, openHeader
    // changeMenu, eMenu, eDialog, eventMenu, eventDialog, eventNav, eventHeader, eventMain, eventFooter, eventHandler
    // styleMenu, elementMenu, elementDialog
    Toggle:{
      // NOTE: hO
      menu: function(e, resolve, reject) {
        // =require app.Toggle.menu.js
      },
      dialog: function(resolve, reject) {
        // =require app.Toggle.dialog.js
      },
      nav: function(e, resolve, reject) {
        // =require app.Toggle.nav.js
      },
      header: function(e, resolve, reject) {
        // =require app.Toggle.header.js
      },
      main: function(s) {
        // =require app.Toggle.main.js
      },
      footer: function(e, resolve, reject) {
        // require app.Toggle.footer.js
      }
    }
  };
  win[a0] = function(a){
    return new core.i0(a);
  }
}("scriptive",window,document));