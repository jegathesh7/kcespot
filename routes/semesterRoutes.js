const express = require("express");
const router = express.Router();
const {
  upsertSemester,
  getSemesters,
} = require("../controllers/semesterController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, upsertSemester);
router.get("/", protect, getSemesters);

module.exports = router;
