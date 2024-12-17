const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinarySDK = require('cloudinary');

const User = require('../models/User');
const Contact = require('../models/Contact');

const cloudinary = require('../configuration/cloudinary');

exports.userFavoritePost = async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;
  
  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(500).json({ success: false, message: 'User not found' });
      }

      const isFavorite = user.favorite.includes(postId);

      if (isFavorite) {
          user.favorite = user.favorite.filter((id) => id.toString() !== postId.toString());
      } else {
          user.favorite.push(postId);
      }

      await user.save();

      return res.status(200).json({ success: true, favorited: !isFavorite, message: 'Favorite status toggled successfully' })
  } 
  catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

exports.getUserFavorites = async (req, res, next) => {
  const userId = req.user._id;
  
  try {
      const user = await User.findById(userId);

      if (!user) return res.status(500).json({ success: false, message: 'User not found' })

      return res.status(200).json({ success: true, favorite: user.favorite })
  } 
  catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

exports.getUserPicture = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(400).json({ success: false, message: 'The user was not found' });
    
    return res.status(200).json({ photo: user.photo });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error has occured', error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(400).json({ success: false, message: 'The user was not found' });
    
    return res.status(200).json({ 
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error has occured', error });
  }
};

exports.updateUserDetails = async (req, res) => {
  const { firstname, lastname, phone } = req.body;
  
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { firstname, lastname, phone } }, { validateBeforeSave: false });
    
    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.albumUpload = async (req, res) => {
  
  try {
    const user = await User.findOne({ _id: req.user._id });
    const urls = [];

    for (const file of req.files) {
      console.log(file);
      const newPath = await cloudinary.uploads(file.path, 'user-album');
      urls.push(newPath);
      fs.unlinkSync(file.path);
    };

    user.images = user.images.concat(urls);
    await user.save();

    return res.status(200).json({ success: true, message: 'images uploaded successfully', data: urls});
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.registerUser = async (req, res) => {
  try {
    console.log('LOGIN: ', req.body.username);

    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ error: 'Username and password are required' });
    }

    const user = { ...req.body };
    const existingUser = await User.findOne({ username: req.body.username });
    
    if (existingUser) {
      return res.status(400).send({ error: 'Username already exists' });
    }

    // FILE UPLOAD FROM WEB
    if (req.file) {
        const uploaded = await cloudinary.uploads(req.file.path, 'single-upload');
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

exports.updateUserPhoto = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(400).send({ error: 'The user could not be found' });

    if (user.photo) {
      await cloudinarySDK.uploader.destroy(user.publicId, 
        (error, result) => console.log('Deleting current photo: ', user.photo)
      );
    }

    const { url, id } = await cloudinary.uploads(req.file.path, 'single-upload');
    user.photo = url;
    user.publicId = id;
    fs.unlinkSync(req.file.path);

    await user.save({ validateBeforeSave: false });

    return res.status(201).json({ success: true, url, id });
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.createContact = async (req, res) => {
  try {
    const contact = { ...req.body };
    
    if (req.file) {
      const uploaded = await cloudinary.uploads(req.file.path, 'single-upload');
      contact.photo = uploaded.url;
      contact.publicId = uploaded.id;
      fs.unlinkSync(req.file.path);
    }
    
    const newContact = new Contact(contact);
    await User.findByIdAndUpdate(req.user._id, { $push: { contacts: newContact._id } });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Contact created successfully', newContact });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUserContacts = async (req, res) => {
  try {
    const userContacts = await User.findOne({ _id: req.user._id });
    const contactList = userContacts.contacts;

    res.status(200).send(contactList);
  } catch (error) {
    res.status(500).send(error);
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
      const token = jwt.sign({ _id: user._id, username }, process.env.SECRET_KEY, { expiresIn: '10s' });
      const refreshToken = jwt.sign({ _id: user._id, username }, process.env.SECRET_KEY, { expiresIn: '365d' });
      
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
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ error: 'Refresh Token is missing' });

  const decodedToken = jwt.decode(refreshToken);
  const user = await User.findOne({ _id: decodedToken._id });

  if (!user) if (!refreshToken) return res.status(403).json({ error: 'Refresh Token is missing' });

  const newToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '30s' });
  const newRefreshToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '90d' });

  return res.status(200).json({
      success: true,
      message: 'Here is your new token',
      token: newToken,
      newRefreshToken,
      user,
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
