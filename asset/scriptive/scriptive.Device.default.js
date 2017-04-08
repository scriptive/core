platform:{
  is:function(needle){return navigator.userAgent.toLowerCase().indexOf(needle) !== -1;},
  ios:function(){return this.iphone() || this.ipod() || this.ipad();},
  iphone:function(){return !this.windows() && this.is('iphone');},
  ipod:function(){return this.is('ipod');},
  ipad:function(){return this.is('ipad');},
  android:function(){return !this.windows() && this.is('android');},
  apd:function(){return this.android() && this.is('mobile');},
  adt:function(){return this.android() && !this.is('mobile');},
  blackberry:function(){return this.is('blackberry') || this.is('bb10') || this.is('rim');},
  bbp:function(){return this.blackberry() && !this.is('tablet');},
  bbt:function(){return this.blackberry() && this.is('tablet');},
  windows:function(){return this.is('windows');},
  wdp:function(){return this.windows() && this.is('phone');},
  wdt:function(){return this.windows() && (this.is('touch') && !this.wdp());},
  fxos:function(){return (this.is('(mobile;') || this.is('(tablet;')) && this.is('; rv:');},
  ffp:function(){return this.fxos() && this.is('mobile');},
  fft:function(){return this.fxos() && this.is('tablet');},
  meego:function(){return this.is('meego');},
  cordova:function(){return win.cordova && location.protocol == 'file:';},
  chrome:function(){return app.config.Browser == app.config.Platform || app.config.Browser == 'chrome';},
  // chrome:function(){return app.config.Platform === 'chrome';},
  nodeWebkit:function(){return typeof window.process === 'object';},
  mobile:function(){return this.apd() || this.iphone() || this.ipod() || this.wdp() || this.bbp() || this.ffp() || this.meego();},
  tablet:function(){return this.ipad() || this.adt() || this.bbt() || this.wdt() || this.fft();}
  // desktop:function(){return !this.tablet() && !this.mobile();}
},
browser:function(){
  if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
    return 'opera';
  } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
    return 'chrome';
  } else if(navigator.userAgent.indexOf("Safari") != -1) {
    return 'safari';
  } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
    return 'firefox';
  } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!doc.documentMode == true )) {
    //IF IE > 10
    return 'ie';
  } else {
    return 'unknown';
  }
},
agent:function(fileMeta){
  var fileAgent=[],fileTemplate=[];
  app.config.Browser = this.browser();
  app.config.isCordova = this.platform.cordova();
  app.config.isChrome = this.platform.chrome();
  if (!app.config.Platform) app.config.Platform = app.config.DeviceName.web;
  if (!app.config.Screen) app.config.Screen = app.config.DeviceName.desktop;
  if (this.platform.mobile()) {
    app.config.Screen = app.config.DeviceName.mobile;
  } else if (this.platform.tablet()) {
    app.config.Screen = app.config.DeviceName.tablet;
  } 
  if (this.platform.ios()) {
    app.config.Device = app.config.DeviceName.ios;
  } else if (this.platform.android()) {
    app.config.Device = app.config.DeviceName.android;
  } else if (this.platform.hasMethodProperty(app.config.Device)) {
    // NOTE: only deploying
  } else {
    // NOTE: if app.config.Screen is not equal to desktop, {default.web.mobile} to avoid error, but need to update later
    app.config.Device = app.config.DeviceName.defaults;
  }
  // NOTE: for html
  if (app.config.hasOwnProperty('DeviceTemplate') && app.config.DeviceTemplate.constructor === Array){
    // NOTE: DeviceTemplate format has given
    app.config.DeviceTemplate.forEach(function(i){
      if (app.config.hasOwnProperty(i) && Config[i].constructor === String){
        fileTemplate.push(Config[i]);
      } else if (typeof i === 'string') {
        fileTemplate.push(i);
      }
    });
  } else if (app.config.Platform == app.config.DeviceName.web) {
    // NOTE: Web
    fileTemplate.push(app.config.DeviceName.defaults, app.config.Screen);
  } else {
    // NOTE: Other
    fileTemplate.push(app.config.Device, app.config.Screen);
  }
  app.config.DeviceTemplate = fileTemplate;
  // NOTE: for js, css
  if (typeof(fileMeta) == "object") {
    // NOTE: app.config.Meta.agent has given
    if (app.config.hasOwnProperty('DeviceAgent') && app.config.DeviceAgent.constructor === Array){
      // NOTE: DeviceAgent format given
      app.config.DeviceAgent.forEach(function(i){
        if (app.config.hasOwnProperty(i) && Config[i].constructor === String){
          fileAgent.push(Config[i]);
        } else if (typeof i === 'string') {
          fileAgent.push(i);
        }
      });
    } else {
      // NOTE: DeviceAgent format has not given, so use [core.mobile.ios] [core.mobile.android]
      fileAgent.push(app.config.Platform,app.config.Screen,app.config.Device);
    }
  }
  var file = [], fileName = [];
  if (fileAgent.length) {
    // NOTE: app.config.Meta.agent has given
    for (var id in fileAgent) {
      fileName.push(fileAgent[id]);
      for (var fileType in fileMeta) {
        if (fileMeta.hasOwnProperty(fileType) && fileMeta[fileType].constructor === Array) {
          if (fileMeta[fileType].filter(function(i) {return i == id}).length) {
            file.push({type: fileType, name: fileName.join('.')});
          }
        }
      }
    }
  }
  return file;
},
orientate:function(evt){
  if (doc.querySelector(app.config.Orientation.element)) {
    if (win.addEventListener) {
      win.addEventListener(evt, this.orientateClass, false);
    } else if (win.attachEvent) {
      win.attachEvent(evt, this.orientateClass);
    } else {
      win[evt] = this.orientateClass;
    }
    this.orientateClass();
  }
},
orientateClass:function(){
  doc.querySelector(app.config.Orientation.element).setAttribute('class',(win.innerHeight < win.innerWidth?app.config.Orientation.landscape:app.config.Orientation.portrait));
}