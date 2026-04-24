const api = typeof browser !== "undefined" ? browser : chrome;
let countdownInterval;

async function init() {
  // Clear badge notification when popup opens
  api.action.setBadgeText({ text: "" });
  
  const data = await api.storage.local.get(['timings', 'locationName', 'moveEnabled', 'interval', 'lastUpdated']);
  
  if (data.locationName) document.getElementById('location-display').innerText = data.locationName;
  if (data.interval) document.getElementById('move-interval').value = data.interval;
  document.getElementById('enable-move').checked = data.moveEnabled !== false;

  // Check if we need to refresh data (new day or no data)
  const today = new Date().toDateString();
  const needsRefresh = !data.lastUpdated || data.lastUpdated !== today;
  
  if (data.timings && !needsRefresh) {
    updatePrayerUI(data.timings);
    startCountdown(data.timings);
  } else {
    await fetchLocationAndPrayers();
  }
}

function format12Hour(time24) {
  let [hours, minutes] = time24.split(':');
  hours = parseInt(hours);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function updatePrayerUI(timings) {
  ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
    const row = document.getElementById(`row-${p}`);
    if (row && timings[p]) {
      row.querySelector('.time').innerText = format12Hour(timings[p]);
    }
  });
}

function startCountdown(timings) {
  if (countdownInterval) clearInterval(countdownInterval);
  const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

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
    const nextRow = document.getElementById(`row-${next}`);
    if(nextRow) nextRow.classList.add('highlighted');

    const hh = Math.floor(minDiff / 3600000);
    const mm = Math.floor((minDiff % 3600000) / 60000);
    const ss = Math.floor((minDiff % 60000) / 1000);

    document.getElementById('h').innerText = hh.toString().padStart(2, '0');
    document.getElementById('m').innerText = mm.toString().padStart(2, '0');
    document.getElementById('s').innerText = ss.toString().padStart(2, '0');
  }, 1000);
}

async function fetchLocationAndPrayers() {
  const statusEl = document.getElementById('location-display');
  statusEl.innerText = "Locating...";

  try {
    // Get current position
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    
    const { latitude, longitude } = position.coords;
    
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Determine calculation method based on location
    let method = 3; // Default to Muslim World League
    if (latitude >= 22 && latitude <= 32 && longitude >= 25 && longitude <= 35) {
      method = 5; // Egyptian General Authority of Survey for Egypt
    }
    
    // Fetch prayer times with timezone using location-aware method
    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&timezone=${timezone}`);
    const result = await response.json();
    const timings = result.data.timings;
    
    // Get location name
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const geoData = await geoRes.json();
    const city = geoData.address.city || geoData.address.town || geoData.address.suburb || "My Location";

    // Store data with today's date
    const today = new Date().toDateString();
    await api.storage.local.set({ 
      timings, 
      locationName: city, 
      lastUpdated: today,
      coordinates: { latitude, longitude },
      timezone: timezone
    });

    statusEl.innerText = city;
    updatePrayerUI(timings);
    startCountdown(timings);
  } catch (error) {
    statusEl.innerText = "Location Error";
    console.error('Location fetch error:', error);
  }
}

document.getElementById('move-page-btn').onclick = () => document.getElementById('page-container').classList.add('slide-active');
document.getElementById('back-btn').onclick = () => document.getElementById('page-container').classList.remove('slide-active');

// Sync/Refresh button handler
document.getElementById('detect-loc-btn').onclick = async () => {
  await fetchLocationAndPrayers();
};

document.getElementById('save-move-settings').onclick = async () => {
  const interval = parseInt(document.getElementById('move-interval').value);
  const moveEnabled = document.getElementById('enable-move').checked;
  await api.storage.local.set({ interval, moveEnabled });
  api.alarms.clear("moveReminder");
  if (moveEnabled) api.alarms.create("moveReminder", { periodInMinutes: interval });
  document.getElementById('page-container').classList.remove('slide-active');
};

init();