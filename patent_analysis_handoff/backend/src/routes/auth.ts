
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { authenticateToken } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, firstName, lastName, personaType, organization } = req.body;
    
    // Check if user exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      personaType,
      organization
    });

    await userRepository.save(user);

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        personaType: user.personaType 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        personaType: user.personaType,
        organization: user.organization
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await userRepository.save(user);

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        personaType: user.personaType 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        personaType: user.personaType,
        organization: user.organization,
        preferences: user.preferences,
        dashboardConfig: user.dashboardConfig
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userRepository.findOne({ 
      where: { id: req.user.userId },
      relations: ['projects']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      personaType: user.personaType,
      organization: user.organization,
      subscriptionTier: user.subscriptionTier,
      preferences: user.preferences,
      dashboardConfig: user.dashboardConfig,
      projectCount: user.projects?.length || 0,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, organization, preferences, dashboardConfig } = req.body;
    
    const user = await userRepository.findOne({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (organization !== undefined) user.organization = organization;
    if (preferences) user.preferences = preferences;
    if (dashboardConfig) user.dashboardConfig = dashboardConfig;

    await userRepository.save(user);

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        personaType: user.personaType,
        organization: user.organization,
        preferences: user.preferences,
        dashboardConfig: user.dashboardConfig
      }
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, (req, res) => {
  logger.info(`User logged out: ${req.user.email}`);
  res.json({ message: 'Logout successful' });
});

export default router;
