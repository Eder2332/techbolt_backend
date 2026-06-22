const path = require('path');

const viewsPath = path.join(__dirname, '..', 'views');

function sendView(res, fileName) {
  return res.sendFile(path.join(viewsPath, fileName));
}

function homePage(req, res) {
  return sendView(res, 'index.html');
}

function showLoginPage(req, res) {
  return sendView(res, 'login.html');
}

function showRegisterPage(req, res) {
  return sendView(res, 'register.html');
}

function dashboardPage(req, res) {
  return sendView(res, 'dashboard.html');
}

function purchasePage(req, res) {
  return sendView(res, 'compra.html');
}

module.exports = {
  homePage,
  showLoginPage,
  showRegisterPage,
  dashboardPage,
  purchasePage
};
