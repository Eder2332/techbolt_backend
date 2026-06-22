const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'profesor'
    }
  },
  {
    tableName: 'users',
    timestamps: true
  }
);

async function syncUserModel() {
  await User.sync();
}

async function getUserByEmail(email) {
  return User.findOne({
    where: {
      email: email.toLowerCase()
    }
  });
}

async function getUserById(id) {
  return User.findByPk(id);
}

async function createUser(userData) {
  return User.create({
    fullName: userData.fullName,
    email: userData.email.toLowerCase(),
    password: userData.password,
    role: userData.role || 'profesor'
  });
}

module.exports = {
  User,
  syncUserModel,
  getUserByEmail,
  getUserById,
  createUser
};
