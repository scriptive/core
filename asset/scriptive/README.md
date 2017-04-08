# scriptive
  
## Require

```javascript
scripting('app');
```
## Create

```javascript
(function (app) {
  ...
}(app));
```

## Require and Create

```javascript
// Save as above but merge
(function (app) {
  ...
}(scripting('app')));

```

## Calls

```javascript
app.document({
  config:{
    // configurations
  },
  ready:function(){
    this.config.msg.info = document.querySelector("#msg");
  }
});
```
## Require and Create then Call

```javascript
scriptive({
  initiate:function(){
    console.log('initiate');
  }
}).document({
  config:{
    Execute:['initiate']
  },
  ready:function(){
    console.log('ready');
  }
});
```

## Template structure

```javascript
{  
  Screen: [desktop, tablet, mobile],
  // default Screen is "desktop"
  Platform: [web, app],
  // default Platform is "web"
  Device: [chrome, ios, android]
  // default Device is "default"
}
```
## Device, Platform and Screen configuration

```javascript
// Web
config:{
  Platform:'web',
  Handler:'click'
}
// Chrome
config:{
  Device:'chrome', Platform:'app', Screen:'desktop',
  Handler:'click'
}
// iOS
config:{
  Device:'ios', Platform:'app', Screen:'mobile'
}
// Android
config:{
  Device:'android', Platform:'app', Screen:'mobile'
}
```
```javascript
default:{
  Device:'desktop',Platform:'web'
}
ios:{
  Device:'ios',Platform:'app',Screen:'mobile'
}
android:{
  Device:'android',Platform:'app',Screen:'mobile'
}
chrome:{
  Device:'chrome',Platform:'app'
}
```

## Custom structure for Template and Script/Style
Script & Style `platform.screen.device`, Template `device.screen`

Default DeviceTemplate is `['Device','Screen']` and if `Platform` is not given in main configuration or we equal to 'web' the `Device` use default Platform value. which is 'default'

```javascript
config:{
  DeviceAgent:['Platform','Screen','Device'],
  DeviceTemplate:['Device','Platform','Screen']
}
```
## Meta configuration

```javascript
// if not object, disabled
config:{
  Meta:false
}
// loading custom script
config:{
  Meta:{
    script:['data bible','data config']
  }
}
// loading custom style
config:{
  Meta:{
    link:['data bible','data config']
  }
}
// filter
config:{
  Meta:{
    agent:{script:[0,1,2],link:[0,1,2]}
  }
}
config:{
  Meta:{
    script:['data bible','data config'],
    agent:false
  }
}
```

## Orientation configuration

```javascript
// if not object, disabled
config:{
  Orientation:false
}
// Enabled
config:{
  Orientation: {
    // change: 'D1699',
    landscape: 'landscape',
    portrait: 'portrait',
    html:'html'
  }
}
```

## Todo
* [x] `scriptive({}).document({})`;
* [x] `notification()`;
* [ ] `handlerEventExecutor()`;
* [x] `handlerEventListener()`;
* [x] `dataMethodListener()`;
* [x] `metaLink()`;
* [x] `metaContent()`;
* [x] `hashChange()`;
* [x] `localStorage`;
* [x] `load({})`;

* Storage
  - [x] localStorage
* Options
  - [x] Enable/Disable device meta
  - [x] Enable/Disable orientation change
  - [x] dataMethodListener
  - [x] dataDisplay
  - [ ] hashChange
 