function playSound() {
  const audio = new Audio(browser.runtime.getURL("sounds/bell.mp3"));
  audio.play();
  setTimeout(() => { audio.pause(); }, 500);
}

async function showToast(title, message, icon, adhan = false) {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: (t, m, i, a) => {
      const id = 'toast-' + Date.now();
      const div = document.createElement('div');
      div.id = id;
      const clr = a ? '#ffd700' : '#00d2ff';
      div.style = `position:fixed; top:20px; right:20px; width:300px; background:#0a192f; color:white; padding:18px; border-radius:12px; border-left:5px solid ${clr}; z-index:999999; font-family:sans-serif; box-shadow:0 10px 40px rgba(0,0,0,0.6); display:flex; justify-content:space-between; align-items:center; animation:in 0.4s ease-out;`;
      div.innerHTML = `<div style="display:flex; gap:12px; align-items:center;"><span style="font-size:26px;">${i}</span><div><b style="color:${clr}; display:block;">${t}</b><small>${m}</small></div></div><button id="cl-${id}" style="background:none; border:none; color:#8892b0; cursor:pointer; font-size:20px;">&times;</button>`;
      document.body.appendChild(div);
      const s = document.createElement('style'); s.innerHTML = `@keyframes in { from { transform: translateX(120%); } to { transform: translateX(0); } }`;
      document.head.appendChild(s);
      document.getElementById(`cl-${id}`).onclick = () => div.remove();
      setTimeout(() => div?.remove(), 60000);
    },
    args: [title, message, icon, adhan]
  });
}

browser.alarms.onAlarm.addListener(async (a) => {
  if (a.name === "moveReminder") {
    const d = await browser.storage.local.get('moveEnabled');
    if (d.moveEnabled !== false) { playSound(); showToast("Sea Flow", "Stretch and breathe. 🌊", "🌊"); }
  } else { checkAdhan(); }
});

async function checkAdhan() {
  const d = await browser.storage.local.get(['timings', 'lastNotified']);
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  for (let p of ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]) {
    if (d.timings?.[p] === time && d.lastNotified !== p) {
      playSound(); showToast(`Time for ${p}`, "Step away for prayer.", "🕌", true);
      browser.storage.local.set({ lastNotified: p });
    }
  }
}
browser.alarms.create("adhanCheck", { periodInMinutes: 1 });