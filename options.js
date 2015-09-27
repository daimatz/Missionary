var createAccountForm = function(account) {
  var accountDiv = document.createElement('div');
  accountDiv.className = 'account';

  var nameDiv = document.createElement('div');
  nameDiv.className = 'name';
  var nameSpan = document.createElement('span');
  nameSpan.className = 'name';
  nameSpan.innerHTML = 'name: ';
  var nameInput = document.createElement('input');
  nameInput.className = 'name';
  nameInput.type = 'text';
  if (account) { nameInput.value = account.name; }

  nameDiv.appendChild(nameSpan);
  nameDiv.appendChild(nameInput);

  var tokenDiv = document.createElement('div');
  tokenDiv.className = 'token';
  var tokenSpan = document.createElement('span');
  tokenSpan.innerHTML = 'token: ';
  var tokenInput = document.createElement('input');
  tokenInput.className = 'token';
  tokenInput.type = 'text';
  if (account) { tokenInput.value = account.token; }

  tokenDiv.appendChild(tokenSpan);
  tokenDiv.appendChild(tokenInput);

  accountDiv.appendChild(nameDiv);
  accountDiv.appendChild(tokenDiv);

  return accountDiv;
};

var createAddButton = function(parentNode) {
  var div = document.createElement('div');
  div.className = 'add';
  var button = document.createElement('button');
  button.onclick = function() {
    parentNode.appendChild(createAccountForm(null));
  };
  button.innerHTML = 'add account';
  div.appendChild(button);
  return div;
};

var createSaveButton = function() {
  var div = document.createElement('div');
  div.className = 'save';
  var button = document.createElement('button');
  button.onclick = function() {
    var accountDivs = document.querySelectorAll('div.account');
    var accounts = [];
    for (var i = 0; i < accountDivs.length; i++) {
      var div = accountDivs[i];
      var name = div.querySelectorAll('input.name')[0].value;
      var token = div.querySelectorAll('input.token')[0].value;
      if (name !== '' && token !== '') {
        accounts.push({
          name: name,
          token: token
        });
      }
    }
    localStorage['accounts'] = JSON.stringify(accounts);
  };
  button.innerHTML = 'save';
  div.appendChild(button);
  return div;
};

var main = function() {
  var body = document.getElementById('body');
  var accountsDiv = document.createElement('div');

  var accounts = JSON.parse(localStorage['accounts'] || '[]');
  for (var i = 0; i < accounts.length; i++) {
    accountsDiv.appendChild(createAccountForm(accounts[i]));
  }

  accountsDiv.appendChild(createAccountForm(null));
  body.appendChild(accountsDiv);
  body.appendChild(createAddButton(accountsDiv));
  body.appendChild(createSaveButton());
};

window.onload = main;
