const jwt = require('jsonwebtoken');

const publicPaths = ['/posts/free', '/connect-wallet', '/login'];

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const isPublicPath = publicPaths.includes(req.path);

  if (!token) {
    if (!isPublicPath) {
      return res.status(401).json({ message: 'No token provided' });
    }
    // Nếu đây là public path, tiếp tục mà không cần xác thực
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (!isPublicPath) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      // Nếu token không hợp lệ nhưng là public path, tiếp tục mà không cần thông tin người dùng
      return next();
    }

    // Nếu token hợp lệ, đính kèm thông tin người dùng vào request và tiếp tục
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
