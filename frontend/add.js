/* add.js — runs on add.html */

document.addEventListener('DOMContentLoaded', async function() {

  var session = requireAuth();
  if (!session) return;

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  let isEdit = false;

  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  initTheme();

  flatpickr("#f-date", {
    dateFormat: "Y-m-d",
    defaultDate: "today"
  });

  // 🔥 FETCH SUBSCRIPTIONS (for stats + edit)
  async function fetchSubs() {
    const res = await fetch(`http://localhost:5000/api/subscriptions/${session.email}`);
    return await res.json();
  }

  const subscriptions = await fetchSubs();
  updateHeaderStats(subscriptions);

  // 🔥 CATEGORY PICKER
  buildCatPicker('f-cat-picker', 'f-cat');

  // 🔥 EDIT MODE PREFILL
  if (editId) {
    isEdit = true;

    const sub = subscriptions.find(s => s._id === editId);
    if (!sub) return;

    document.getElementById('f-name').value = sub.name;
    document.getElementById('f-cost').value = sub.cost;
    document.getElementById('f-cycle').value = sub.cycle;
    document.getElementById('f-cat').value = sub.category;

    // re-render picker with selected category
    buildCatPicker('f-cat-picker', 'f-cat');

    if (sub.startDate) {
      document.getElementById('f-date').value = sub.startDate.split("T")[0];
    }
  }

  // 🔥 FORM SUBMIT
  document.getElementById('sub-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    var name     = document.getElementById('f-name').value.trim();
    var costStr  = document.getElementById('f-cost').value;
    var cost     = parseFloat(costStr);
    var cycle    = document.getElementById('f-cycle').value;
    var category = document.getElementById('f-cat').value;

    var rawDate = document.getElementById('f-date').value;
    var startDate = rawDate ? new Date(rawDate) : new Date();

    if (!name) { showToast('Please enter a subscription name.', true); return; }
    if (costStr === '' || isNaN(cost) || cost < 0) { showToast('Please enter a valid cost.', true); return; }

    try {
      const url = isEdit
        ? `http://localhost:5000/api/subscriptions/${editId}`
        : "http://localhost:5000/api/subscriptions";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail: session.email,
          name: name,
          cost: cost,
          cycle: cycle,
          category: category,
          startDate: startDate
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed", true);
        return;
      }

      showToast(isEdit ? "Subscription updated!" : "Subscription added!");

      setTimeout(function() {
        window.location.href = 'index.html';
      }, 900);

    } catch (err) {
      console.error(err);
      showToast("Server error", true);
    }

  });

});