// e.eventClick(function(event){
//   if (nav.style.display != 'none'){
//     dataContentClose();
//   } else {
//     nav.style.display = 'block';
//     dataContentOpen();
//     if (!document.body.classList.contains('nav'))document.body.addEventListener(core.config.Handler,dataContentTarget, false);
//   }
//   // event.preventdefault();
//   event.stopPropagation();
// },false);

// core.Toggle.nav(e,function(){
//   document.body.classList.add('nav');
// },function(){
//   document.body.classList.remove('nav');
// });

// core.Toggle.nav(e).style.display = 'none';
if (app.hasOwnProperty('nav')){
  if (app.nav.hasOwnProperty('container')){
    var currentPage = app.localStorage.name.query.page, nav = app.nav.container(), dl=nav.firstElementChild, dt=dl.firstElementChild, dd=dt.nextElementSibling;
    var dataContentOpen = function() {
      var ul = dd.firstElementChild;
      if (ul){
        var active = ul.querySelector('li.active');
        if (active){
          if (active.getAttribute('id') != currentPage) {
            active.classList.remove('active');
            ul.querySelector('#'+currentPage).classList.add('active');
          }
        }
      } else {
        // ul = document.createElement('ul'), dd.appendChild(ul);
        ul = dd.appendChild(document.createElement('ul'));
        // core.nav.data(ul);
        app.config.page.each(function(page,attr){
          var li = document.createElement('li'), p = document.createElement('p'), a = document.createElement('a');
          a.setAttribute('href','#page?'.replace(/page/,page));
          var pageName = app.nav.hasOwnProperty('pageName')?app.nav.pageName(page):page;
          a.classList.add(attr.class);
          a.setAttribute('data-title',pageName);
          li.setAttribute('id',page);
          li.setAttribute('title',pageName);
          if (app.localStorage.name.query.page == page)li.classList.add("active");
          p.appendChild(a); li.appendChild(p); ul.appendChild(li);
        });
      }
      if (typeof resolve === 'function')resolve(nav);
    };
    var dataContentTarget = function(event) {
      if (!dl.contains(event.target) && event.target != e)dataContentClose();
      event.stopPropagation();
    };
    var dataContentClose = function() {
      dl.setAttribute('class','slide-out');
      dd.emptyElement();
      if (typeof reject === 'function')reject(nav);
      if (!document.body.classList.contains('nav'))document.body.removeClick(dataContentTarget);
      nav.styleDisplay('none');
    };
    if (nav.styleDisplay())dataContentOpen();
    e.eventClick(function(event){
      nav.toggleDisplay(function(){
        dl.setAttribute('class','slide-in');
        dataContentOpen();
        if (!document.body.classList.contains('nav'))document.body.eventClick(dataContentTarget);
      },function(){
        dataContentClose();
      })
      // event.preventdefault();
      event.stopPropagation();
    },false);
    return nav;
  }
}