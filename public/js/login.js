document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('authMessage');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const submitButton = document.getElementById('loginSubmitButton');

  const validateLoginField = (field) => {
    if (!field) {
      return true;
    }

    let errorMessage = '';

    if (field.id === 'email') {
      field.value = field.value.trim().toLowerCase();

      if (!field.value) {
        errorMessage = 'Ingresa tu correo electrónico.';
      } else if (!window.TecboltApp.isAllowedEmail(field.value)) {
        errorMessage = 'Solo se aceptan correos gmail.com, tecsup.edu.pe, hotmail.com, outlook.com o yahoo.com.';
      }
    }

    if (field.id === 'password') {
      if (!field.value) {
        errorMessage = 'Ingresa tu contraseña.';
      } else if (field.value.length < 6) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      }
    }

    field.setCustomValidity(errorMessage);
    return !errorMessage;
  };

  const syncSubmitState = () => {
    if (!submitButton) {
      return;
    }

    const formIsValid = [emailField, passwordField].every((field) => validateLoginField(field));
    submitButton.disabled = !formIsValid;
    submitButton.setAttribute('aria-disabled', String(!formIsValid));
  };

  try {
    const currentUser = await window.TecboltApp.getCurrentUser();

    if (currentUser) {
      window.location.href = '/';
      return;
    }
  } catch (error) {
    console.error(error.message);
  }

  [emailField, passwordField].forEach((field) => {
    field?.addEventListener('input', () => {
      validateLoginField(field);
      window.TecboltApp.setMessage(message, '', false);
      syncSubmitState();
    });

    field?.addEventListener('blur', () => {
      validateLoginField(field);
      syncSubmitState();
    });
  });

  syncSubmitState();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    window.TecboltApp.setMessage(message, '');

    const invalidField = [emailField, passwordField].find((field) => !validateLoginField(field));

    if (invalidField) {
      window.TecboltApp.setMessage(message, 'Completa correctamente el formulario para iniciar sesión.');
      syncSubmitState();
      invalidField.reportValidity();
      invalidField.focus();
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await window.TecboltApp.apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      window.location.href = data.redirectTo || '/';
    } catch (error) {
      window.TecboltApp.setMessage(message, error.message);
    }
  });
});
