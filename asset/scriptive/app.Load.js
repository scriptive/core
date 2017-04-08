file.merge(true, core.callback);
return new Promise(function(resolve, reject) {
  var xmlHttp = (win.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var Percentage = 0;
  xmlHttp.addEventListener("progress", function(e) {
    Percentage++;
    if (e.lengthComputable) {
      Percentage = Math.floor(e.loaded / e.total * 100);
      file.progress(Percentage);
    } else if (xmlHttp.readyState == XMLHttpRequest.DONE) {
      file.progress(100);
    } else if (xmlHttp.status != 200) {
      file.progress(Math.floor(Percentage / 7 * 100));
      Percentage++;
    }
  }, false);
  xmlHttp.addEventListener("load", function(e) {
    if (xmlHttp.status == 200) {
      // var parser = new DOMParser(), template = parser.parseFromString(xhr.response, "text/html");
      resolve(xmlHttp);
    } else if (xmlHttp.statusText) {
      if (file.fileUrl){
        reject({message:xmlHttp.statusText+' : '+ file.fileUrl,code:xmlHttp.status});
      } else {
        reject({message:xmlHttp.statusText,code:xmlHttp.status});
      }
    } else if(xmlHttp.status) {
      reject({message:'Error',code:xmlHttp.status});
    }else{
      reject({message:'Unknown Error',code:0});
    }
  }, false);
  xmlHttp.addEventListener("error", reject, false);
  xmlHttp.addEventListener("abort", reject, false);
  try {
    xmlHttp.open(file.requestMethod ? file.requestMethod : 'GET', file.fileUrl, true);
    file.before(xmlHttp);
    // NOTE: how 'before' function should do!
    // xmlHttp.responseType = file.fileType;
    // xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    // xmlHttp.withCredentials = true;
    xmlHttp.send();
  } catch (e) {
    reject({message:e.name,code:1});
  } finally {
  }
}).then(function(e) {
    // NOTE: if success
    return file.success(e);
}, function(e) {
    // NOTE: if fail
    return file.fail(e);
}).then(function(e){
    // NOTE: when done
    return file.done(e);
});
