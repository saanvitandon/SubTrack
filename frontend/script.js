var CATEGORIES = [
  { value:'Streaming', label:'Streaming', color:'#f04a7a',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
  { value:'Music', label:'Music', color:'#c84af0',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { value:'Software', label:'Software', color:'#4af0c8',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
  { value:'Cloud', label:'Cloud', color:'#4ab0f0',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>' },
  { value:'Gaming', label:'Gaming', color:'#f0c84a',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>' },
  { value:'News', label:'News', color:'#a0f04a',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>' },
  { value:'Finance', label:'Finance', color:'#c8f04a',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>' },
  { value:'Health', label:'Health', color:'#4af080',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
  { value:'Other', label:'Other', color:'#888ba0',
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="STROKE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' }
];

function getCat(value) {
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].value === value) return CATEGORIES[i];
  }
  return CATEGORIES[CATEGORIES.length - 1];
}

function catSvgUrl(value) {
  var cat = getCat(value);
  var colored = cat.svg.replace(/STROKE/g, cat.color);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(colored);
}

function loadSubscriptions() {
  try { return JSON.parse(localStorage.getItem('subtrack_subs') || '[]'); }
  catch(e) { return []; }
}

function loadNextId() {
  try { return parseInt(localStorage.getItem('subtrack_nextid') || '1', 10); }
  catch(e) { return 1; }
}

function saveSubscriptions(subs, nid) {
  try {
    localStorage.setItem('subtrack_subs', JSON.stringify(subs));
    localStorage.setItem('subtrack_nextid', String(nid));
  } catch(e) {}
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function calculateTotal(subs) {
  var t = 0;
  for (var i = 0; i < subs.length; i++) {
    t += subs[i].cycle === 'yearly' ? subs[i].cost / 12 : subs[i].cost;
  }
  return t;
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = (theme === 'light') ? '⏾' : '☀︎';
}

function initTheme() {
  var saved = localStorage.getItem('subtrack_theme') || 'dark';
  applyTheme(saved);
  var btn = document.getElementById('theme-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      var next = document.body.classList.contains('light') ? 'dark' : 'light';
      localStorage.setItem('subtrack_theme', next);
      applyTheme(next);
    });
  }
}

var _toastTimer;
function showToast(msg, isError) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = isError ? 'error show' : 'show';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { el.classList.remove('show'); }, 2800);
}

function buildCatPicker(pickerDivId, hiddenSelId) {
  var div = document.getElementById(pickerDivId);
  var sel = document.getElementById(hiddenSelId);
  if (!div || !sel) {
    console.warn('buildCatPicker: missing element. pickerDiv=' + pickerDivId + ' hiddenSel=' + hiddenSelId);
    return;
  }

  div.innerHTML = '';
  div.className = 'cat-picker';

  for (var i = 0; i < CATEGORIES.length; i++) {
    (function(cat) {
      var tile = document.createElement('div');
      tile.className = 'cat-option';
      tile.dataset.value = cat.value;

      var img = document.createElement('img');
      img.src = catSvgUrl(cat.value);
      img.alt = cat.label;
      img.width = 28;
      img.height = 28;

      var span = document.createElement('span');
      span.textContent = cat.label;

      tile.appendChild(img);
      tile.appendChild(span);
      div.appendChild(tile);

      tile.addEventListener('click', function() {
        var all = div.querySelectorAll('.cat-option');
        for (var j = 0; j < all.length; j++) all[j].classList.remove('selected');
        tile.classList.add('selected');
        sel.value = cat.value;
      });
    })(CATEGORIES[i]);
  }

  var first = div.querySelector('.cat-option');
  if (first) {
    first.classList.add('selected');
    sel.value = CATEGORIES[0].value;
  }
}

function setCatPicker(pickerDivId, hiddenSelId, value) {
  var div = document.getElementById(pickerDivId);
  var sel = document.getElementById(hiddenSelId);
  if (!div || !sel) return;
  var tiles = div.querySelectorAll('.cat-option');
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].classList.toggle('selected', tiles[i].dataset.value === value);
  }
  sel.value = value;
}

function updateHeaderStats(subs) {
  var total = calculateTotal(subs);
  var count = subs.length;
  var a = document.getElementById('total-spend');
  var b = document.getElementById('total-count');
  var c = document.getElementById('sub-count');
  if (a) a.textContent = '₹' + total.toFixed(2);
  if (b) b.textContent = count;
  if (c) c.textContent = count;
}