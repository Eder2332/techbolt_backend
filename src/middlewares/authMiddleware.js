const { verifyToken } = require('../utils/jwt');
const { getUserById } = require('../models/userModel');

function getTokenFromCookies(cookieHeader = '') {
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const authCookie = cookies.find((cookie) => cookie.startsWith('token='));

  if (!authCookie) {
    return null;
  }

  return authCookie.replace('token=', '');
}

async function getCurrentUser(req) {
  try {
    const token = getTokenFromCookies(req.headers.cookie);

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return await getUserById(decoded.id);
  } catch (error) {
    return null;
  }
}

async function requireAuth(req, res, next) {
  const user = await getCurrentUser(req);

  if (!user) {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
    return res.redirect('/auth/login');
  }

  req.user = user;
  next();
}

module.exports = {
  getCurrentUser,
  getTokenFromCookies,
  requireAuth
};
