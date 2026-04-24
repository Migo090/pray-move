// Unified function for prayer notifications
async function triggerPrayerNotification(prayerName) {
  console.log('Triggering prayer notification for:', prayerName);
  await playSound(true);
  console.log('Adhan sound played, now showing notification');
  await showNotification(`Time for ${prayerName} Prayer`, "Step away for prayer. 🕌", false);
  // Show red badge for prayer notifications
  browser.action.setBadgeText({ text: "!" });
  browser.action.setBadgeBackgroundColor({ color: "#FF0000" });
  browser.storage.local.set({ lastNotified: prayerName });
  console.log('Prayer notification completed for:', prayerName);
}

// Unified function for movement notifications
async function triggerMovementNotification() {
  await playMovementSequence();
  await showNotification("Sea Flow", "Stretch and breathe.", false);
}

function playSound(isAdhan = false) {
  const soundFile = isAdhan ? "sounds/short-adhan.mp3" : "sounds/stretch.mp3";
  const audio = new Audio(browser.runtime.getURL(soundFile));
  
  // Assign to global variable to prevent garbage collection
  globalThis.currentAudio = audio;
  
  // Play audio with error handling
  audio.play().catch(error => {
    console.error('Audio play failed:', error);
  });
  
  // Let Adhan play completely - don't stop it early
  // For stretch.mp3, let it play completely too
  
  // Clean up when audio ends
  audio.addEventListener('ended', () => {
    console.log('Audio playback completed:', soundFile);
    if (globalThis.currentAudio === audio) {
      globalThis.currentAudio = null;
    }
  });
}

// Separate function for bell + stretch sequence
async function playMovementSequence() {
  // Play bell first
  const bellAudio = new Audio(browser.runtime.getURL("sounds/bell.mp3"));
  globalThis.currentAudio = bellAudio;
  
  bellAudio.play().catch(error => {
    console.error('Bell audio failed:', error);
  });
  
  // Wait for bell to finish, then play stretch
  bellAudio.addEventListener('ended', () => {
    console.log('Bell completed, playing stretch');
    const stretchAudio = new Audio(browser.runtime.getURL("sounds/stretch.mp3"));
    globalThis.currentAudio = stretchAudio;
    
    stretchAudio.play().catch(error => {
      console.error('Stretch audio failed:', error);
    });
    
    stretchAudio.addEventListener('ended', () => {
      console.log('Stretch playback completed');
      globalThis.currentAudio = null;
    });
  });
}

async function showNotification(title, message, isMovement = false) {
  const notificationId = isMovement ? `flow-${Date.now()}` : `adhan-${Date.now()}`;
  const options = {
    type: "basic",
    iconUrl: "icons/icon96.png",
    title: title,
    message: message,
    priority: 2
  };
  
  // Only add requireInteraction for movement reminders, with error handling
  if (isMovement) {
    try {
      options.requireInteraction = true;
    } catch (error) {
      console.log('requireInteraction not supported, notification will still show:', error);
    }
  }
  
  console.log('Creating notification:', title, message, options);
  
  try {
    await browser.notifications.create(notificationId, options);
    console.log('Notification created successfully:', notificationId);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

browser.alarms.onAlarm.addListener(async (a) => {
  if (a.name === "moveReminder") {
    const d = await browser.storage.local.get('moveEnabled');
    if (d.moveEnabled !== false) { 
      await triggerMovementNotification();
    }
  } else { checkAdhan(); }
});

async function checkAdhan() {
  const d = await browser.storage.local.get(['timings', 'lastNotified']);
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  
  for (let p of ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]) {
    if (d.timings?.[p] === time && d.lastNotified !== p) {
      await triggerPrayerNotification(p);
    }
  }
  
  // Check for Sunrise (no Adhan sound)
  if (d.timings?.Sunrise === time && d.lastNotified !== "Sunrise") {
    showNotification("Sunrise Time", "A new day begins. 🌅", false);
    browser.storage.local.set({ lastNotified: "Sunrise" });
  }
}

browser.alarms.create("adhanCheck", { periodInMinutes: 1 });