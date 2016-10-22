# scriptive

### Require

```javascript
scripting('app');
```
### Create

```javascript
(function (o) {
}(app));
```
### Save as above but merge
```javascript
(function (o) {
}(scripting('app')));
```

### Call

```javascript
app.document({
  config:{
    Meta:{script:['data bible','data config']},
    E:[{'metalink':['api']},'load','watch'],
    Device:'desktop',Platform:'web',
    Handler:'click',On:'fO'
  },
  ready:function(){
    this.config.msg.info = document.querySelector("li#msg");
    this.initial();
  }
});

default:{
  Meta:{script:['data bible','data config']},
  E:[{'metalink':['api']},'load','watch'],
  Device:'desktop',Platform:'web',
  Handler:'click',On:'fO'
}
ios:{
  Meta:{script:['data bible','data config']},
  E:[{'metalink':['api']},'load','watch'],
  Device:'ios',Platform:'app',Deploy:'mobile',
  Handler:'vclick',On:'fO'
}
android:{
  Meta:{script:['data bible','data config']},
  E:[{'metalink':['api']},'load','watch'],
  Device:'android',Platform:'app',Deploy:'mobile',
  Handler:'vclick',On:'fO'
}
chrome:{
  Meta:{script:['data bible','data config']},
  E:[{'metalink':['api']},'load','watch'],
  Device:'chrome',Platform:'app',
  Handler:'click',On:'fO'
}
```