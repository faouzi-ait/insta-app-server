const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  photo:    { type: String, required: false },
  publicId: { type: String, required: false },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
