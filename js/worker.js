import Message from './message';

export default class Worker {
  constructor(account) {
    this.account = account;
  }

  postNotification(message) {
    return chrome.notifications.create(
      null,
      {
        type: "basic",
        title: this.account.name,
        message: message.getText(),
        iconUrl: "icon.png"
      },
      (createdId) => {
        chrome.notifications.onClicked.addListener(clickedId => {
          if (createdId === clickedId) {
            window.open(message.getUrl());
          }
        });
      }.bind(this)
    );
  }

  onmessage(ev) {
    let message = new Message(this.account, JSON.parse(ev.data));
    if (message.shouldNotify()) {
      this.postNotification(message);
    }
  }

  setWsHandlers(ws) {
    ws.onmessage = this.onmessage.bind(this);
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
