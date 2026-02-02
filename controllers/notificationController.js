const User = require("../models/User");

exports.savePushToken = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT
    const { pushToken, fcmToken } = req.body;
    const tokenToSave = pushToken || fcmToken;

    if (!tokenToSave) {
      return res.status(400).json({ message: "Push token required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicates
    if (!user.pushTokens.includes(tokenToSave)) {
      user.pushTokens.push(tokenToSave);
      await user.save();
    }

    res.json({
      message: "Push token saved successfully",
      tokensCount: user.pushTokens.length,
    });
  } catch (err) {
    console.error("Save push token error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
