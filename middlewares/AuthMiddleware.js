import jwt from 'jsonwebtoken';

const publicPaths = ['/api/posts',
  '/api/connect-wallet', 
  '/api/login',
  '/api/users/search',
  '/api-docs'];

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const isPublicPath = publicPaths.includes(req.path);

  if (!token) {
    if (!isPublicPath) {
      return res.status(401).json({ message: 'No token provided' });
    }
    // If this is a public path, continue without authentication
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (!isPublicPath) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      // If the token is invalid but it's a public path, continue without user information
      return next();
    }

    // If the token is valid, attach user information to the request and continue
    req.user = decoded;
    next();
  });
};

export default authMiddleware;