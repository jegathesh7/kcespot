const express = require("express");
const router = express.Router();
const { createAchiever, getAchievers } = require("../controllers/achieverController");


router.post("/", createAchiever);
router.get("/", getAchievers);


module.exports = router;
