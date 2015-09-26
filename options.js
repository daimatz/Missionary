var tokenForm = function(token) {
  var div = document.createElement('div');
  div.className = 'token';
  var span = document.createElement('span');
  span.innerHTML = 'token: ';
  var input = document.createElement('input');
  input.className = 'token';
  input.type = 'text';
  input.value = token;

  div.appendChild(span);
  div.appendChild(input);
  return div;
};

var saveButton = function() {
  var div = document.createElement('div');
  div.className = 'save';
  var button = document.createElement('button');
  button.onclick = function() {
    var inputs = document.querySelectorAll('input.token');
    var str = '';
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i] || inputs[i].value === '') { continue; }
      str += ' ' + inputs[i].value;
    }
    localStorage['tokens'] = str.substring(1);
  };
  button.innerHTML = 'save';
  div.appendChild(button);
  return div;
};

var main = function() {
  var body = document.getElementById('body');

  // tokens are separeted by white space
  var tokens = (localStorage['tokens'] || '').split(' ');
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] === '') { continue; }
    body.appendChild(tokenForm(tokens[i]));
  }

  body.appendChild(tokenForm(''));
  body.appendChild(saveButton());
};

window.onload = main;
