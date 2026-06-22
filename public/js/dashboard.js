document.addEventListener('DOMContentLoaded', async () => {
  await window.TecboltApp.layoutReady;
  const userMount = document.getElementById('headerUserMount');
  const welcome = document.getElementById('dashboardWelcome');
  const userName = document.getElementById('dashboardUserName');
  const userEmail = document.getElementById('dashboardUserEmail');
  const userRole = document.getElementById('dashboardUserRole');

  try {
    const user = await window.TecboltApp.getCurrentUser();

    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    window.TecboltApp.syncHeaderForUser(user);
    window.TecboltApp.renderUserBox(user, userMount);
    welcome.textContent = `Bienvenido, ${user.fullName}. Este es tu panel principal dentro de Tecbolt.`;
    userName.textContent = user.fullName;
    userEmail.textContent = user.email;
    userRole.textContent = user.role;
  } catch (error) {
    console.error('No se pudo cargar el dashboard:', error.message);
    window.location.href = '/auth/login';
  }
});
