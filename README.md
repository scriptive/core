# Scriptive - core
Javascript Application Service

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
  - `npm run build -- --os=<ios|android|web|electron|chrome> --pro=<?>  --dir=<?>`
    - `npm run ios`
    - `npm run android`
    - `npm run web`
    - `npm run electron`
    - `npm run chrome`
    - `npm run docs`
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
* `npm run web -- --pro=firebase --dir=../scriptive.firebase/firebase`
* `npm run build -- --dir=<directory>`
* `npm run build -- --os=web --dir=docs`

`npm run docs` and `npm run web` are basically the same output, but `npm run docs` has different target `docs` which is for github.

## Todo
  * `gulp` :seedling:
  * `gulp` Option :seedling:
  * `npm run download` :seedling:
  * `npm run build` :seedling:
  * `npm run developer` :seedling:
  * `npm run create` :seedling:
  * `npm run connect` :seedling:
  * `npm run disconnect` :seedling:
  
```javascript
// npm run create -- --id=<?> --dir=<?>
// npm run connect -- --id=<?> --dir=<?>
// npm run disconnect -- --id=<?>

"package": {
  "project":{
    "id":{
      "root":"rootPath"
    }
  }
}
```

```javascript
// new Promise
var thePromise = getPromises();
thePromise.then(function(e){
    // NOTE: when done
});
function getPromises(){
  return new Promise(function(resolve, reject) {
    // resolve('Ok');
    reject('Error');
  }).then(function(e) {
      // NOTE: if success
      // console.log(e);
      return e;
  }, function(e) {
      // NOTE: if fail
      // console.log(e);
      return e;
  }).then(function(e){
      // NOTE: when done
      // console.log(e);
      return e;
  });
}
```