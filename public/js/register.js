document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('registerForm');
  const message = document.getElementById('authMessage');

  try {
    const currentUser = await window.TecboltApp.getCurrentUser();

    if (currentUser) {
      window.location.href = '/';
      return;
    }
  } catch (error) {
    console.error(error.message);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    window.TecboltApp.setMessage(message, '');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await window.TecboltApp.apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      window.location.href = data.redirectTo || '/';
    } catch (error) {
      window.TecboltApp.setMessage(message, error.message);
    }
  });
});
