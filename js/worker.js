import Message from './message';
const ReconnectingWebSocket = require('../node_modules/ReconnectingWebSocket/reconnecting-websocket');

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

  onclose(ev) {
  }

  onerror(ev) {
  }

  onmessage(ev) {
    let message = new Message(this.account, JSON.parse(ev.data));
    if (message.shouldNotify()) {
      this.postNotification(message);
    }
  }

  onopen(ev) {
  }

  setWsHandlers(ws) {
    ws.onclose = this.onclose.bind(this);
    ws.onerror = this.onerror.bind(this);
    ws.onmessage = this.onmessage.bind(this);
    ws.onopen = this.onopen.bind(this);
  }

  createRealTimeSession() {
    let url = "https://slack.com/api/rtm.start?token=" + this.account.token;
    return fetch(url)
      .then(res => res.json())
      .then(json => new ReconnectingWebSocket(json.url))
      .then(this.setWsHandlers.bind(this));
  }

  main() {
    this.createRealTimeSession()
  }
}
