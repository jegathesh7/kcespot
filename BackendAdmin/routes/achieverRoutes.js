const express = require("express");
const router = express.Router();
const { createAchiever, getAchievers, updateAchiever,deleteAchiever } = require("../controllers/achieverController");


const upload = require("../middleware/upload");

router.post("/", upload.any(), createAchiever);
router.get("/", getAchievers);
router.put("/:id", upload.any(), updateAchiever);
router.delete("/:id", deleteAchiever);


module.exports = router;
