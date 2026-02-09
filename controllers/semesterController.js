const SemesterConfig = require("../models/SemesterConfig");
const User = require("../models/User");
const RewardPointsLedger = require("../models/RewardPointsLedger");

// @desc    Add/Update Semester Config
// @route   POST /api/semester
exports.upsertSemester = async (req, res) => {
  try {
    const { collegeName, batch, semester, startDate, endDate } = req.body;

    let config = await SemesterConfig.findOne({ collegeName, batch, semester });

    if (config) {
      config.startDate = startDate;
      config.endDate = endDate;
      await config.save();
    } else {
      config = await SemesterConfig.create({
        collegeName,
        batch,
        semester,
        startDate,
        endDate,
      });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Semester Configs
// @route   GET /api/semester
exports.getSemesters = async (req, res) => {
  try {
    const { page = 1, limit = 10, collegeName, batch, semester } = req.query;

    const query = {};
    if (collegeName) query.collegeName = collegeName;
    if (batch) query.batch = batch;
    if (semester) query.semester = semester;

    const count = await SemesterConfig.countDocuments(query);
    const configs = await SemesterConfig.find(query)
      .sort({ collegeName: 1, batch: -1, semester: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: configs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logic: Reset Points if New Semester Detected
exports.checkAndResetSemesterPoints = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();

  // Find current active semester for this student
  const activeSemester = await SemesterConfig.findOne({
    collegeName: user.collegeName,
    batch: user.batch,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  if (activeSemester) {
    // If last reset was BEFORE the start of this active semester, reset now
    if (user.lastPointsResetDate < activeSemester.startDate) {
      await RewardPointsLedger.create({
        studentId: user._id,
        amount: -user.pointsBalance,
        type: "reset",
        reason: `Semester Reset: ${activeSemester.semester}`,
      });

      user.pointsBalance = 0;
      user.lastPointsResetDate = now;
      await user.save();
      console.log(
        `User ${user.email} points reset for semester ${activeSemester.semester}`,
      );
    }
  }
};
