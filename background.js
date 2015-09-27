var menus = [];

var App = function(name, token) {
  this.name = name;
  this.token = token;
}
App.prototype.postNotification = function(message, url) {
  return chrome.notifications.create(
    null,
    {
      type: "basic",
      title: this.name,
      message: message,
      iconUrl: "icon.png"
    },
    function(createdId) {
      chrome.notifications.onClicked.addListener(function(clickedId) {
        if (createdId === clickedId) {
          window.open(url);
        }
      });
    }.bind(this)
  );
};
App.prototype.createRealtime = function(callback) {
  var xhr = new XMLHttpRequest();
  var url = "https://slack.com/api/rtm.start?token=" + this.token;
  xhr.open("GET", url, true);
  xhr.onload = function(e) {
    if (xhr.readyState == 4) {
      if (xhr.status === 200) {
        var res = xhr.responseText;
        var json = JSON.parse(res);
        var ws = new WebSocket(json.url);
        if (callback) {
          callback(ws);
        }
      } else {
      }
    }
  }.bind(this);
  xhr.send();
};
App.prototype.run = function() {
  this.createRealtime(function(ws) {
    this.postNotification(
        "WebSocket URL is: " + ws.url,
        "http://www.google.com"
    );
  }.bind(this));
};

var reload = function(info, tab) {
  chrome.contextMenus.removeAll(function() {
    menus = [];
    menus.push(chrome.contextMenus.create({
      "title": "reload",
      "contexts": ["browser_action"],
      "onclick" : reload
    }));
    var accounts = JSON.parse(localStorage['accounts'] || '[]');
    for (var i = 0; i < accounts.length; i++) {
      var account = accounts[i];
      menus.push(chrome.contextMenus.create({
        "title": account.name,
        "contexts": ["browser_action"],
        "onclick": function() {
          var app = new App(account.name, account.token);
          app.run();
        }
      }));
    }
  });
};
reload();
