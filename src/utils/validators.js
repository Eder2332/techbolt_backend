function validateRegisterInput({ fullName, email, password, confirmPassword }) {
  const errors = [];

  if (!fullName || fullName.trim().length < 3) {
    errors.push('El nombre completo debe tener al menos 3 caracteres.');
  }

  if (!email || !email.includes('@')) {
    errors.push('Ingresa un correo válido.');
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

  if (!email || !email.includes('@')) {
    errors.push('Ingresa un correo válido.');
  }

  if (!password) {
    errors.push('La contraseña es obligatoria.');
  }

  return errors;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
