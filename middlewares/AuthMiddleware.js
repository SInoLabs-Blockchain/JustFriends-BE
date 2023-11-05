const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Bỏ qua xác thực cho các route 'connect-wallet' và 'login'
  if (req.path === '/connect-wallet' || req.path === '/login') {
    return next();
  }

  // Lấy token từ header
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  // Xác minh token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin user vào request để sử dụng ở các route sau
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
