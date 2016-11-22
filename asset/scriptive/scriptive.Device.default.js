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
orientate:function(evt){
  if (win.addEventListener) {
    win.addEventListener(evt, this.setAttribute, false);
  } else if (win.attachEvent) {
    win.attachEvent(evt, this.setAttribute);
  } else {
    win[evt] = this.setAttribute;
  }
  this.setAttribute();
},
setAttribute:function(){
  doc.querySelector(Config.Orientation.html).setAttribute('class',(win.innerHeight < win.innerWidth?Config.Orientation.landscape:Config.Orientation.portrait));
}