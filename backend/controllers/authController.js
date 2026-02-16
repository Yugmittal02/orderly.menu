const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Customer registration (simple, for order tracking)
exports.registerCustomer = async (req, res) => {
    try {
        console.log('registerCustomer called with body:', req.body);
        const { name, phone, password } = req.body;
        
        // Validate required fields
        if (!name || !phone) {
            console.log('Validation failed - name or phone missing');
            return res.status(400).json({ message: 'Name and phone are required' });
        }
        
        let user = await User.findOne({ phone, role: 'customer' });
        console.log('Existing user lookup result:', user);
        
        if (user) {
            // Returning customer - verify password if set
            if (user.password && password) {
                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Incorrect password' });
                }
            } else if (user.password && !password) {
                // User has password but didn't provide one
                return res.status(400).json({ message: 'Password required for this account' });
            }
            // If user has no password, allow login (legacy users)
            
            const token = jwt.sign(
                { userId: user._id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '365d' }
            );
            return res.json({ token, user, message: 'Welcome back!' });
        }

        // New customer - create with optional password
        user = new User({ 
            name, 
            phone, 
            role: 'customer',
            password: password || undefined  // Only set if provided
        });
        await user.save();
        console.log('New user created:', user);
        
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '365d' }
        );
        
        res.status(201).json({ token, user, message: 'Welcome!' });
    } catch (error) {
        console.error('registerCustomer error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin login with password
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role }, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create admin (for initial setup)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new User({ 
            name, 
            email, 
            password, 
            phone: phone || '0000000000',
            role: 'admin' 
        });
        await admin.save();
        
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
