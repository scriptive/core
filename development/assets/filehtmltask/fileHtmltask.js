/*!
    fileHtmltask -- html Template task
    Version 1.0.1
    https://khensolomon.github.io/let/filehtmltask
    (c) 2016
*/
(function(o) {
  'use strict';
  window[o] = function(io) {
    var os =(io?io:o), json={}, panelID = 'l1121', textareaID = 'l1122';
    window[os] = this;
    var visualTask={
      style:function(){
        var scriptObj = 'script[id=o]'.replace('o',o).byAttrName();
        if (scriptObj) {
          var scriptPath = scriptObj.src, scriptUrl = scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 );
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'linkstyle.css'.replace(/link/,scriptUrl).replace(/style/,o);
          document.head.appendChild(link);
        }
      },
      bar:function(){
        var div=panelID.byID();
        if(!div){
          this.style();
          div = document.createElement('div');
          div.id = panelID;
          var ul = document.createElement('ul');
          // ul.appendChild(this.clean());
          this.clean(ul);
          this.action(ul);
          this.result(ul);
          // ul.appendChild(this.result());
          div.appendChild(ul);
          document.body.appendChild(div);
        }
      },
      clean:function(container){
        var li = document.createElement('li');
        li.addEventListener("click", function(e) {
          window[os].clean();
          li.classList.toggle("active");
          // document.getElementById("myDropdown").classList.toggle("show");
        }, false);
        li.innerHTML = "Clean";
        li.setAttribute('class','clean');
        container.appendChild(li);
      },
      result:function(container){
        var li = document.createElement('li');
        li.addEventListener("click", function(e) {
          window[os].result();
        }, false);
        li.innerHTML = "Result";
        li.setAttribute('class','result');
        container.appendChild(li);
      },
      action:function(container){
        document.body.children.each(function(i,node){
          var nodeName = node.nodeName;
          if (nodeName && !node.hasAttribute('remove')) {
            var li = document.createElement('li');
            var strong = document.createElement('strong');
            strong.innerHTML = nodeName;
            li.appendChild(strong);
            ({'get':'get'}).each(function(x,y){
              var span = document.createElement('span');
              span.addEventListener("click", function(e) {
                window[os][x](node);
              }, false);
              span.innerHTML = y;
              span.title = y;
              li.appendChild(span);
            });
            container.appendChild(li);
          }
        });
      }
    };
    visualTask.bar();
    this.help = function(){
      var h={
          "help":'',
          "clean() remove all uncessary data [remove,empty,iframe,input_stat] get() then result()":"",
          "Clean":"os.clean();",
          "Get":"os.get();",
          "TagName[header,main,footer,div]":"os.get('header');",
          "Result":'os.result();',
      };
      window.help=Object.keys(h).join('; ').replace(/os/g,os);
      h.each(function(i,v){
        if (v){
          console.log(i.replace(/os/g,os),':',v.replace(/os/g,os));
        } else {
          console.log(i.replace(/os/g,os),'...');
        }
      });
      /*
      help.forEach(function(i){
          console.log(i);
      });
      */
      return help;
    };
    this.result=function(){
      var textarea=textareaID.byID();
      if(!textarea){
        textarea = document.createElement('textarea');
        textarea.id = textareaID;
        // textarea.style = "width:100%;";
        document.body.appendChild(textarea);
      }
      textarea.value=JSON.stringify(json);
      if (json.length > 0) {
        // textarea.value=JSON.stringify(json);
      } else {
        return 'need help?';
      }
      return 'data in Textarea';
    };
    this.clean=function(){
      var rm = '[remove],[input_stat]'.byAttrNameAll();
      for (var i=rm.length-1; i>=0;i-=1){
        if (rm[i]) rm[i].parentNode.removeChild(rm[i]);
        //if (rm[i]) ety[i].remove();
      }
      var ety = '[empty]'.byAttrNameAll();
      for (var i=ety.length-1; i>=0;i-=1){
        if (ety[i]){
          while(ety[i].hasChildNodes()) {
            ety[i].removeChild(ety[i].firstChild);
          }
          ety[i].removeAttribute("empty");
        }
      }
      var ifr ='iframe'.byTagName();
      for (var i=ifr.length-1; i>=0;i-=1){
        if (ifr[i]) ifr[i].remove();
      }
      return 'done';
      /*
      .removeAttribute("category");
      .removeAttributeNode(attnode);
      */
    };
    this.get=function(tag){
      if (tag){
        var element=(typeof tag === 'object')?tag:tag.byTagName()[0];
        // if (typeof yourVariable === 'object'){
        //   var element=tag;
        // } else {
        //   var element=tag.byTagName()[0];
        // }
        if(element){
          return json=this.dom(element);
        }
        return 'Element not exists!'.replace('Element',tag);
      } else {
        return 'Element not specified!';
      }
    };
    this.dom=function(element){
      var obj={}, parser, docNode;
      if (typeof element === "string") {
        if (window.DOMParser){
          parser=new DOMParser(); docNode=parser.parseFromString(element,"text/html");
        }else{
          docNode=new ActiveXObject("Microsoft.XMLDOM"); docNode.async=false; docNode.loadXML(element);
        }
        element=docNode.firstChild;
        //element=docNode.lastChild;
      }
      this.objTree(element, obj);
      return obj;
    };
    this.objTree=function(el, o){
      var tag=el.nodeName.toLowerCase();
      o[tag]={};
      var nodeList =el.childNodes;
      if (nodeList != null) {
        if (nodeList.length) {
          o[tag]["text"] = [];
          for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeType == 3) {
              if(nodeList[i].nodeValue.replace(/^\s+|\s+$/g, '').trim()){
                o[tag]["text"].push(nodeList[i].nodeValue);
              }
            } else {
              o[tag]["text"].push({});
              this.objTree(nodeList[i], o[tag]["text"][o[tag]["text"].length -1]);
            }
          }
        }
      }
      if (el.attributes != null) {
        if (el.attributes.length) {
          o[tag]["attr"] = {};
          for (var i = 0; i < el.attributes.length; i++) {
            o[tag]["attr"][el.attributes[i].nodeName] = el.attributes[i].nodeValue;
          }
        }
      }
    };
    return this;
  };
}('fileHtmltask'));
Object.defineProperties(Object.prototype,{
  each:{
    value:function(callback){
      for(var i in this) {
        callback(i, this[i]);
        /*
       if (object.hasOwnProperty(i)) {
         callback(i, this[i]);
       }*/
      }
    }
  },
  byID:{
    value:function(){
      return document.getElementById(this);
    }
  },
  byClass:{
    value:function(){
      return document.getElementsByClassName(this);
    }
  },
  byTagName:{
    value:function(){
      return document.getElementsByTagName(this);
    }
  },
  byAttrNameAll:{
    value:function(){
      return document.querySelectorAll(this);
      //document.querySelectorAll('[someAttr]')
      //document.querySelector('[someAttr]')
    }
  },
  byAttrName:{
    value:function(){
      return document.querySelector(this);
    }
  }
});
document.addEventListener('DOMContentLoaded', function () {
  new fileHtmltask('task');
  task.help();
  // textarea = document.createElement('textarea');
  // textarea.id = "t100";
  // // textarea.style = "width:100%;";
  // document.body.appendChild(textarea);
});
// htmlTemplatetask fileTagtask fileHtmltask