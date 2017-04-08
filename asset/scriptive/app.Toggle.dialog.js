/*
core.Toggle.dialog(function(container){
  // NOTE: Open
  container.appendChild(?);
},function(container){
  // NOTE: Confirm
  return new Promise(function(resolve, reject) {});
});
*/
if (app.hasOwnProperty('dialog')){
  if (app.dialog.hasOwnProperty('container')){
    var dialog = app.dialog.container(), container = dialog.firstElementChild;
    var dataContentOpen = function() {
      var messageContainer = container.firstElementChild.emptyElement();
      if (typeof resolve === 'function')resolve(messageContainer);
    };
    var dataContentClose = function() {
      dialog.styleDisplay('none').removeClick(dataContentTarget);
    };
    var dataContentConfirm = function() {
      if (typeof reject === 'function')reject(dialog).then(dataContentClose);
    };
    var dataContentTarget = function(event) {
      var e = event.target;
      if (container.contains(e)){
        if (e.classList.contains('okey')){
          dataContentConfirm();
        } else if (e.classList.contains('cancel')){
          dataContentClose();
        }
      } else {
        // TODO: Blink??
      }
    };
    dataContentOpen();
    dialog.styleDisplay('block').eventClick(dataContentTarget);
  }
}