document.addEventListener('DOMContentLoaded', async function() {

  var session = requireAuth();
  if (!session) return;

  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  initTheme();

  // FETCH FROM BACKEND
  async function fetchSubs() {
    const res = await fetch(`http://localhost:5000/api/subscriptions/${session.email}`);
    return await res.json();
  }

  var subscriptions = await fetchSubs();

  updateHeaderStats(subscriptions);

  renderAnalytics(subscriptions);


  function renderAnalytics(subscriptions) {

    var container = document.getElementById('analytics-content');

    if (!subscriptions || subscriptions.length === 0) {
      container.innerHTML =
        '<div class="analytics-card full">' +
          '<div class="coming-soon">' +
            '<div class="big">&#9678;</div>' +
            '<div>Add subscriptions to see analytics</div>' +
          '</div>' +
        '</div>';
      return;
    }

    var totalM = calculateTotal(subscriptions);

    // CATEGORY BREAKDOWN
    var byCategory = {};

    subscriptions.forEach(s => {
      var mo = s.cycle === 'yearly' ? s.cost / 12 : s.cost;
      byCategory[s.category] = (byCategory[s.category] || 0) + mo;
    });

    var catKeys = Object.keys(byCategory).sort((a,b) => byCategory[b]-byCategory[a]);

    var catRows = '';

    catKeys.forEach(name => {
      var val  = byCategory[name];
      var pct  = totalM > 0 ? (val / totalM * 100).toFixed(1) : 0;
      var cat  = getCat(name);

      catRows +=
        '<div class="breakdown-item">' +
          '<div class="breakdown-row">' +
            '<div class="breakdown-name">' +
              '<img src="' + catSvgUrl(name) + '" style="width:14px;height:14px;margin-right:6px;" />' +
              escapeHtml(name) +
            '</div>' +
            '<div class="breakdown-val">&#8377;' + val.toFixed(2) + '/mo</div>' +
          '</div>' +
          '<div class="breakdown-bar-track">' +
            '<div class="breakdown-bar-fill" style="width:' + pct + '%;background:' + cat.color + '"></div>' +
          '</div>' +
        '</div>';
    });

    // PER PLAN CONTRIBUTION
    var planBars = '';

    subscriptions.forEach(sub => {
      var mo  = sub.cycle === 'yearly' ? sub.cost / 12 : sub.cost;
      var pct = totalM > 0 ? (mo / totalM * 100).toFixed(1) : 0;
      var cat = getCat(sub.category);

      planBars +=
        '<div style="margin-bottom:10px;">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
            '<span style="font-size:12px;font-weight:600;">' +
              escapeHtml(sub.name) +
            '</span>' +
            '<span style="font-size:11px;color:' + cat.color + '">&#8377;' + mo.toFixed(2) + '/mo</span>' +
          '</div>' +
          '<div style="height:3px;background:var(--border);">' +
            '<div style="width:' + pct + '%;background:' + cat.color + ';height:100%;"></div>' +
          '</div>' +
        '</div>';
    });

    // SMART REMINDERS
    function getNextDate(startDate, cycle) {
      const start = new Date(startDate);
      const now = new Date();

      let next = new Date(start);

      while (next <= now) {
        if (cycle === "monthly") next.setMonth(next.getMonth() + 1);
        else next.setFullYear(next.getFullYear() + 1);
      }

      return next;
    }

    function renderReminders(subscriptions) {

      let urgentList = [];
      let upcomingList = [];

      subscriptions.forEach(sub => {
        if (!sub.startDate) return;

        const next = getNextDate(sub.startDate, sub.cycle);
        const diff = Math.ceil((next - new Date()) / (1000 * 60 * 60 * 24));

        let text = '';
        if (diff === 0) text = 'renews TODAY';
        else if (diff === 1) text = 'renews tomorrow';
        else text = `renews in ${diff} days`;

        if (diff <= 3) {
          urgentList.push(`${sub.name} ${text}`);
        } else if (diff <= 7) {
          upcomingList.push(`${sub.name} ${text}`);
        }
      });

      return `
        <div style="margin-bottom:16px;">

          <div style="font-size:15px;font-weight:700;margin-bottom:8px;color:#ff4d8d;">
            🔴 URGENT
          </div>

          <ul class="reminder-list urgent">
            ${
              urgentList.length
                ? urgentList.map(item => `<li>${item}</li>`).join('')
                : '<li class="empty">No urgent renewals!</li>'
            }
          </ul>

        </div>

        <div>

          <div style="font-size:15px;font-weight:700;margin-bottom:8px;color:#facc15;">
            🟡 UPCOMING
          </div>

          <ul class="reminder-list upcoming">
            ${
              upcomingList.length
                ? upcomingList.map(item => `<li>${item}</li>`).join('')
                : '<li class="empty">No upcoming renewals</li>'
            }
          </ul>

        </div>
      `;
    }

    var remindersHTML = renderReminders(subscriptions);

    // FINAL RENDER
    container.innerHTML =
      '<div class="analytics-card">' +
        '<h3>Spend by Category</h3>' +
        '<div class="breakdown-list">' + catRows + '</div>' +
      '</div>' +

      '<div class="analytics-card">' +
        '<h3>Per Plan Contribution</h3>' +
        planBars +
      '</div>' +

      '<div class="analytics-card full">' +
        '<h3>⚠️ Upcoming Renewals</h3>' +
        remindersHTML +
      '</div>';
  }

});