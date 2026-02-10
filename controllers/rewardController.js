const User = require("../models/User");
const RewardCatalog = require("../models/RewardCatalog");
const Redemption = require("../models/Redemption");
const RewardPointsLedger = require("../models/RewardPointsLedger");
const Badge = require("../models/Badge");
const AchievementSubmission = require("../models/AchievementSubmission");
const Staff = require("../models/Staff");
const Achiever = require("../models/Achiever");
const mongoose = require("mongoose");

// Helper: Badge Evaluation
const evaluateBadges = async (userId) => {
  const user = await User.findById(userId);
  const badges = await Badge.find({
    pointsRequired: { $lte: user.lifetimePoints },
  });

  const earnedBadgeIds = badges.map((b) => b._id.toString());
  const userBadgeIds = user.badges.map((b) => b.toString());

  const newBadges = badges.filter(
    (b) => !userBadgeIds.includes(b._id.toString()),
  );

  if (newBadges.length > 0) {
    user.badges = [...new Set([...userBadgeIds, ...earnedBadgeIds])];
    await user.save();
    // TODO: Trigger Notification for new badge
  }
};

// Helper: Award Points
const awardPoints = async (
  userId,
  amount,
  reason,
  referenceId,
  referenceModel,
) => {
  const user = await User.findById(userId);
  if (!user) return;

  user.pointsBalance += amount;
  user.lifetimePoints += amount;
  await user.save();

  await RewardPointsLedger.create({
    studentId: userId,
    amount,
    type: "credit",
    reason,
    referenceId,
    referenceModel,
  });

  await evaluateBadges(userId);
};

const crypto = require("crypto");
const PointRule = require("../models/PointRule");

