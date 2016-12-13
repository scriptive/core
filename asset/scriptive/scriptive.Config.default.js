Meta:{
  // script:['data setting','data config'],
  agent:{script:[0,1,2],link:[0,1,2]}
},
Execute:['Action'],T:[],
// load, event, task
Handler: ('ontouchstart' in document.documentElement ? "touchstart" : "click"),
On: 'fO', Screen: 'desktop', Platform: 'web', Layout: null, Browser: 'chrome',
fileSystask:'Chrome', //temporary
Orientation: {
  change: 'D1699',landscape: 'landscape',portrait: 'portrait',html:'html'
},
note: {}, lang: {}, query: {}, hash:{},
lookup: {
    setting: {},book: {}
},
previous: {},
todo: {
    Orientation: true,
    // NOTE: if Template=true will be loaded Template!
    // Template:'z.html body'
},
container: {},
msg: {
    info: '#msg'
},
name:'app',
version:'1.0',
build:'1',
// id: 'app'