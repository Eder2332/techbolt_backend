const allowedEmailPattern = /^[A-Za-z0-9._%+-]+@(gmail\.com|tecsup\.edu\.pe|hotmail\.com|outlook\.com|yahoo\.com)$/i;
const lettersAndSpacesPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

function validateRegisterInput({ fullName, email, password, confirmPassword }) {
  const errors = [];
  const normalizedFullName = typeof fullName === 'string' ? fullName.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedFullName || normalizedFullName.length < 3) {
    errors.push('El nombre completo debe tener al menos 3 caracteres.');
  } else if (!lettersAndSpacesPattern.test(normalizedFullName)) {
    errors.push('El nombre completo solo debe contener letras y espacios.');
  }

  if (!normalizedEmail) {
    errors.push('Ingresa un correo válido.');
  } else if (!allowedEmailPattern.test(normalizedEmail)) {
    errors.push('Solo se aceptan correos gmail.com, tecsup.edu.pe, hotmail.com, outlook.com o yahoo.com.');
  }

  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres.');
  }

  if (password !== confirmPassword) {
    errors.push('Las contraseñas no coinciden.');
  }

  return errors;
}

function validateLoginInput({ email, password }) {
  const errors = [];
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail) {
    errors.push('Ingresa un correo válido.');
  } else if (!allowedEmailPattern.test(normalizedEmail)) {
    errors.push('Solo se aceptan correos gmail.com, tecsup.edu.pe, hotmail.com, outlook.com o yahoo.com.');
  }

  if (!password) {
    errors.push('La contraseña es obligatoria.');
  } else if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres.');
  }

  return errors;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
