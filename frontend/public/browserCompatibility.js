function addLoadEvent(func) {
  const oldonload = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = func;
  } else {
    window.onload = function newOnload() {
      if (oldonload) {
        oldonload();
      }
      func();
    };
  }
}

addLoadEvent(function handleOutdatedBrowsers() {
  if (typeof window.outdatedBrowser !== 'function') {
    return;
  }
  window.outdatedBrowser({
    bgColor: '#f25648',
    color: '#ffffff',
    lowerThan: 'object-fit',
    languagePath: '',
  });
});
