import crypto from 'crypto';

export const generateResetToken = (): string => {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  return resetToken;
};

export const hashResetToken = (token: string): string => {
  // Hash token for database storage
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

export const getResetTokenExpiry = (): Date => {
  // Token valid for 1 hour
  return new Date(Date.now() + 60 * 60 * 1000);
};
