import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { generateResetToken, hashResetToken, getResetTokenExpiry } from '../utils/resetToken.js';
import { sendPasswordResetEmail } from '../utils/email.js';

export const register = async (req, res) => {
  try {
    const { name, email, studentId, phone, password } = req.body;

    if (!name || !email || !studentId || !phone || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Student ID';
      res.status(400).json({
        success: false,
        message: `${field} already registered`
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      studentId,
      phone,
      password,
      role: 'student'
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error?.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
      return;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error?.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
      return;
    }

    const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
      return;
    }

    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = getResetTokenExpiry();
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      error: error?.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Please provide new password'
      });
      return;
    }

    const hashedToken = hashResetToken(resetToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: error?.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error?.message
    });
  }
};