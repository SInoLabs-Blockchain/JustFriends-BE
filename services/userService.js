const User = require('../models/user');

exports.createUser = async (name, email) => {
  return User.create({ name, email });
};
