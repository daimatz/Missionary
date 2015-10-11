class Options {
  createAccountForm(account) {
    let accountDiv = document.createElement('div');
    accountDiv.className = 'account';

    let nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    let nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.innerHTML = 'name: ';
    let nameInput = document.createElement('input');
    nameInput.className = 'name';
    nameInput.type = 'text';
    if (account) { nameInput.value = account.name; }

    nameDiv.appendChild(nameSpan);
    nameDiv.appendChild(nameInput);

    let tokenDiv = document.createElement('div');
    tokenDiv.className = 'token';
    let tokenSpan = document.createElement('span');
    tokenSpan.innerHTML = 'token: ';
    let tokenInput = document.createElement('input');
    tokenInput.className = 'token';
    tokenInput.type = 'text';
    if (account) { tokenInput.value = account.token; }

    tokenDiv.appendChild(tokenSpan);
    tokenDiv.appendChild(tokenInput);

    accountDiv.appendChild(nameDiv);
    accountDiv.appendChild(tokenDiv);

    return accountDiv;
  }

  createAddButton(parentNode) {
    let div = document.createElement('div');
    div.className = 'add';
    let button = document.createElement('button');
    button.onclick = () => parentNode.appendChild(this.createAccountForm(null));
    button.innerHTML = 'add account';
    div.appendChild(button);
    return div;
  }

  createSaveButton() {
    let div = document.createElement('div');
    div.className = 'save';
    let button = document.createElement('button');
    button.onclick = () => {
      let accountDivs = document.querySelectorAll('div.account');
      let accounts = [];
      for (let i = 0; i < accountDivs.length; i++) {
        let div = accountDivs[i];
        let name = div.querySelectorAll('input.name')[0].value;
        let token = div.querySelectorAll('input.token')[0].value;
        if (name !== '' && token !== '') { accounts.push({name, token}); }
      }
      localStorage['accounts'] = JSON.stringify(accounts);
    };
    button.innerHTML = 'save';
    div.appendChild(button);
    return div;
  }

  main() {
    let body = document.getElementById('body');
    let accountsDiv = document.createElement('div');

    let accounts = JSON.parse(localStorage['accounts'] || '[]');
    for (let i = 0; i < accounts.length; i++) {
      accountsDiv.appendChild(this.createAccountForm(accounts[i]));
    }

    accountsDiv.appendChild(this.createAccountForm(null));
    body.appendChild(accountsDiv);
    body.appendChild(this.createAddButton(accountsDiv));
    body.appendChild(this.createSaveButton());
  }
}

window.onload = new Options().main();
