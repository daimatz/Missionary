import Account from './account';
import Worker from './worker';

class Background {
  constructor() {
    this.menus = [];
  }

  reload() {
    chrome.contextMenus.removeAll(() => {
      this.menus = [];
      this.menus.push(chrome.contextMenus.create({
        "title": "reload",
        "contexts": ["browser_action"],
        "onclick" : (info, tab) => this.reload()
      }));
      let accounts = JSON.parse(localStorage['accounts'] || '[]');
      for (let i = 0; i < accounts.length; i++) {
        let account = new Account(accounts[i]);
        this.menus.push(chrome.contextMenus.create({
          "title": account.name,
          "contexts": ["browser_action"],
          "onclick": () => new Worker(account).main()
        }));
      }
    });
  }

  main() {
    this.reload();
  }
}

new Background().main();
