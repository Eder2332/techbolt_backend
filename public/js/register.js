document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('registerForm');
  const message = document.getElementById('authMessage');
  const fullNameField = document.getElementById('fullName');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('confirmPassword');
  const submitButton = document.getElementById('registerSubmitButton');

  const validateRegisterField = (field) => {
    if (!field) {
      return true;
    }

    let errorMessage = '';

    if (field.id === 'fullName') {
      field.value = window.TecboltApp.sanitizeLettersOnly(field.value);

      if (!field.value.trim()) {
        errorMessage = 'Ingresa tu nombre completo.';
      } else if (
        field.value.trim().length < 3 ||
        !window.TecboltApp.lettersAndSpacesPattern.test(field.value.trim())
      ) {
        errorMessage = 'El nombre completo solo debe contener letras y espacios.';
      }
    }

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
        errorMessage = 'Ingresa una contraseña.';
      } else if (field.value.length < 6) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      }
    }

    if (field.id === 'confirmPassword') {
      if (!field.value) {
        errorMessage = 'Confirma tu contraseña.';
      } else if (field.value !== passwordField?.value) {
        errorMessage = 'Las contraseñas no coinciden.';
      }
    }

    field.setCustomValidity(errorMessage);
    return !errorMessage;
  };

  const syncSubmitState = () => {
    if (!submitButton) {
      return;
    }

    const formIsValid = [fullNameField, emailField, passwordField, confirmPasswordField].every((field) =>
      validateRegisterField(field)
    );

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

  [fullNameField, emailField, passwordField, confirmPasswordField].forEach((field) => {
    field?.addEventListener('input', () => {
      validateRegisterField(field);

      if (field.id === 'password' && confirmPasswordField) {
        validateRegisterField(confirmPasswordField);
      }

      window.TecboltApp.setMessage(message, '', false);
      syncSubmitState();
    });

    field?.addEventListener('blur', () => {
      validateRegisterField(field);
      syncSubmitState();
    });
  });

  syncSubmitState();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    window.TecboltApp.setMessage(message, '');

    const invalidField = [fullNameField, emailField, passwordField, confirmPasswordField].find(
      (field) => !validateRegisterField(field)
    );

    if (invalidField) {
      window.TecboltApp.setMessage(message, 'Completa correctamente el formulario para crear tu cuenta.');
      syncSubmitState();
      invalidField.reportValidity();
      invalidField.focus();
      return;
    }

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
