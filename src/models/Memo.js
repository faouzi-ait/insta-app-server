const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;
