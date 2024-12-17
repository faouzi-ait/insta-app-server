const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contacts: { type: Array, required: false },
  images: { type: Array, required: false },
  photo:    { type: String, required: false },
  publicId: { type: String, required: false },
  tokens:   { type: Array, required: false },
  favorite: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserPost'
  }],
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserPost'
  }]
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
