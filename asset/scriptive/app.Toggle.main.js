if (app.hasOwnProperty('main')){
  if (app.main.hasOwnProperty('container')){
    var main = app.main.container();
    var activeClass = 'div.active';
    var active = main.querySelector(activeClass);
    var container = main.querySelector(activeClass.replace('active',app.localStorage.name.query.page));
    if (container) {
      if (!container.classList.contains('active'))container.classList.add('active');
    } else {
      container = main.firstElementChild;
      if (!container.classList.contains('active'))container.classList.add('active');
    }
    if (active && container != active)active.classList.remove('active');
    if (s)container.emptyElement();
    return container;
  }
}