import Account from './account';

export default class Worker {
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

  main() {
    this.createRealTimeSession()
      .then(this.setWsHandlers.bind(this));
  }
}
