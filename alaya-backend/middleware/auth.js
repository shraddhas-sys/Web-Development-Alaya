const jwt = require('jsonwebtoken');

// Authentication token bearer
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access denied: missing or invalid Authorization header."
      });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({
        success: false,
        message: "Access denied: token missing or malformed."
      });
    }

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const decoded = jwt.verify(token, secret);

    // Enhanced security
    const User = require("../models/user");
    const user = await User.findByPk(decoded.id);

    if (!user || user.isDisabled) {
      return res.status(401).json({
        success: false,
        message: "Identity invalidated or sanctuary access revoked."
      });
    }

    // Update lastSeen 
    user.lastSeen = new Date();
    user.save().catch(() => { });

    // Expected payload: { id, role, email }
    req.user = decoded;

    return next();
  } catch (err) {
    const isExpired = err?.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: isExpired ? "Session expired. Please login again." : "Invalid token."
    });
  }
};
