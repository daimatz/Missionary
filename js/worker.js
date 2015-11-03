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
      createdId => {
        chrome.notifications.onClicked.addListener(clickedId => {
          if (createdId === clickedId) {
            window.open(message.getUrl());
          }
        });
      }.bind(this)
    );
  }

  onclose(ws, ev) {
  }

  onerror(ws, ev) {
    console.log("error. reconnecting...");
    ws.close();
    this.createRealTimeSession();
  }

  onmessage(ws, ev) {
    console.log("onmessage: " + ev.data);
    let json = JSON.parse(ev.data);
    let message = new Message(this.account, json);
    if (message.shouldNotify()) {
      this.postNotification(message);
    }
  }

  onopen(ws, ev) {
    console.log("connected!");
  }

  setWsHandlers(ws) {
    ws.onclose = ev => {
      this.onclose(ws, ev);
    }.bind(this);
    ws.onerror = ev => {
      this.onerror(ws, ev);
    }.bind(this);
    ws.onmessage = ev => {
      this.onmessage(ws, ev);
    }.bind(this);
    ws.onopen = ev => {
      this.onopen(ws, ev);
    }.bind(this);
  }

  createRealTimeSession() {
    let url = "https://slack.com/api/rtm.start?token=" + this.account.token;
    return fetch(url)
      .then(res => res.json())
      .then(json => new WebSocket(json.url))
      .then(this.setWsHandlers.bind(this))
      .catch(e => {
        console.log("failed to create ws session. try 1 mintute after...");
        setTimeout(this.createRealTimeSession.bind(this), 60000);
      }.bind(this));
  }

  main() {
    this.createRealTimeSession()
  }
}
