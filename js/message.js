export default class Message {
  constructor(account, json) {
    this.account = account;
    this.json = json;
  }

  shouldNotify() {
    return (
      true
      && (this.json.type === 'message')
      && (!this.json.subtype)
      && (typeof this.json.text === 'string')
    );
  }

  getText() {
    return this.json.text;
  }

  getUrl() {
    return `https://${this.account.name}.slack.com/`;
  }
}
