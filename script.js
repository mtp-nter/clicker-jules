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

// Basic checksum: only a casual deterrent, trivially bypassable client-side
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

  function readLocal(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function writeLocal(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function removeLocal(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      // noop
    }
  }

  function saveCount(val) {
    const valueStr = String(val);
    const sig = calculateChecksum(val);
    if (!writeLocal('click_count', valueStr)) {
      setCookie('click_count', valueStr, 365);
    }
    if (!writeLocal('click_sig', sig)) {
      setCookie('click_sig', sig, 365);
    }
    // Keep old cookies in sync so the data migrates to localStorage on next load
    if (readLocal('click_count') !== null) {
      eraseCookie('click_count');
      eraseCookie('click_sig');
    }
  }

  // Load saved count; localStorage works even on file:// URLs where
  // document.cookie is silently ignored, so it is the primary store
  const localCount = readLocal('click_count');
  const localSig = readLocal('click_sig');
  const cookieCount = getCookie('click_count');
  const cookieSig = getCookie('click_sig');

  const savedCount = localCount !== null ? localCount : cookieCount;
  const savedSig = localSig !== null ? localSig : cookieSig;

  if (savedCount !== null) {
    const rawCount = String(savedCount).trim();
    const rawSig = savedSig === null ? null : String(savedSig).trim();

    if (/^\d+$/.test(rawCount) && rawSig === calculateChecksum(rawCount)) {
      count = parseInt(rawCount, 10);
    } else {
      console.warn('Stored score failed validation. Score has been reset.');
      count = 0;
      saveCount(0);
    }
  }

  counterEl.textContent = count;

  // One-time migration: move data found in HTTP cookies into localStorage
  if (localCount === null && cookieCount !== null) {
    saveCount(count);
  }

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

  function addCount(x, y) {
    count++;
    counterEl.textContent = count;
    saveCount(count);
    createParticle(x, y);
  }

  function cookieCenter() {
    const rect = cookieEl.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  cookieEl.addEventListener('click', (e) => {
    // Programmatic and keyboard-triggered clicks report 0,0; use the cookie center then
    const hasRealCoords = typeof e.clientX === 'number' && (e.clientX > 0 || e.clientY > 0);
    if (hasRealCoords) {
      addCount(e.clientX, e.clientY);
    } else {
      const center = cookieCenter();
      addCount(center.x, center.y);
    }
  });

  cookieEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      const center = cookieCenter();
      addCount(center.x, center.y);
    }
  });

  resetBtn.addEventListener('click', () => {
    count = 0;
    counterEl.textContent = count;
    removeLocal('click_count');
    removeLocal('click_sig');
    eraseCookie('click_count');
    eraseCookie('click_sig');
  });
});
