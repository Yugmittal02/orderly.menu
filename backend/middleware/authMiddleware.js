const jwt = require('jsonwebtoken');
const Cafe = require('../models/Cafe');

// Verify any JWT token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// SuperAdmin only
exports.isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'SuperAdmin access required' });
  }
};

// Cafe Owner only
exports.isCafeOwner = (req, res, next) => {
  if (req.user && req.user.role === 'cafeowner') {
    next();
  } else {
    res.status(403).json({ message: 'Cafe owner access required' });
  }
};

// Attach cafe document to req for cafe owner routes
exports.attachCafe = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'cafeowner' && req.user.cafeId) {
      const cafe = await Cafe.findById(req.user.cafeId);
      if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
      if (!cafe.isActive) return res.status(403).json({ message: 'Cafe is deactivated' });
      req.cafe = cafe;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
