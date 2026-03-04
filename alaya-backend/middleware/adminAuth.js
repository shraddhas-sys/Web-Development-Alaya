const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log(" User is not admin. Role:", req.user?.role);
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};
module.exports = adminAuth;