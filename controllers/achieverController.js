const Achiever = require("../models/Achiever");

// CREATE
exports.createAchiever = async (req, res) => {
  try {
    const entryData = { ...req.body };

    // Parse students if it's a string (from FormData)
    if (typeof entryData.students === "string") {
      entryData.students = JSON.parse(entryData.students);
    }

    // Handle File Uploads (Poster + Student Images)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "posterImage") {
          entryData.posterImage = file.path;
        } else if (file.fieldname.startsWith("studentImage_")) {
          // Extract index from fieldname "studentImage_0", "studentImage_1", etc.
          const index = parseInt(file.fieldname.split("_")[1]);
          if (entryData.students && entryData.students[index]) {
            entryData.students[index].imageUrl = file.path;
          }
        }
      });
    }

    const achiever = new Achiever(entryData);
    await achiever.save();
    res.status(201).json({ message: "Achiever saved", achiever });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ (ALL) with Pagination and Search
exports.getAchievers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", college = "" } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { college: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }, // Added description for completeness
      ];
    }

    if (college) {
      query.college = { $regex: `^${college}$`, $options: "i" };
    }

    const count = await Achiever.countDocuments(query);

    const achievers = await Achiever.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: achievers,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateAchiever = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse students if it's a string
    if (typeof updateData.students === "string") {
      updateData.students = JSON.parse(updateData.students);
    }

    // Handle File Uploads (Poster + Student Images)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "posterImage") {
          updateData.posterImage = file.path;
        } else if (file.fieldname.startsWith("studentImage_")) {
          const index = parseInt(file.fieldname.split("_")[1]);
          if (updateData.students && updateData.students[index]) {
            updateData.students[index].imageUrl = file.path;
          }
        }
      });
    }

    // Parse students if it's a string
    if (typeof updateData.students === "string") {
      updateData.students = JSON.parse(updateData.students);
    }

    const updatedAchiever = await Achiever.findByIdAndUpdate(
      id,
      updateData,
      { new: true }, // return updated document
    );

    if (!updatedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({
      message: "Achiever updated successfully",
      achiever: updatedAchiever,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (Soft Delete)
exports.deleteAchiever = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndUpdate to soft delete
    const deletedAchiever = await Achiever.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!deletedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({ message: "Achiever deleted successfully (Soft Delete)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE REACTION
exports.updateReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body; // e.g., "r1", "r2", "r3", "r4", "r5"

    const validReactions = ["r1", "r2", "r3", "r4", "r5"];

    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const fieldToUpdate = `reactions.${reactionType}`;

    const updatedAchiever = await Achiever.findByIdAndUpdate(
      id,
      { $inc: { [fieldToUpdate]: 1 } },
      { new: true },
    );

    if (!updatedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({
      message: "Reaction updated",
      reactions: updatedAchiever.reactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
