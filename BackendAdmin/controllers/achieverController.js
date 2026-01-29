const Achiever = require("../models/Achiever");


exports.createAchiever = async (req, res) => {
  try {
    const achiever = new Achiever(req.body);
    await achiever.save();
    res.status(201).json({ message: "Achiever saved", achiever });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAchievers = async (req, res) => {
  const achievers = await Achiever.find().sort({ createdAt: -1 });
  res.json(achievers);
};
