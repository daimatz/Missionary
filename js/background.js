var menus = [];

var App = function(account) {
  this.account = account;
}
App.prototype.postNotification = function(message, url) {
  return chrome.notifications.create(
    null,
    {
      type: "basic",
      title: this.account.name,
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
App.prototype.createRealTimeSession = function(onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  var url = "https://slack.com/api/rtm.start?token=" + this.account.token;
  xhr.open("GET", url, true);
  xhr.onload = function(e) {
    if (xhr.readyState == 4) {
      if (xhr.status === 200) {
        var res = xhr.responseText;
        var json = JSON.parse(res);
        var ws = new WebSocket(json.url);
        if (onSuccess) { onSuccess(ws); }
      } else {
      }
    }
  }.bind(this);
  xhr.send();
};
App.prototype.setWsHandlers = function(ws) {
  ws.onmessage = function(e) {
    var json = JSON.parse(e.data);
    if (!json.hidden) {
      this.postNotification(
        json.text,
        'https://' + this.account.name + '.slack.com'
      );
    }
  }.bind(this);
};
App.prototype.run = function() {
  this.createRealtimeSession(this.setWsHandlers.bind(this));
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
          var app = new App(account);
          app.run();
        }
      }));
    }
  });
};
reload();
