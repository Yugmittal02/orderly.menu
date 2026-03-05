/**
 * One-time migration: Generate slugs for all existing products that don't have one.
 * 
 * Usage: node scripts/generateSlugs.js
 * 
 * Run this once after adding the slug field to the Product model.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/sevashubham';

async function generateSlugs() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({ $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] });
        console.log(`Found ${products.length} products without slugs`);

        for (const product of products) {
            // The pre-validate hook will auto-generate the slug from name
            // The pre-save hook will handle duplicates
            await product.save();
            console.log(`  ✓ ${product.name} → ${product.slug}`);
        }

        console.log('\nDone! All products now have slugs.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

generateSlugs();
