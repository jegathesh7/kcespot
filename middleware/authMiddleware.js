const jwt = require("jsonwebtoken");

// VERIFY TOKEN
exports.protect = (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Not authorized, please login",
    });
  }

  const clientHeader = req.headers["X-App-Client"];
  if (clientHeader !== "kce-admin") {
    return res.status(401).json({
      status: "failed",
      message: "API access restricted to application only",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }
};

// ADMIN ONLY
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "failed",
      message: "Admin access only",
    });
  }
  next();
};

// USER ONLY
exports.userOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      status: "failed",
      message: "User access only",
    });
  }
  next();
};
