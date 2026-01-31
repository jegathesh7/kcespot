const Achiever = require("../models/Achiever");
const Reaction = require("../models/Reaction");

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

    let achievers = await Achiever.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // Use lean() to get plain JS objects

    // ENRICH DATA: Add userReaction field
    if (req.user && req.user.id) {
      const achieverIds = achievers.map((a) => a._id);

      const userReactions = await Reaction.find({
        user: req.user.id,
        achiever: { $in: achieverIds },
      });

      // Create a map: achieverId -> reactionType
      const reactionMap = {};
      userReactions.forEach((reaction) => {
        reactionMap[reaction.achiever.toString()] = reaction.type;
      });

      // Attach to achievers
      achievers = achievers.map((achiever) => ({
        ...achiever,
        userReaction: reactionMap[achiever._id.toString()] || null,
      }));
    } else {
      // If no user is logged in (just in case), ensure field exists as null
      achievers = achievers.map((achiever) => ({
        ...achiever,
        userReaction: null,
      }));
    }

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
    const { id } = req.params; // Achiever ID
    const { reactionType } = req.body; // "r1", "r2", "r3", "r4", "r5"
    const userId = req.user.id; // From authMiddleware

    const validReactions = ["r1", "r2", "r3", "r4", "r5"];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    // 1. Check if user already reacted
    const existingReaction = await Reaction.findOne({
      user: userId,
      achiever: id,
    });
    let updatedAchiever;
    let message = "";
    let userReaction = null;

    if (existingReaction) {
      if (existingReaction.type === reactionType) {
        // A. Toggle OFF (Remove reaction)
        await Reaction.findByIdAndDelete(existingReaction._id);

        // Atomic Decrement
        updatedAchiever = await Achiever.findByIdAndUpdate(
          id,
          { $inc: { [`reactions.${reactionType}`]: -1 } },
          { new: true },
        );
        message = "Reaction removed";
        userReaction = null;
      } else {
        // B. Switch Reaction (e.g., from r1 to r2)
        const oldType = existingReaction.type;

        // Update existing reaction doc
        existingReaction.type = reactionType;
        await existingReaction.save();

        // Atomic Switch: Dec old, Inc new
        updatedAchiever = await Achiever.findByIdAndUpdate(
          id,
          {
            $inc: {
              [`reactions.${oldType}`]: -1,
              [`reactions.${reactionType}`]: 1,
            },
          },
          { new: true },
        );
        message = "Reaction updated";
        userReaction = reactionType;
      }
    } else {
      // C. New Reaction
      try {
        await Reaction.create({
          user: userId,
          achiever: id,
          type: reactionType,
        });

        // Atomic Increment
        updatedAchiever = await Achiever.findByIdAndUpdate(
          id,
          { $inc: { [`reactions.${reactionType}`]: 1 } },
          { new: true },
        );
        message = "Reaction added";
        userReaction = reactionType;
      } catch (err) {
        // Handle duplicate key error (race condition double-click)
        if (err.code === 11000) {
          return res
            .status(409)
            .json({ message: "You have already reacted to this post." });
        }
        throw err;
      }
    }

    if (!updatedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({
      message,
      reactions: updatedAchiever.reactions,
      userReaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
