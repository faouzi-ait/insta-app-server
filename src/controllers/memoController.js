const Memo = require('../models/Memo');

exports.getAllMemos = async (req, res) => {
  try {
    const memos = await Memo.find();
    res.status(200).send(memos);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUserMemos = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in the request after JWT authentication
    const userMemos = await Memo.find({ userId });
    res.status(200).send(userMemos);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createMemo = async (req, res) => {
  try {
    const memo = new Memo({ ...req.body });
    await memo.save();
    res.status(201).send(memo);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.securedCreateMemo = async (req, res) => {
  try {
    const userId = req.user._id;
    const memo = new Memo({ userId, ...req.body });
    
    await memo.save();
    res.status(201).send(memo);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateMemo = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in the request after JWT authentication
    const memo = await Memo.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
    if (!memo) {
      return res.status(404).send();
    }
    res.status(200).send(memo);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteMemo = async (req, res) => {
  try {
    const memo = await Memo.findOneAndDelete({ _id: req.params.id, });
    
    if (!memo) return res.status(404).send();
    
    res.status(200).send(memo);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.securedDeleteMemo = async (req, res) => {
  try {
    const userId = req.user._id;
    const memo = await Memo.findOneAndDelete({ _id: req.params.id, userId });

    if (!memo) return res.status(404).send();
    
    res.status(200).send(memo);
  } catch (error) {
    res.status(500).send(error);
  }
};