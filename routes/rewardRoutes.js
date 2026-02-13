const express = require("express");
const router = express.Router();
const {
  submitAchievement,
  verifyAchievement,
  redeemReward,
  getMyStats,
  getCatalog,
  addRewardItem,
  upsertPointRule,
  getPointRules,
  deletePointRule,
  updatePointRule,
  getAllBadges,
  getSubmissions,
  getSubmissionDetails,
  getStudentAchievements,
  getCategories,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/rewardController");
const {
  protect,
  adminOnly,
  staffOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// Student Routes
router.post(
  "/submit",
  protect,
  upload.single("evidenceImage"),
  submitAchievement,
);

router.get("/my-stats", protect, getMyStats);
router.get("/catalog", protect, getCatalog);
router.get("/my-submissions", protect, getStudentAchievements);
router.post("/redeem", protect, redeemReward);
router.get("/badges", protect, getAllBadges);
router.get("/categories", protect, getCategories);

router.put(
  "/submission/:id",
  protect,
  upload.single("evidenceImage"),
  updateAchievement,
);
router.delete("/submission/:id", protect, deleteAchievement);

// History Routes (Paginated)
router.get(
  "/history/points",
  protect,
  require("../controllers/rewardController").getPointHistory,
);
router.get(
  "/history/redemptions",
  protect,
  require("../controllers/rewardController").getRedemptionHistory,
);

// Staff/Admin Routes
router.get("/submissions", protect, staffOnly, getSubmissions);
router.patch("/verify/:id", protect, staffOnly, verifyAchievement);
router.get("/submission/:id", protect, staffOnly, getSubmissionDetails);

router.post("/catalog", protect, adminOnly, addRewardItem);
router.post("/rules", protect, adminOnly, upsertPointRule);
router.get("/rules", protect, staffOnly, getPointRules);
router.delete("/rules/:id", protect, adminOnly, deletePointRule);
router.patch("/rules/:id", protect, adminOnly, updatePointRule);

module.exports = router;
