// Helper functions to get, set, and erase browser cookies
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Simple checksum to detect manual tampering of cookie value
function calculateChecksum(val) {
  const num = parseInt(val, 10) || 0;
  return ((num * 9301 + 49297) % 233280).toString(16);
}

// Prevent context menu (right click)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Prevent Developer Tools keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const key = e.key ? e.key.toUpperCase() : '';

  // F12 key
  if (key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, or Ctrl+U
  if (e.ctrlKey) {
    if ((e.shiftKey && (key === 'I' || key === 'J' || key === 'C')) || key === 'U') {
      e.preventDefault();
      return false;
    }
  }

  // Mac: Cmd+Option+I, Cmd+Option+J, Cmd+Option+C, Cmd+Option+U
  if (e.metaKey && e.altKey) {
    if (key === 'I' || key === 'J' || key === 'C' || key === 'U') {
      e.preventDefault();
      return false;
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  let count = 0;

  const counterEl = document.getElementById('counter');
  const cookieEl = document.getElementById('cookie');
  const resetBtn = document.getElementById('reset-btn');

  function saveCount(val) {
    setCookie('click_count', val, 365);
    setCookie('click_sig', calculateChecksum(val), 365);
  }

  // Load saved count from document.cookie with checksum verification
  const savedCount = getCookie('click_count');
  const savedSig = getCookie('click_sig');

  if (savedCount !== null) {
    const parsedCount = parseInt(savedCount, 10) || 0;
    const expectedSig = calculateChecksum(parsedCount);

    if (savedSig === expectedSig) {
      count = parsedCount;
    } else {
      console.warn("Cookie tampering detected! Score has been reset.");
      count = 0;
      saveCount(0);
    }
  }

  counterEl.textContent = count;

  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'click-particle';
    particle.textContent = '+1';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    document.body.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }

  cookieEl.addEventListener('click', (e) => {
    count++;
    counterEl.textContent = count;
    saveCount(count);

    // Create floating +1 effect
    const rect = cookieEl.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    createParticle(x, y);
  });

  resetBtn.addEventListener('click', () => {
    count = 0;
    counterEl.textContent = count;
    eraseCookie('click_count');
    eraseCookie('click_sig');
  });
});
