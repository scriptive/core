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
    Meta:{script:['data bible','data config']},
    E:[{'metalink':['api']},'load','watch'],
    Platform:'web',
    Handler:'click',On:'fO'
  },
  ready:function(){
    this.config.msg.info = document.querySelector("#msg");
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
Script & Style `screen.platform.device`, Template `device.platform.screen`

## Todo

 - local storage
 - Options (enable/disable) detect device
 