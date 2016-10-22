(function($) {
  var application = 'app',version = '2.1.23.2016.1.5';
  $.fn[application] = function(options) {
      window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      var fO=$.extend({
          L:[],E:['Action'],T:[],
          App: application, Click: 'click', On: null, Hash: 'hashchange', Device: 'desktop', Platform: 'web', Layout: null, Browser: 'chrome',
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
              info: $('li:first-child')
          }
      }, options),
      fileSystem, fn, db={}, application=this;
      function Core() {
        this.arg = arguments;
        return this;
      }
      window[fO.App]=Core;
      function f() {
        this.arg = arguments;
        function self(){
           Core.apply(this, arg);
        }
        self.prototype = Object.create(Core.prototype);
        self.prototype.constructor = Core;
        return new self;
      }
      Core.prototype.watch = function() {
        $(document).on(fO.Click, f(fO.On).is('class').name, function(e) {
          f($(this)).exe(f($(this)).get('class').element);
        });
      };
      Core.prototype.metalink = function() {
        f(this.arg[0]).loop(function(i,v){
          window[v] = f(v).is('link').get('href').name;
        });
      };
      Core.prototype.metacontent = function() {
        f(this.arg[0]).loop(function(i,v){
          window[v] = f(v).is('meta').get('content');
        });
      };
      Core.prototype.loop= function(callback) {
        var tmp={
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
        var tmpIs=typeof this.arg[0];
        return tmp[tmpIs](this.arg[0]);
      };
      Core.prototype.exe = function(x) {
        var o=this.arg[0], y=this[x[0]];
        if (y){
          if ($.isFunction(y)) {
            return f(o)[x[0]](this);
          } else {
            y=y[x[1]];
            if(y){
              if ($.isFunction(y)) {
                return f(o)[x[0]][x[1]](this);
              } else {
                y=y[x[2]];
                if(y){
                  if($.isFunction(y)) {
                    return f(o)[x[0]][x[1]][x[2]](this);
                  }
                }
              }
            }
          }
        }
        return false;
      };
      //=require script.Prototype.is.js
      //=require script.Prototype.get.js
      this.Ready = function(obj) {
        fO.Orientation.evt = (Object.prototype.hasOwnProperty.call(window, "onorientationchange")) ? "orientationchange" : "resize";
        var o = {
          type: {
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
          meta:function(meta){
            var file = [
              // {type: 'script', name: 'localforage.min'},
              // {type: 'script', name: 'data.bible'},
              // {type: 'script', name: 'data.config'}
            ];
            for (var type in meta) {
              for (var src in meta[type]) {
                file.push({type: type, name: meta[type][src].replace(' ','.')});
              }
            }
            return file;
          },
          go: function(q) {
            var x = q.shift(), y = x.type, url = (x.dir || o.type[y].dir) + x.name + o.type[y].extension,
            req = document.createElement(y);
            f(o.type[y].attr).loop(function(i,v){
              req[i] = v || url;
            });
            req.onload = function() {
              fO.msg.info.html(x.name);
              if (q.length) { o.go(q); } else { application.Listen(); }
            };
            document.head.appendChild(req);
            //document.getElementsByTagName('head')[0].appendChild(req);
          }
        };
        o.go($.merge(o.meta(fO.L), this.Device(fO.L)));
        // this.createProperty('Orientation',function(){
        //   $(config.css.content).css({
        //     'top': $(config.css.header).outerHeight(),
        //     'bottom': $(config.css.footer).outerHeight()
        //   });
        // });
      };
      this.Listen = function() {
        if (fO.isCordova) {
          fO.msg.info.html('getting Device ready').attr({
            class: 'icon-database'
          });
          document.addEventListener("deviceready", this.Initiate, false);
        } else {
          fO.msg.info.attr({
            class: 'icon-database'
          });
          this.Initiate();
        }
      };
      this.Initiate = function() {
        f(fO.E).loop(function(i,v){
          i = ($.type(v) === 'object') ? Object.keys(v)[0] : v;
          f(v[i]).exe(i.split(' '));
        });
      };
      this.Device = function() {
        var Platform = {
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
          cordova:function(){return window.cordova && location.protocol === 'file:';},
          chrome:function(){return fO.Platform === 'chrome';},
          nodeWebkit:function(){return typeof window.process === 'object';},
          mobile:function(){return this.ADP() || this.iphone() || this.ipod() || this.WDP() || this.BBP() || this.FFP() || this.meego();},
          tablet:function(){return this.ipad() || this.ADT() || this.BBT() || this.WDT() || this.FFT();}
          // desktop:function(){return !this.tablet() && !this.mobile();}
        };
        var Orientation=function() {
          $(window.document.documentElement).attr({
            class: (window.innerHeight < window.innerWidth) ? fO.Orientation.landscape : fO.Orientation.portrait
          });
          // if (Object.prototype.hasOwnProperty.call(main, "Orientation")) main.Orientation();
        };
        if (window.addEventListener) {
          window.addEventListener(fO.Orientation.evt, Orientation, false);
        } else if (window.attachEvent) {
          window.attachEvent(fO.Orientation.evt, Orientation);
        } else {
          window[fO.Orientation.evt] = Orientation;
        }
        Orientation();
        var d=[], template=[], mobile='mobile', tablet='tablet', ios='ios', android='android';
        fO.isCordova = Platform.cordova();
        fO.isChrome = Platform.chrome();
        if (!fO.Platform) fO.Platform = 'web';
        if (!fO.Deploy) fO.Deploy = 'desktop';
        if (Platform.mobile()) {
          fO.Deploy = 'mobile';
        } else if (Platform.tablet()) {
          fO.Deploy = 'tablet';
        } 
        // NOTE: for js, css
        d.push(fO.Deploy, fO.Platform);
        if (Platform.ios()) {
          fO.Device = 'ios';
        } else if (Platform.android()) {
          fO.Device = 'android';
        } else if ($.isFunction(Platform[fO.Device])) {
          // NOTE: only deploying
        } else {
          // NOTE: if fO.Deploy is not equal to desktop, {default.web.mobile} to avoid error, but need to update later
          if (fO.Deploy != 'desktop') {
            fO.Deploy = 'desktop';
          }
          fO.Device = 'default';
        }
        d.push(fO.Device);
        fO.DeviceTemplate = [fO.Device, fO.Platform, fO.Deploy];
        /*
        chrome: Device:'desktop',Platform:'chrome', -> Device:'chrome',Platform:'app', Deploy:'desktop',
        ios: Device:'ios',Platform:'app',Deploy:'mobile',
        android: Device:'android',Platform:'app',Deploy:'mobile',
        default: Device:'desktop',Platform:'web',
        */
        var file = [], df = [];
        for (var i in d) {
          df.push(d[i]);
          var fl = df.join('.');
          file.push({type: 'link', name: fl}, {type: 'script', name: fl});
        }
        return file;
      };
      return this;
  };
})(jQuery);
//!require script.defineProperties.js
//!require script.Prototype.custom.js
//!require ../filesystask/fileSystask.min.js
