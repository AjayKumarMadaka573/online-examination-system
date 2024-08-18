const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentDetails = require('../models/StudentDetails');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user
    user = new User({ username, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password,type } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user data
router.get('/me', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
});

async function findTeachersBySubject(subject) {
  try {
    const teachers = await User.find({
      type: 'teacher',
      'data.subjects-dealt': { $in: [subject] }
    });
    return teachers;
  } catch (error) {
    console.error('Error finding teachers:', error);
    throw error; // Re-throw the error for proper handling
  }
}

// Create users (for temporaray use only)

router.post('/create', async (req, res) => {
  try {
    const { username, password, type,data } = req.body;

    const newUser = new User({
      username,
      password,
      type,
      data
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.get('/getFacultyDealingASubject/:id',async (req,res)=>{
 const data =  await findTeachersBySubject(req.params.id);
  res.send(data);
});

router.post('/addStudentDetails',async (req,res)=>{

  try{
  const {studentId ,studentName,year} = req.body;

  const newDetails = new StudentDetails({studentId ,studentName,year});

  const savedDetails = await newDetails.save();
  res.status(201).json(savedDetails);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error saving details' });
}
});

router.get('/getStudentDetails/:id',async (req,res)=>{
  const data =  await StudentDetails.findOne({studentId:req.params.id});
  res.send(data);
});

module.exports = router;
