async function parseJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return {};
  }
}

async function apiRequest(url, options = {}) {
  const config = {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);
  const data = await parseJson(response);

  if (!response.ok) {
    const error = new Error(data.message || 'Ocurrió un error en la solicitud.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const allowedEmailPattern = /^[A-Za-z0-9._%+-]+@(gmail\.com|tecsup\.edu\.pe|hotmail\.com|outlook\.com|yahoo\.com)$/i;
const lettersAndSpacesPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const messagePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,;:()\-]+$/;

function normalizeWhitespace(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function sanitizeLettersOnly(value = '') {
  return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '').replace(/\s{2,}/g, ' ');
}

function sanitizeDigitsOnly(value = '') {
  return value.replace(/\D/g, '');
}

function sanitizeMessageText(value = '') {
  return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,;:()\-]/g, '').replace(/[ \t]{2,}/g, ' ');
}

function isAllowedEmail(value = '') {
  return allowedEmailPattern.test(value.trim());
}

async function getCurrentUser() {
  try {
    const data = await apiRequest('/auth/me');
    return data.user;
  } catch (error) {
    if (error.status === 401) {
      return null;
    }

    throw error;
  }
}

function fetchText(url) {
  return fetch(url, { credentials: 'same-origin' }).then((res) => {
    if (!res.ok) {
      throw new Error(`No se pudo cargar ${url}`);
    }
    return res.text();
  });
}

let layoutReadyResolve;
const layoutReady = new Promise((resolve) => {
  layoutReadyResolve = resolve;
});

function setMessage(element, message, visible = true) {
  if (!element) {
    return;
  }

  element.textContent = message || '';
  element.classList.toggle('hidden', !visible || !message);
}

function renderUserBox(user, mountElement) {
  if (!user || !mountElement) {
    return;
  }

  mountElement.innerHTML = `
    <div class="header-user-box">
      <div class="header-user-top">
        <span class="header-user-label">Usuario activo</span>
      </div>
      <div class="header-user-content">
        <span class="header-user-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="header-user-icon-svg">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"></path>
          </svg>
        </span>
        <div class="header-user-meta">
          <strong class="header-user-name">${user.fullName}</strong>
        </div>
      </div>
    </div>
  `;
}

function syncActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('[data-view]');

  navLinks.forEach((link) => {
    const viewName = link.getAttribute('data-view');
    const isActive =
      (viewName === 'home' && currentPath === '/') ||
      (viewName === 'dashboard' && currentPath === '/dashboard') ||
      (viewName === 'purchase' && currentPath === '/compra');

    link.classList.toggle('nav-link-active', isActive);
  });
}

async function initLayout() {
  const headerMount = document.getElementById('siteHeader');
  const footerMount = document.getElementById('siteFooter');

  if (!headerMount && !footerMount) {
    layoutReadyResolve();
    return;
  }

  if (headerMount) {
    headerMount.innerHTML = await fetchText('/partials/header.html');
  }

  if (footerMount) {
    footerMount.innerHTML = await fetchText('/partials/footer.html');
  }

  syncActiveNavigation();
  layoutReadyResolve();
}

function syncHeaderForUser(user) {
  const loginLink = document.querySelector('[data-nav="login"]');
  const registerLink = document.querySelector('[data-nav="register"]');
  const dashboardLink = document.querySelector('[data-nav="dashboard"]');
  const logoutButton = document.querySelector('[data-nav="logout"]');

  if (user) {
    if (loginLink) {
      loginLink.style.display = 'none';
    }

    if (registerLink) {
      registerLink.style.display = 'none';
    }

    if (dashboardLink) {
      dashboardLink.textContent = 'Dashboard';
    }

    if (logoutButton) {
      logoutButton.classList.remove('hidden');
    }

    return;
  }

  if (loginLink) {
    loginLink.style.display = '';
  }

  if (registerLink) {
    registerLink.style.display = '';
  }

  if (logoutButton) {
    logoutButton.classList.add('hidden');
  }
}

async function logout() {
  const data = await apiRequest('/auth/logout', {
    method: 'POST'
  });

  window.location.href = data.redirectTo || '/';
}

document.addEventListener('click', async (event) => {
  const logoutTrigger = event.target.closest('[data-logout]');

  if (!logoutTrigger) {
    return;
  }

  event.preventDefault();

  try {
    await logout();
  } catch (error) {
    alert(error.message || 'No se pudo cerrar la sesión.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initLayout().catch((error) => {
    console.error(error.message);
    layoutReadyResolve();
  });
});

window.TecboltApp = {
  apiRequest,
  allowedEmailPattern,
  lettersAndSpacesPattern,
  messagePattern,
  getCurrentUser,
  isAllowedEmail,
  layoutReady,
  normalizeWhitespace,
  sanitizeDigitsOnly,
  sanitizeLettersOnly,
  sanitizeMessageText,
  setMessage,
  renderUserBox,
  syncActiveNavigation,
  initLayout,
  syncHeaderForUser,
  logout
};
