var toRumi = false;
var curtok, dir, inp, out, orig, conv;

function convert(text) {
  let convertToken = toRumi ? convertJawiToken : convertRumiToken;
  out.innerHTML = text
    .replace(/([-a-z\u0620-\u06ff\u0762\u200c]+|[,;?\u060c\u061b\u061f])/ig, function(match, p1) {
      return renderTokens(match, convertToken(p1));
    });
}

var normJawi = new Map([
  ['\u0643', '\u06a9'],  // Arabic kaf
  ['\u06af', '\u0762'],  // Persian/Urdu gaf
  ['\u06ac', '\u0762'],  // kaf with dot above
  ['\u060c', '\u002c'],  // Arabic comma
  ['\u061b', '\u003b'],  // Arabic semicolon
  ['\u061f', '\u003f'],  // Arabic question mark
])

function convertJawiToken(jawi) {
  let normtoken = [...jawi].map(ch => normJawi.get(ch) || ch).join('');
  if (jrmap.has(normtoken)) {
    return jrmap.get(normtoken);
  } else if (normtoken.startsWith('\u062f') && jrmap.has(normtoken.substr(1))) {
    return jrmap.get(normtoken.substr(1)).map(s => "di " + s);
  } else if (normtoken.endsWith('\u0644\u0647') && jrmap.has(normtoken.slice(0, -2))) {
    return jrmap.get(normtoken.slice(0, -2)).map(s => s + "lah");
  } else {
    return [normtoken]
  }
}

var normRumi = new Map([
  ['\u002c', '\u060c'],  // comma
  ['\u003b', '\u061b'],  // semicolon
  ['\u003f', '\u061f'],  // question mark
])

function convertRumiToken(rumi) {
  if (normRumi.has(rumi))
    return normRumi.get(rumi);
  let normtoken = rumi.toLowerCase();
  if (rjmap.has(normtoken)) {
    return rjmap.get(normtoken);
  } else if (normtoken.endsWith('lah') && rjmap.has(normtoken.slice(0, -3))) {
    return rjmap.get(normtoken.slice(0, -3)).map(s => s + "\u0644\u0647");
  } else {
    return [rumi]
  }
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
  if (toRumi) {
    toRumi = false;
    dir.innerHTML = "Rumi to Jawi";
    inp.style.direction = 'ltr';
    out.style.direction = 'rtl';
  } else {
    toRumi = true;
    dir.innerHTML = "Jawi to Rumi";
    inp.style.direction = 'rtl';
    out.style.direction = 'ltr';
  }
  inp.value = out.textContent;
  orig.innerHTML = '';
  clearConversions();
  convert(inp.value);
}

window.addEventListener('DOMContentLoaded', function (event) {
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
