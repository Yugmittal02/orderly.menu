const MenuItem = require('../models/MenuItem');

// Get all menu items for a cafe (public)
exports.getMenuByCafe = async (req, res) => {
  try {
    const Cafe = require('../models/Cafe');
    const cafe = await Cafe.findOne({ cafeId: req.params.cafeId.toUpperCase(), isActive: true });
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    const items = await MenuItem.find({ cafe: cafe._id, isAvailable: true })
      .sort({ category: 1, sortOrder: 1, name: 1 });

    res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all menu items for cafe owner (including unavailable)
exports.getMyMenu = async (req, res) => {
  try {
    const items = await MenuItem.find({ cafe: req.user.cafeId })
      .sort({ category: 1, sortOrder: 1, name: 1 });
    res.json(items);
  } catch (error) {
    console.error('Get my menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add menu item (CafeOwner)
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, category, isVeg, preparationTime, sortOrder } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const item = new MenuItem({
      cafe: req.user.cafeId,
      name,
      description: description || '',
      price: Number(price),
      image: image || '',
      category,
      isVeg: isVeg !== undefined ? isVeg : true,
      preparationTime: preparationTime || 15,
      sortOrder: sortOrder || 0
    });

    await item.save();
    res.status(201).json({ message: 'Menu item added', item });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update menu item (CafeOwner)
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id, cafe: req.user.cafeId });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    const updates = req.body;
    delete updates.cafe; // Can't change cafe ownership

    Object.assign(item, updates);
    await item.save();

    res.json({ message: 'Menu item updated', item });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete menu item (CafeOwner)
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOneAndDelete({ _id: req.params.id, cafe: req.user.cafeId });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle item availability (CafeOwner)
exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id, cafe: req.user.cafeId });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({ message: `Item ${item.isAvailable ? 'available' : 'unavailable'}`, isAvailable: item.isAvailable });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get menu categories for a cafe (public)
exports.getCategories = async (req, res) => {
  try {
    const Cafe = require('../models/Cafe');
    const cafe = await Cafe.findOne({ cafeId: req.params.cafeId.toUpperCase(), isActive: true });
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    const categories = await MenuItem.distinct('category', { cafe: cafe._id, isAvailable: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
