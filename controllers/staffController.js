const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Add Staff member
// @route   POST /api/staff
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role, collegeName, department } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Staff already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = await Staff.create({
      name,
      email,
      password: hashedPassword,
      role,
      collegeName,
      department,
    });

    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff (Admin Only)
// @route   GET /api/staff
exports.getAllStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role,
      collegeName,
      department,
      status,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) query.role = role;
    if (collegeName) query.collegeName = collegeName;
    if (department) query.department = department;
    if (status !== undefined) query.status = status === "true";

    const count = await Staff.countDocuments(query);
    const staffList = await Staff.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: staffList,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Staff Login
// @route   POST /api/auth/staff-login
exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });

    if (!staff || !(await bcrypt.compare(password, staff.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.json({
      success: true,
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        role: staff.role,
        collegeName: staff.collegeName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
