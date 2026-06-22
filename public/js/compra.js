document.addEventListener('DOMContentLoaded', async () => {
  await window.TecboltApp.layoutReady;
  const userMount = document.getElementById('headerUserMount');

  try {
    const user = await window.TecboltApp.getCurrentUser();

    if (user) {
      window.TecboltApp.syncHeaderForUser(user);
      window.TecboltApp.renderUserBox(user, userMount);
    } else {
      window.TecboltApp.syncHeaderForUser(null);
    }
  } catch (error) {
    console.error('No se pudo cargar la sesión actual:', error.message);
  }
});
