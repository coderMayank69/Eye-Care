// Get DOM elements
const reminderToggle = document.getElementById('reminderToggle');
const intervalSelect = document.getElementById('intervalSelect');
const statusMessage = document.getElementById('statusMessage');

// Load saved settings when popup opens
window.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage(
    { action: 'getStatus' },
    (response) => {
      if (response) {
        reminderToggle.checked = response.isActive;
        intervalSelect.value = response.reminderInterval;
        updateStatusMessage(response.isActive);
      }
    }
  );
});

// Handle toggle switch
reminderToggle.addEventListener('change', (e) => {
  const isActive = e.target.checked;
  chrome.runtime.sendMessage(
    {
      action: 'toggleReminder',
      isActive: isActive
    },
    (response) => {
      updateStatusMessage(isActive);
    }
  );
});

// Handle interval change
intervalSelect.addEventListener('change', (e) => {
  const interval = parseInt(e.target.value);
  chrome.runtime.sendMessage(
    {
      action: 'changeInterval',
      interval: interval
    },
    (response) => {
      console.log(response.status);
    }
  );
});

// Update status message
function updateStatusMessage(isActive) {
  if (isActive) {
    statusMessage.textContent = '🟢 Reminders are active';
    statusMessage.style.color = '#27ae60';
  } else {
    statusMessage.textContent = '🔴 Reminders are paused';
    statusMessage.style.color = '#e74c3c';
  }
}

console.log('Popup script loaded');
