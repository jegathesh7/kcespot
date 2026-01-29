const express = require("express");
const router = express.Router();
const { createAchiever, getAchievers, updateAchiever,deleteAchiever } = require("../controllers/achieverController");


router.post("/", createAchiever);
router.get("/", getAchievers);
router.put("/:id", updateAchiever);
router.delete("/:id", deleteAchiever);


module.exports = router;
