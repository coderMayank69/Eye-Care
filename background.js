// 20-20-20 Eye Care Extension Background Service Worker
// Reminder: Every 20 minutes, look at something 20 feet away for 20 seconds

const REMINDER_INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds
const ALARM_NAME = 'eye-care-reminder';
const NOTIFICATION_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Z6b8AAAAASUVORK5CYII=';

// Initialize the extension when it's installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Eye Care 20-20-20 extension installed');
  // Set initial reminder
  createReminder();
  // Store initial state
  chrome.storage.local.set({
    isActive: true,
    reminderInterval: 20
  });
});

// Create a reminder alarm
function createReminder() {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 20,
    periodInMinutes: 20
  });
}

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    // Check if feature is active before showing notification
    chrome.storage.local.get(['isActive'], (result) => {
      if (result.isActive !== false) {
        showNotification();
      }
    });
  }
});

// Show the notification
function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: NOTIFICATION_ICON,
    title: '👀 Eye Care Reminder - 20-20-20 Rule',
    message: 'Look at something 20 feet away for 20 seconds to reduce eye strain and protect your eyes!',
    priority: 1,
    requireInteraction: true
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleReminder') {
    const isActive = request.isActive;
    chrome.storage.local.set({ isActive });
    
    if (isActive) {
      createReminder();
      sendResponse({ status: 'Reminders enabled' });
    } else {
      chrome.alarms.clear(ALARM_NAME);
      sendResponse({ status: 'Reminders disabled' });
    }
  }
  
  if (request.action === 'changeInterval') {
    const interval = request.interval;
    chrome.storage.local.set({ reminderInterval: interval });
    
    // Clear old alarm and create new one with different interval
    chrome.alarms.clear(ALARM_NAME);
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: interval,
      periodInMinutes: interval
    });
    
    sendResponse({ status: `Interval changed to ${interval} minutes` });
  }
  
  if (request.action === 'getStatus') {
    chrome.storage.local.get(['isActive', 'reminderInterval'], (result) => {
      sendResponse({
        isActive: result.isActive !== false,
        reminderInterval: result.reminderInterval || 20
      });
    });
    // Return true to indicate we will send response asynchronously
    return true;
  }
});

// Listen for notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
});

console.log('Eye Care 20-20-20 background service worker loaded');