// @desc    Submit Achievement
// @route   POST /api/rewards/submit
exports.submitAchievement = async (req, res) => {
  try {
    const entryData = { ...req.body };

    const { title, category, description, evidenceUrl } = entryData;
    const student = await User.findById(req.user.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    const evidenceImage = req.file ? req.file.path : null;

    if (!evidenceUrl && !evidenceImage) {
      return res.status(400).json({
        success: false,
        message: "Please provide either an evidence URL or an image.",
      });
    }

    // Duplicate detection: Hash of Title + Evidence (Url or Image Path)
    const evidenceSource = evidenceImage || evidenceUrl;
    const evidenceHash = crypto
      .createHash("sha256")
      .update(`${title}-${evidenceSource}`)
      .digest("hex");

    const existing = await AchievementSubmission.findOne({ evidenceHash });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This achievement has already been submitted.",
      });
    }

    const submission = await AchievementSubmission.create({
      studentId: req.user.id,
      title,
      category,
      description,
      evidenceUrl,
      evidenceImage,
      evidenceHash,
      collegeName: student.collegeName,
      department: student.department || student.dept, // Handle both field names
    });
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Achievement (Staff Only)
// @route   PATCH /api/rewards/verify/:id
exports.verifyAchievement = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    let { pointsAwarded } = req.body;
    const submission = await AchievementSubmission.findById(req.params.id);

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    if (submission.status !== "pending") {
      return res.status(400).json({ message: "Achievement already processed" });
    }

    submission.status = status;
    submission.verifiedBy = req.user.id;

    if (status === "approved") {
      // 1. Fetch points from PointRule if not provided by Admin
      if (!pointsAwarded || req.user.role === "instructor") {
        const rule = await PointRule.findOne({ category: submission.category });
        if (!rule) {
          // Fallback to 0 if no rule exists, but mention it
          console.warn(
            `No PointRule found for category: ${submission.category}`,
          );
          pointsAwarded = 0;
        } else {
          pointsAwarded = rule.points;
        }
      }

      submission.pointsAwarded = pointsAwarded;
      await awardPoints(
        submission.studentId,
        submission.pointsAwarded,
        `Achievement Approved: ${submission.title}`,
        submission._id,
        "AchievementSubmission",
      );

      // Auto-post to Achiever collection
      const student = await User.findById(submission.studentId);
      await Achiever.create({
        name: student.name,
        college: student.collegeName,
        batch: student.batch,
        category: submission.category,
        description: submission.description,
        status: true,
        posterImage: submission.evidenceImage || submission.evidenceUrl,
        students: [
          {
            name: student.name,
            rollNo: student.rollNo,
            email: student.email,
            year: student.year,
            dept: student.department || student.dept,
          },
        ],
      });
    } else if (status === "rejected") {
      submission.rejectionReason = rejectionReason;
    }

    await submission.save();
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Redeem Reward
// @route   POST /api/rewards/redeem
exports.redeemReward = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { rewardId } = req.body;
    const user = await User.findById(req.user.id).session(session);
    const reward = await RewardCatalog.findById(rewardId).session(session);

    if (!reward) throw new Error("Reward not found");
    if (reward.stock <= 0) throw new Error("Reward out of stock");
    if (user.pointsBalance < reward.pointsCost)
      throw new Error("Insufficient points");

    reward.stock -= 1;
    user.pointsBalance -= reward.pointsCost;

    await reward.save({ session });
    await user.save({ session });

    const redemption = await Redemption.create(
      [
        {
          studentId: user._id,
          rewardId: reward._id,
          status: "pending",
        },
      ],
      { session },
    );

    await RewardPointsLedger.create(
      [
        {
          studentId: user._id,
          amount: -reward.pointsCost,
          type: "debit",
          reason: `Redeemed: ${reward.name}`,
          referenceId: redemption[0]._id,
          referenceModel: "Redemption",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    res.json({ success: true, data: redemption[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get Student Stats & History
// @route   GET /api/rewards/my-stats
exports.getMyStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("badges");
    const pointsHistory = await RewardPointsLedger.find({
      studentId: req.user.id,
    }).sort("-createdAt");
    const redemptionHistory = await Redemption.find({ studentId: req.user.id })
      .populate("rewardId")
      .sort("-createdAt");
    const submissionHistory = await AchievementSubmission.find({
      studentId: req.user.id,
    }).sort("-createdAt");

    res.json({
      success: true,
      data: {
        pointsBalance: user.pointsBalance,
        lifetimePoints: user.lifetimePoints,
        earnedBadges: user.badges,
        pointsHistory,
        redemptionHistory,
        submissionHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Catalog for Students
// @route   GET /api/rewards/catalog
exports.getCatalog = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category } = req.query;

    const query = { stock: { $gt: 0 } };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;

    const count = await RewardCatalog.countDocuments(query);
    const rewards = await RewardCatalog.find(query)
      .sort({ pointsCost: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: rewards,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Reward Item (Admin Only)
// @route   POST /api/rewards/catalog
exports.addRewardItem = async (req, res) => {
  try {
    const {
      name,
      description,
      pointsCost,
      stock,
      category,
      expiryDate,
      imageUrl,
    } = req.body;
    const reward = await RewardCatalog.create({
      name,
      description,
      pointsCost,
      stock,
      category,
      expiryDate,
      imageUrl,
    });
    res.status(201).json({ success: true, data: reward });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/Update Point Rule (Admin Only)
// @route   POST /api/rewards/rules
exports.upsertPointRule = async (req, res) => {
  try {
    const { category, points } = req.body;
    const rule = await PointRule.findOneAndUpdate(
      { category },
      { points },
      { upsert: true, new: true },
    );
    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Point Rules
// @route   GET /api/rewards/rules
exports.getPointRules = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};
    if (search) {
      query.category = { $regex: search, $options: "i" };
    }

    const count = await PointRule.countDocuments(query);
    const rules = await PointRule.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: rules,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Badge Tiers
// @route   GET /api/rewards/badges
exports.getAllBadges = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const count = await Badge.countDocuments();
    const badges = await Badge.find()
      .sort("pointsRequired")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: badges,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Submissions (Staff/Admin Only)
// @route   GET /api/rewards/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status, // Can be pending, approved, rejected, resubmit, or empty for all
      category,
      collegeName,
      department,
      studentId,
      search = "",
    } = req.query;

    const filter = {};

    // 1. Status Filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // 2. Instructor Category Restriction
    if (req.user.role === "instructor") {
      const staff = await Staff.findById(req.user.id);
      if (staff && staff.assignedCategory) {
        filter.category = staff.assignedCategory;
      }
    }

    // 3. Other Basic Filters
    if (category) filter.category = category;
    if (collegeName) filter.collegeName = collegeName;
    if (department) filter.department = department;
    if (studentId) filter.studentId = studentId;

    // 4. Advanced Search (Achievement Details OR Student Details)
    if (search) {
      // Find students matching name or rollNo
      const matchingStudents = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { rollNo: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const studentIds = matchingStudents.map((s) => s._id);

      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { studentId: { $in: studentIds } },
      ];
    }

    const count = await AchievementSubmission.countDocuments(filter);
    const submissions = await AchievementSubmission.find(filter)
      .populate("studentId", "name rollNo department collegeName email")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Point History (Student)
// @route   GET /api/rewards/history/points
exports.getPointHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search = "" } = req.query;
    const query = { studentId: req.user.id };
    if (type) query.type = type;
    if (search) query.reason = { $regex: search, $options: "i" };

    const count = await RewardPointsLedger.countDocuments(query);
    const history = await RewardPointsLedger.find(query)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: history,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Redemption History (Student)
// @route   GET /api/rewards/history/redemptions
exports.getRedemptionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { studentId: req.user.id };
    if (status) query.status = status;

    const count = await Redemption.countDocuments(query);
    const history = await Redemption.find(query)
      .populate("rewardId")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: history,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get Student Achievements (Paginated)
// @route   GET /api/rewards/my-submissions
exports.getStudentAchievements = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;
    const query = { studentId: req.user.id };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const count = await AchievementSubmission.countDocuments(query);
    const achievements = await AchievementSubmission.find(query)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: achievements,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
