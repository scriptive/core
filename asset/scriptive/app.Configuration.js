Meta: {
    // script:['data setting','data config'],
    agent: {
      script: [0, 1, 2], link: [0, 1, 2]
    }
},
Execute: ['initiate'],
Handler: click,
dataLink: 'data-link',
dataContent: 'data-content',
Platform: 'web',
Screen: 'desktop',
// Browser: 'chrome',
DeviceName:{
  desktop:'desktop', tablet:'tablet', mobile:'mobile', 
  ios:'ios', android:'android', defaults:'default',
  web:'web', app:'app'
},
// DeviceTemplate:['Device','Platform','Screen','Other'],
// DeviceAgent:['Device','Platform','Screen','Other'],
Orientation: {
  landscape: 'landscape',
  portrait: 'portrait',
  element: 'html'
},
hash: {},
todo: {
  // Orientation: true, Template:true
},
msg: {
  info: '#msg'
},
name: 'app',
version: '{package.version}',
build: '{package.build}'
// id: 'app'