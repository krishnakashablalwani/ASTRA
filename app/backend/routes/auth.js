import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current user (protected)
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;
    
    // Capitalize name (each word)
    const capitalizedName = name
      ? name.trim().split(/\s+/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      : '';
    
    // Basic password policy: 8-64 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const isStrongPassword = (pwd, emailLike) => {
      if (typeof pwd !== 'string') return false;
      if (pwd.length < 8 || pwd.length > 64) return false;
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasDigit = /[0-9]/.test(pwd);
      const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
      // avoid using email local part directly in password
      const local = (emailLike || '').split('@')[0] || '';
      const containsEmailLocal = local.length >= 3 && pwd.toLowerCase().includes(local.toLowerCase());
      return hasUpper && hasLower && hasDigit && hasSpecial && !containsEmailLocal;
    };
    if (!isStrongPassword(password, email)) {
      return res.status(400).json({ 
        message: 'Password must be 8-64 characters and include uppercase, lowercase, a number, and a special character. It should not contain your email name.' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Base user object
    const userData = { 
      name: capitalizedName, 
      email, 
      password: hashedPassword, 
      role, 
      department,
      phone
    };
    
    // Add role-specific fields
    if (role === 'student') {
      const { rollNo, semester, year, tags, clubs } = req.body;
      
      // Validate required student fields
      if (!rollNo) return res.status(400).json({ message: 'Roll number is required for students' });
      
      // Check if roll number already exists
      const existingRollNo = await User.findOne({ rollNo });
      if (existingRollNo) return res.status(400).json({ message: 'Roll number already exists' });
      
      userData.rollNo = rollNo;
      userData.semester = semester || 1;
      userData.year = year || 1;
      userData.tags = tags || [];
      userData.clubs = clubs || [];
      userData.proficiencies = [];
    } 
    else if (role === 'teacher') {
      const { teacherId, subjectsTaught, designation } = req.body;
      
      // Validate required teacher fields
      if (!teacherId) return res.status(400).json({ message: 'Teacher ID is required for teachers' });
      
      // Check if teacher ID already exists
      const existingTeacherId = await User.findOne({ teacherId });
      if (existingTeacherId) return res.status(400).json({ message: 'Teacher ID already exists' });
      
      userData.teacherId = teacherId;
      userData.subjectsTaught = subjectsTaught || [];
      userData.designation = designation || 'Assistant Professor';
    } 
    else if (role === 'staff') {
      const { staffId, staffType } = req.body;
      
      // Validate required staff fields
      if (!staffId) return res.status(400).json({ message: 'Staff ID is required for staff members' });
      
      // Check if staff ID already exists
      const existingStaffId = await User.findOne({ staffId });
      if (existingStaffId) return res.status(400).json({ message: 'Staff ID already exists' });
      
      userData.staffId = staffId;
      userData.staffType = staffType || 'general';
    }
    
    const user = new User(userData);
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update tags and clubs for a user
router.put('/me', authenticate, async (req, res) => {
  try {
    const { tags, clubs } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { tags, clubs } }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
