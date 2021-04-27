var curmap, curtok, dir, inp, out, orig, conv;

function convert(text) {
  out.innerHTML = text
    .replace(/([-a-z\u0600-\u06ff\u0762\u200c]+)/ig, function(match, p1) {
      return renderTokens(match, curmap.get(p1.toLowerCase()) || [p1]);
    });
}

function renderTokens(match, tokens) {
  let e = document.createElement('span');
  e.appendChild(document.createTextNode(tokens[0]));
  e.dataset.original = match;
  e.dataset.values = JSON.stringify(tokens);
  e.className = (tokens.length > 1) ? 'multi token' : 'token';
  let tmp = document.createElement('div');
  tmp.appendChild(e);
  return tmp.innerHTML;
}

function displayTokenMenu(e) {
  if (e.button == 0 && e.target && e.target.classList.contains("token")) {
    curtok = e.target;
    orig.innerHTML = curtok.dataset.original;
    clearConversions();
    JSON.parse(curtok.dataset.values).forEach(function(s) {
      c = document.createElement('span');
      c.className = 'conversion';
      c.innerHTML = s;
      conv.appendChild(c);
    })
    return true;
  } else {
    return false;
  }
}

function clearConversions() {
  while (conv.firstChild) { conv.removeChild(conv.firstChild); }
}

function selectConversion(e) {
  if (e.button == 0 && e.target && e.target.classList.contains("conversion")) {
    let conv = e.target;
    curtok.innerHTML = conv.innerHTML;
    return true;
  } else {
    return false;
  }
}

function toggleDirection() {
  if (curmap === rjmap) {
    curmap = jrmap;
    dir.innerHTML = "Jawi to Rumi";
    inp.style.direction = 'rtl';
    out.style.direction = 'ltr';
  } else {
    curmap = rjmap;
    dir.innerHTML = "Rumi to Jawi";
    inp.style.direction = 'ltr';
    out.style.direction = 'rtl';
  }
  inp.value = out.textContent;
  orig.innerHTML = '';
  clearConversions();
  convert(inp.value);
}

window.addEventListener('DOMContentLoaded', function (event) {
  curmap = rjmap;
  dir = document.getElementById('direction');
  inp = document.getElementById('input');
  out = document.getElementById('output');
  orig = document.getElementById('original');
  conv = document.getElementById('conversions');
  inp.addEventListener('input', function(){convert(this.value)}, false);
  convert(inp.value);
  document.getElementById('directionToggle')
    .addEventListener('click', toggleDirection);
  out.addEventListener('click', function(e) { displayTokenMenu(e) });
  conv.addEventListener('click', function(e) { selectConversion(e) });
});
