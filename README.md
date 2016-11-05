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
* Gulp (sass, js)
  - `gulp`
* Build for production
  - `npm run build -- --os=<chrome>`
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
  * ~~`npm run build`~~
  * ~~`npm run developer`~~
  * ~~`npm run download`~~
