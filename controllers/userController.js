const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userService.createUser(name, email);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo người dùng' });
  }
};
