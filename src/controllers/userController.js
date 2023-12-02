const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinarySDK = require('cloudinary');

const User = require('../models/user');
const cloudinary = require('../configuration/cloudinary');

exports.registerUser = async (req, res) => {
  try {
    const user = { ...req.body };
    const existingUser = await User.findOne({ username: req.body.username });
    
    if (existingUser) {
      return res.status(400).send({ error: 'Username already exists. Please choose a different username.' });
    }

    if (req.file) {
      const uploaded = await cloudinary.uploads(
        req.file.path,
        'single-upload'
        );
      user.photo = uploaded.url;
      user.publicId = uploaded.id;
      fs.unlinkSync(req.file.path);
    }    

    const newUser = new User(user);
    await newUser.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // Find the user by username
      const user = await User.findOne({ username });

      // If the user doesn't exist, return an error
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Compare the entered password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      // If the passwords don't match, return an error
      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate JWT tokens
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '365d' });
      
      // Save the token to the user's tokens array (for future validation or logout)
      user.tokens = user.tokens.concat({ token, refreshToken, issueDate: new Date() });
      await user.save();
  
      // Return the user and token
      res.status(200).json({ user, token, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.refreshToken = (async (req, res, next) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: 'Refresh Token is missing' });

  const decodedToken = jwt.decode(token);
  const user = await User.findOne({ _id: decodedToken._id });

  if (!user) if (!token) return res.status(403).json({ error: 'Refresh Token is missing' });

  const newToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '5s' });
  const refreshToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '10s' });

  return res.status(200).json({
      success: true,
      message: 'Here is your new token',
      userData: user,
      token: newToken,
      refreshToken
  });
});

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.user._id });

    if(user && user.publicId) {
      // await cloudinarySDK.v2.api.delete_resources([['image1', 'image2']], 
      //   (error, result) => console.log('Deletion in progress => ')
      // );

      await cloudinarySDK.uploader.destroy(user.publicId, 
        (error, result) => console.log('Deletion in progress => ')
      );
    }

    if (!user) return res.status(404).send()
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ _id: username });

    user.password = password
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
