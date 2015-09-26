var menus = [];

var App = function(token) {
  this.token = token;
}
App.prototype.run = function() {
  var notification = chrome.notifications.create(
    null,
    {
      type: "basic",
      title: "Hello!",
      message: "this is an example.",
      iconUrl: "icon.png"
    }
  );
};

var reload = function(info, tab) {
  chrome.contextMenus.removeAll(function() {
    menus = [];
    menus.push(chrome.contextMenus.create({
      "title": "reload",
      "contexts": ["browser_action"],
      "onclick" : reload
    }));
    var tokens = (localStorage['tokens'] || '').split(' ');
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      menus.push(chrome.contextMenus.create({
        "title": token,
        "contexts": ["browser_action"],
        "onclick": function() {
          var app = new App(token);
          app.run();
        }
      }));
    }
  });
};
reload();
