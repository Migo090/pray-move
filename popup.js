const api = typeof browser !== "undefined" ? browser : chrome;
let countdownInterval;

async function init() {
  const data = await api.storage.local.get(['timings', 'locationName', 'moveEnabled', 'interval']);
  if (data.locationName) document.getElementById('location-display').innerText = data.locationName;
  if (data.interval) document.getElementById('move-interval').value = data.interval;
  document.getElementById('enable-move').checked = data.moveEnabled !== false;

  if (data.timings) {
    updatePrayerUI(data.timings);
    startCountdown(data.timings);
  }
}

function format12Hour(time24) {
  let [hours, minutes] = time24.split(':');
  hours = parseInt(hours);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours}:${minutes} ${ampm}`;
}

function updatePrayerUI(timings) {
  ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
    const row = document.getElementById(`row-${p}`);
    if (row && timings[p]) {
      row.querySelector('.time').innerText = format12Hour(timings[p]);
    }
  });
}

function startCountdown(timings) {
  if (countdownInterval) clearInterval(countdownInterval);
  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  countdownInterval = setInterval(() => {
    const now = new Date();
    let minDiff = Infinity;
    let next = "";

    prayerNames.forEach(name => {
      const [h, m] = timings[name].split(':');
      let pTime = new Date();
      pTime.setHours(parseInt(h), parseInt(m), 0, 0);
      if (pTime < now) pTime.setDate(pTime.getDate() + 1);
      
      const diff = pTime - now;
      if (diff < minDiff) { minDiff = diff; next = name; }
    });

    document.querySelectorAll('.salah-row').forEach(r => r.classList.remove('highlighted'));
    document.getElementById(`row-${next}`).classList.add('highlighted');

    const hh = Math.floor(minDiff / 3600000);
    const mm = Math.floor((minDiff % 3600000) / 60000);
    const ss = Math.floor((minDiff % 60000) / 1000);

    document.getElementById('h').innerText = hh.toString().padStart(2, '0');
    document.getElementById('m').innerText = mm.toString().padStart(2, '0');
    document.getElementById('s').innerText = ss.toString().padStart(2, '0');
  }, 1000);
}

// Navigation and Save logic...
document.getElementById('move-page-btn').onclick = () => document.getElementById('page-container').classList.add('slide-active');
document.getElementById('back-btn').onclick = () => document.getElementById('page-container').classList.remove('slide-active');

document.getElementById('save-move-settings').onclick = async () => {
  const interval = parseInt(document.getElementById('move-interval').value);
  const moveEnabled = document.getElementById('enable-move').checked;
  await api.storage.local.set({ interval, moveEnabled });
  api.alarms.clear("moveReminder");
  if (moveEnabled) api.alarms.create("moveReminder", { periodInMinutes: interval });
  document.getElementById('page-container').classList.remove('slide-active');
};

init();