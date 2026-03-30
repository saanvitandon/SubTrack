function simpleHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash; // 32-bit int
  }
  return hash.toString(16);
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('subtrack_users') || '[]'); }
  catch(e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem('subtrack_users', JSON.stringify(users));
}

function findUser(email) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase()) return users[i];
  }
  return null;
}

function getSession() {
  try { return JSON.parse(localStorage.getItem('subtrack_session') || 'null'); }
  catch(e) { return null; }
}

function setSession(user) {
  localStorage.setItem('subtrack_session', JSON.stringify({
    username: user.username,
    email:    user.email
  }));
}

function clearSession() {
  localStorage.removeItem('subtrack_session');
}

function requireAuth() {
  var session = getSession();
  if (!session || !session.email) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

function userSubsKey(username) {
  return 'subtrack_subs_' + username;
}

function userNextIdKey(username) {
  return 'subtrack_nextid_' + username;
}



function signupUser(username, email, password) {
  if (!username || username.trim().length < 2) {
    return { ok: false, error: 'Username must be at least 2 characters.' };
  }
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' };
  }

  // Check if email already registered (after field validation)
  if (findUser(email)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  // Save new user
  var users = getUsers();
  var newUser = {
    username: username.trim(),
    email:    email.toLowerCase().trim(),
    passHash: simpleHash(password)
  };
  users.push(newUser);
  saveUsers(users);

  return { ok: true, user: newUser };
}

function loginUser(email, password) {
  if (!email || !password) {
    return { ok: false, error: 'Please fill in all fields.' };
  }

  var user = findUser(email);
  if (!user) {
    return { ok: false, error: 'No account found with that email.' };
  }

  if (user.passHash !== simpleHash(password)) {
    return { ok: false, error: 'Incorrect password.' };
  }

  return { ok: true, user: user };
}

function resetPassword(email, newPassword) {
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters.' };
  }

  var users = getUsers();
  var found = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase()) {
      users[i].passHash = simpleHash(newPassword);
      found = true;
      break;
    }
  }

  if (!found) {
    return { ok: false, error: 'No account found with that email.' };
  }

  saveUsers(users);
  return { ok: true };
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = theme === 'light' ? '⏾' : '☀︎';
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

var _authToastTimer;
function showAuthToast(msg, isError) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = isError ? 'error show' : 'show';
  clearTimeout(_authToastTimer);
  _authToastTimer = setTimeout(function() { el.classList.remove('show'); }, 3000);
}

(function handleOAuthLogin() {
  const params = new URLSearchParams(window.location.search);

  const email = params.get("email");
  const username = params.get("username");

  if (email && username) {
    setSession({ email, username });

    // clean URL (important)
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();