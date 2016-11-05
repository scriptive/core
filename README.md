# Scriptive - core
Javascript Application Service

## Using
```javascript
// require scriptive
(function(o) {
  o.load = function(o) {
    console.log("loaded");
  };
}(scriptive("app")));

// Web
app.document({
  config:{
    Execute:['load','handler'],
    Device:'desktop',Platform:'web'
  },
  ready:function(){
    this.config.msg.info = document.querySelector("p#msg");
  }
});
// Chrome
config:{
  Device:'desktop',Platform:'app',Deploy:'chrome',
  Handler:'click'
}
// iOS
config:{
  Device:'ios',Platform:'app',Deploy:'mobile',
  Handler:'vclick'
}
// Android
config:{
  Device:'android',Platform:'app',Deploy:'mobile',
  Handler:'vclick'
}
```

## Task
* Install devDependencies
  - `npm install --save-dev`
  - `npm install --production --save-dev`
  - `npm update --production --save-dev`
* Uninstall devDependencies
  - `npm uninstall <?> --save-dev`
  - `npm uninstall download --save-dev`
* Check for outdated
  - `npm outdated`
  - `npm update --save-dev`
* Download development library
  - `npm run download`
  - `npm run download -- --pro=<?>`
* Gulp (sass, js)
  - `gulp`
  - `gulp --pro=<?>`
* Build for production
  - `npm run build -- --os=<chrome> --pro=<?>  --dir=<?>`
  - `npm run build-chrome`
  - `npm run build-ios`
  - `npm run build-android`
  - `npm run build-default`
  - `npm run build-electron`
  - `npm run build-demo`
  - `npm run developer`
  
## Directories
  Directories configuration is defined in `scriptive.json`
  
## Developer
  Creating core for developer `npm run developer`. 
  - if `npm run developer -- --dir=<dir>` dir is not given, then `public`.
  - if `npm run developer -- --pro=<dir>` will looks for `scriptive.json->project->{dir}`.
  
## `npm run build -- --os=<device>`

Everything in `scriptive.config.root{device}` directory will copy to `scriptive.dist.root` or  `--dir=?` and `scriptive.image.root{device}` will also copy to `scriptive.dist.root/img/`

* `npm run build -- --os=<device> --pro=<project>`
* `npm run build -- --os=<device> --pro=<project>`
* `npm run build -- --dir=<directory>`
* `npm run build -- --os=web --dir=docs`

`npm run build-demo` and `npm run build-default` are basically the same output, but `npm run build-demo` has different target `docs` which is for github.
  
### Todo
  * ~~`gulp`~~
  * ~~`npm run download`~~
  * ~~`npm run build`~~
  * ~~`npm run developer`~~
