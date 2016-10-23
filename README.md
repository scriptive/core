# Scriptive - script
Javascript Application Service

## Task
* Install devDependencies
  - `npm install --save-dev`
  - `npm install --production --save-dev`
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
  
  ## Directories
  Directories configuration is defined in `config/build.json`
  
  ## `npm run build -- --os=<device>`
  Everything in `build.config.root{device}` directory will copy to `build.dist.root` or  `--dir=?` and `build.image.root{device}` will also copy to `build.dist.root/img/`
  
  `npm run build-demo` and `npm run build-default` are basically the same output, but `npm run build-demo` has different target `docs` which is for github.