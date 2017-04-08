/*
core.Toggle.menu(e,function(container){
  // NOTE: onOpen
  var ol = document.createElement('ol');
  container.appendChild(ol);
},function(){
  // NOTE: onClose
});

document.body.addEventListener(app.config.Handler,dataContentTarget);
document.body.eventHandler(core.config.Handler,dataContentTarget);
document.body.eventClick(dataContentTarget);

document.body.removeEventListener(app.config.Handler,dataContentTarget);
document.body.removeHandler(core.config.Handler,dataContentTarget);
document.body.removeClick(dataContentTarget);
*/
var container = e.parentNode;
var dataContentOpen = function() {
  var scrollbar = e.nextElementSibling.firstElementChild;
  while(scrollbar.firstChild)scrollbar.removeChild(scrollbar.firstChild);
  if (typeof resolve === 'function')resolve(scrollbar);
};
var dataContentTarget = function(event) {
  if (!container.contains(event.target))dataContentClose();
};
var dataContentClose = function() {
  container.classList.remove('active');
  document.body.removeEventListener(app.config.Handler,dataContentTarget);
  if (typeof reject === 'function')reject();
};
if (container.classList.contains('active'))dataContentOpen();
e.eventClick(function(event){
  container.toggleClass('active',function(){
    document.body.addEventListener(app.config.Handler,dataContentTarget);dataContentOpen();
  },function(){
    dataContentClose();
  });
});