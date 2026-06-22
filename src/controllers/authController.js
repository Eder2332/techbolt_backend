const bcrypt = require('bcrypt');
const { getUserByEmail, createUser } = require('../models/userModel');
const { getCurrentUser } = require('../middlewares/authMiddleware');
const { generateToken } = require('../utils/jwt');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    const errors = validateRegisterInput({ fullName, email, password, confirmPassword });
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ message: 'Ya existe una cuenta registrada con ese correo.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'profesor'
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=7200`);
    return res.status(201).json({
      message: 'Registro exitoso.',
      redirectTo: '/'
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    return res.status(500).json({ message: 'No se pudo registrar el usuario en la base de datos.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const errors = validateLoginInput({ email, password });
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=7200`);
    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      redirectTo: '/'
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return res.status(500).json({ message: 'No se pudo validar el usuario en la base de datos.' });
  }
}

function logout(req, res) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
  return res.status(200).json({
    message: 'Sesión cerrada correctamente.',
    redirectTo: '/'
  });
}

async function me(req, res) {
  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({
      authenticated: false,
      message: 'No hay una sesión activa.'
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
}

module.exports = {
  register,
  login,
  logout,
  me
};
