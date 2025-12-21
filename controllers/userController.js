const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    if(!email || !password) {
      return res.status(400).json({ success: false, msg: 'Email and password are required' });
    }
    const userExist = await User.findOne({ email });
    if(userExist) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email, 
      password: hashedPassword,
    })
    await newUser.save();

    if(newUser) {
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        token: generateToken(newUser._id),
      })
    } else {
      res.status(400).json({ success: false, msg: 'Invalid admin data' });
    }
  }
  catch (error) {
    console.error('Error while registering user', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({ success: false, msg: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if(user &&(await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ success: false, msg: 'Invalid email or password' });
    }
  }
  catch (error) {
    console.error('Error while logging in user', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    if(!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authorized' }); 
    }

    const user = await User.findById(req.user._id).select('-password');
    if(!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: user,
    })
  }
  catch (error) {
    console.error('Error while getting user info', error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};