// Helper functions to get and set browser cookies
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

document.addEventListener('DOMContentLoaded', () => {
  let count = 0;

  const counterEl = document.getElementById('counter');
  const cookieEl = document.getElementById('cookie');
  const resetBtn = document.getElementById('reset-btn');

  // Load saved count from document.cookie
  const savedCount = getCookie('click_count');
  if (savedCount !== null) {
    count = parseInt(savedCount, 10) || 0;
    counterEl.textContent = count;
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

  cookieEl.addEventListener('click', (e) => {
    count++;
    counterEl.textContent = count;
    setCookie('click_count', count, 365);

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
  });
});
