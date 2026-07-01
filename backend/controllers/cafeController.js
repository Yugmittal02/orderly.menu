const Cafe = require('../models/Cafe');
const crypto = require('crypto');

// Generate unique cafe ID like "CAFE-A1B2C3"
const generateCafeId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CAFE-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new cafe (SuperAdmin only)
exports.createCafe = async (req, res) => {
  try {
    const { name, ownerName, phone, email, address, city, description, cuisine, openTime, closeTime, tableCount } = req.body;

    if (!name || !ownerName || !phone) {
      return res.status(400).json({ message: 'Name, owner name, and phone are required' });
    }

    // Generate unique cafe ID
    let cafeId;
    let exists = true;
    while (exists) {
      cafeId = generateCafeId();
      exists = await Cafe.findOne({ cafeId });
    }

    const cafe = new Cafe({
      cafeId,
      name,
      ownerName,
      phone,
      email: email || '',
      address: address || '',
      city: city || '',
      description: description || '',
      cuisine: cuisine || [],
      openTime: openTime || '09:00',
      closeTime: closeTime || '22:00',
      tableCount: tableCount || 10,
      createdBy: req.user.id
    });

    await cafe.save();

    res.status(201).json({
      message: 'Cafe created successfully',
      cafe: cafe.toJSON(),
      cafeId: cafeId
    });
  } catch (error) {
    console.error('Create cafe error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Cafe with this ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all cafes (SuperAdmin only)
exports.getAllCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find().sort({ createdAt: -1 }).select('-password');
    res.json(cafes);
  } catch (error) {
    console.error('Get cafes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public cafe info (for customer menu page)
exports.getPublicCafeInfo = async (req, res) => {
  try {
    const cafe = await Cafe.findOne({ cafeId: req.params.cafeId.toUpperCase(), isActive: true })
      .select('cafeId name ownerName phone address city logo coverImage description cuisine openTime closeTime tableCount theme');
    
    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    res.json(cafe);
  } catch (error) {
    console.error('Get public cafe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current cafe profile (Cafe Owner)
exports.getMyCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.user.cafeId).select('-password');
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
    res.json(cafe);
  } catch (error) {
    console.error('Get my cafe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cafe (SuperAdmin or CafeOwner for their own)
exports.updateCafe = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };
    
    // Don't allow changing protected fields through this route
    delete updates.cafeId;
    delete updates.password;
    delete updates.createdBy;
    delete updates.isActive; // Only SuperAdmin can toggle active status

    const cafe = await Cafe.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    res.json({ message: 'Cafe updated', cafe });
  } catch (error) {
    console.error('Update cafe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle cafe active status (SuperAdmin only)
exports.toggleCafeStatus = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    cafe.isActive = !cafe.isActive;
    await cafe.save();

    res.json({ message: `Cafe ${cafe.isActive ? 'activated' : 'deactivated'}`, isActive: cafe.isActive });
  } catch (error) {
    console.error('Toggle cafe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete cafe (SuperAdmin only)
exports.deleteCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.params.id);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
    res.json({ message: 'Cafe deleted' });
  } catch (error) {
    console.error('Delete cafe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change cafe password (CafeOwner)
exports.changeCafePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    const cafe = await Cafe.findById(req.user.cafeId);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    const isMatch = await cafe.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    cafe.password = newPassword;
    await cafe.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
