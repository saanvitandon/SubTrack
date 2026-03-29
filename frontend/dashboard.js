document.addEventListener('DOMContentLoaded', async function() {

  const session = requireAuth();
  if (!session) return;

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  const pageSub = document.querySelector('.header-left p');
  if (pageSub) pageSub.textContent = 'Hello ' + session.username + '!';

  initTheme();

  // 🔥 FETCH FROM BACKEND
  async function fetchSubs() {
    const res = await fetch(`http://localhost:5000/api/subscriptions/${session.email}`);
    return await res.json();
  }

  let subscriptions = await fetchSubs();

  updateHeaderStats(subscriptions);
  renderCards();

  // 🧾 RENDER CARDS
  function renderCards() {
    const container = document.getElementById('cards-container');
    const countLabel = document.getElementById('dash-count-label');

    container.innerHTML = '';

    const count = subscriptions.length;
    if (countLabel) {
      countLabel.textContent = count === 1 ? '1 service' : count + ' services';
    }

    if (count === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="big">&#8709;</div>' +
          '<p>No subscriptions yet. <a href="add.html" style="color:var(--accent)">Add one</a></p>' +
        '</div>';
      return;
    }

    subscriptions.forEach(sub => {

      const cat = getCat(sub.category);
      const badgeClass = sub.cycle === 'yearly' ? 'badge-yearly' : 'badge-monthly';

      const cycleLabel = sub.cycle === 'yearly'
        ? `≈ ₹${(sub.cost / 12).toFixed(2)}/mo`
        : 'per month';

      const card = document.createElement('div');
      card.className = 'sub-card';
      card.style.setProperty('--accent', cat.color);

      card.innerHTML =
        `<div class="card-top">
          <div>
            <div class="card-name">${escapeHtml(sub.name)}</div>
            <div class="card-category">
              <img class="cat-icon-img" src="${catSvgUrl(sub.category)}" />
              ${escapeHtml(sub.category)}
            </div>
          </div>
          <div class="card-badge ${badgeClass}">${sub.cycle}</div>
        </div>

        <div class="card-bottom">
          <div>
            <div class="card-cost-label">Cost</div>
            <div class="card-cost">₹${parseFloat(sub.cost).toFixed(2)}</div>
            <div class="card-cost-cycle">${cycleLabel}</div>
          </div>

          <div class="card-actions">
          <button class="edit-btn" data-id="${sub._id}">✎</button>
            <button class="delete-btn" data-id="${sub._id}">✕</button>
          </div>
        </div>`;

      container.appendChild(card);
    });

    // DELETE HANDLER
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const id = this.dataset.id;

        await fetch(`http://localhost:5000/api/subscriptions/${id}`, {
          method: "DELETE"
        });

        subscriptions = subscriptions.filter(s => s._id !== id);

        updateHeaderStats(subscriptions);
        renderCards();

        showToast("Subscription deleted");
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.dataset.id;
        window.location.href = "add.html?edit=" + id;
    });
});
  }

});