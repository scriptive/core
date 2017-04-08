name: '{application.name}',
description:'{application.description}',
developer: '{application.developer}',
version: '{application.version}',
build: '{application.build}',
id: 'scriptive',
idUnique: 'core:unique',
file: {
  template: 'z.html'
},
fileStorage:{
  RequestQuota: 1073741824,
  Permission: 1,
  objectStore:{
   name:'core',
   version:1
  }
},
todo: {
},
// NOTE: page
page:{
  home:{
    class:'icon-language'
  },
  lookup:{
    class:'icon-search'
  },
  setting:{
    class:'icon-setting'
  },
  about:{
    class:'icon-info'
  }
}