# Pray & Move 🕌🏃‍♂️

**Pray & Move** is a holistic productivity companion designed by **Magdy Ali**. It seamlessly integrates spiritual mindfulness with physical health by providing accurate prayer timings and movement reminders directly in your browser.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Firefox%20%7C%20Chrome-orange.svg)](#)

## ✨ Features

### 🕌 **Prayer Time Management**
* **Global Accuracy:** Automatically detects your location and uses the appropriate calculation method (Egyptian General Authority for Egypt, Muslim World League for other regions)
* **Complete Prayer Schedule:** Fajr, Sunrise (الشروق), Dhuhr, Asr, Maghrib, and Isha with real-time countdown
* **Auto DST Handling:** Dynamic timezone detection ensures accurate prayer times throughout 2026
* **Smart Refresh:** Automatically updates prayer times daily or when location changes

### 🔔 **Professional Notifications**
* **Native OS Notifications:** System-level notifications with custom icons and clear titles
* **Visual Badge System:** Red notification dot appears on extension icon during prayer times
* **Persistent Movement Alerts:** Movement reminders stay visible until acknowledged
* **Silent Sunrise:** Sunrise displays for reference without audio notifications

### 🎵 **Enhanced Audio System**
* **Full Adhan Playback:** Complete Adhan audio for all prayer times (no clipping)
* **Sequential Movement Audio:** Bell sound followed by voice reminder for movement breaks
* **Robust Audio Engine:** Prevents audio cutting off with proper memory management
* **Error Handling:** Graceful audio fallback with console logging

### 🎯 **User Experience**
* **12-Hour Time Format:** Clean interface showing prayer times in user-friendly format
* **Real-Time Countdown:** Live timer showing time until next prayer or sunrise
* **Manual Refresh:** Sync/Refresh button for instant location and prayer time updates
* **Developer Testing:** "Test System" button to verify audio and notification functionality

### ⚙️ **Customization**
* **Movement Reminders:** Adjustable intervals (default 30 minutes) for stretching and eye-rest
* **Location Management:** Automatic detection with manual override capability
* **Smart Storage:** Saves preferences, last updated date, and location data locally

## 🛠 Installation

### Firefox
1. Download the latest `.xpi` file from the [Releases](https://github.com/Migo090/pray-move/releases) section.
2. Open Firefox and navigate to `about:addons`.
3. Click the Gear icon (⚙️) and select **"Install Add-on From File..."**.

### Chrome
1. Download this repository as a ZIP and extract it.
2. Navigate to `chrome://extensions`.
3. Enable **"Developer mode"** in the top right.
4. Click **"Load unpacked"** and select the extracted folder.

## 🔒 Privacy & Data Handling
**Pray & Move** is built with a "Privacy First" philosophy:
* **Zero Data Collection:** No user data is tracked, collected, or sold.
* **Local Processing:** Your location is used only to fetch accurate prayer times from the Aladhan API. No unique identifiers are sent.
* **Local Storage:** All preferences, cached timings, and location data are stored strictly on your device.
* **Mozilla Compliant:** Firefox version includes `data_collection_permissions: { "required": ["none"] }` for maximum privacy.
* **Open Source:** The code is fully transparent and available for audit here on GitHub.

## 🔧 Technical Features

### Manifest V3 Compatibility
* **Chrome:** Full Manifest V3 support with offscreen document for audio playback
* **Firefox:** Manifest V3 with persistent background script for enhanced performance

### API Integration
* **Aladhan API:** Reliable prayer time calculations with multiple methods
* **Geolocation API:** Automatic location detection with timezone awareness
* **Notifications API:** Native OS notifications with custom styling

### Audio System
* **Chrome:** Offscreen document audio playback for Manifest V3 compliance
* **Firefox:** Direct audio with global reference management
* **Formats:** MP3 support for Adhan, bell, and combined stretch reminders

## 🛠 Installation

### Firefox
1. Download the latest `.xpi` file from the [Releases](https://github.com/Migo090/pray-move/releases) section.
2. Open Firefox and navigate to `about:addons`.
3. Click the Gear icon (⚙️) and select **"Install Add-on From File..."**.

### Chrome
1. Download this repository as a ZIP and extract it.
2. Navigate to `chrome://extensions`.
3. Enable **"Developer mode"** in the top right.
4. Click **"Load unpacked"** and select the extracted folder.

## 🐛 Troubleshooting

### Common Issues
* **Notifications Not Appearing:** Check browser notification permissions in settings
* **Audio Not Playing:** Ensure browser allows audio playback from extensions
* **Location Not Detected:** Verify location permissions are granted to the extension
* **Prayer Times Inaccurate:** Use the "Test System" button to verify functionality

### Debug Mode
Enable browser console (F12) to see detailed logging:
* Prayer notification triggers
* Audio playback status
* Notification creation success/failure
* Location detection results

## 🤝 Contributing
Suggestions and bug reports are welcome! Please feel free to open an issue or submit a pull request.

### Development Setup
1. Clone the repository
2. Load unpacked in Chrome/Firefox for development
3. Use "Test System" button to verify all functionality
4. Check console logs for debugging information

---
**Developed with 💙 by [Magdy Ali](https://github.com/Migo090)** 
