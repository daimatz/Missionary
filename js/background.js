import Account from './account';

class App {
  constructor(account) {
    this.account = account;
  }
  postNotification(message, url) {
    return chrome.notifications.create(
      null,
      {
        type: "basic",
        title: this.account.name,
        message: message,
        iconUrl: "icon.png"
      },
      (createdId) => {
        chrome.notifications.onClicked.addListener(clickedId => {
          if (createdId === clickedId) {
            window.open(url);
          }
        });
      }.bind(this)
    );
  }
  setWsHandlers(ws) {
    ws.onmessage = (e) => {
      let json = JSON.parse(e.data);
      if (!json.hidden && json.text) {
        this.postNotification(
          json.text,
          'https://' + this.account.name + '.slack.com'
        );
      }
    }.bind(this);
  }
  createRealTimeSession() {
    let url = "https://slack.com/api/rtm.start?token=" + this.account.token;
    return fetch(url)
      .then(res => res.json())
      .then(json => new WebSocket(json.url));
  }
  run() {
    this.createRealTimeSession()
      .then(this.setWsHandlers.bind(this));
  }
}

let menus = [];
let reload = function(info, tab) {
  chrome.contextMenus.removeAll(function() {
    menus = [];
    menus.push(chrome.contextMenus.create({
      "title": "reload",
      "contexts": ["browser_action"],
      "onclick" : reload
    }));
    let accounts = JSON.parse(localStorage['accounts'] || '[]');
    for (let i = 0; i < accounts.length; i++) {
      let account = new Account(accounts[i]);
      menus.push(chrome.contextMenus.create({
        "title": account.name,
        "contexts": ["browser_action"],
        "onclick": function() {
          let app = new App(account);
          app.run();
        }
      }));
    }
  });
};
reload();
