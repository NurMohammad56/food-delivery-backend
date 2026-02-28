import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
  const expiresIn = process.env.JWT_EXPIRE || '24h';

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};