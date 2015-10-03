export default class Account {
  constructor(json) {
    this.name_ = json.name;
    this.token_ = json.token;
  }
  get name() {
    return this.name_;
  }
  get token() {
    return this.token_;
  }
}
