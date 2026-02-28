import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
      return;
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
        return;
      }

      req.user = user;
      req.userId = user._id.toString();

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
      return;
    }

    next();
  };
};