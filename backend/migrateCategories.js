require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI);

const run = async () => {
    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products to categorize.`);

        let updatedCount = 0;

        for (const product of products) {
            const name = product.name.toLowerCase();
            const desc = (product.description || "").toLowerCase();
            let newCategory = product.category;
            let newSubcategories = [...(product.subcategories || [])];

            // 1. MASTER CATEGORY MAPPING
            if (name.includes('cake') || name.includes('pastry') || name.includes('brownie')) {
                newCategory = 'Cake';
            } else if (name.includes('pizza') || name.includes('patty') || name.includes('patties') || name.includes('burger') || name.includes('sandwich') || name.includes('hot dog') || name.includes('fries') || name.includes('momos')) {
                newCategory = 'Fastfood';
            } else if (name.includes('coffee') || name.includes('tea') || name.includes('shake') || name.includes('mojito') || name.includes('drink')) {
                newCategory = 'Beverages';
            } else if (name.includes('flower') || name.includes('bouquet') || name.includes('rose')) {
                newCategory = 'Flowers';
            }

            // 2. SUBCATEGORY TAGGING (Can have multiple)
            
            // Birthday
            if (name.includes('birthday') || desc.includes('birthday')) {
                if (!newSubcategories.includes('Birthday')) newSubcategories.push('Birthday');
            }
            if (name.includes('first birthday') || name.includes('1st birthday')) {
                 if (!newSubcategories.includes('First Birthday')) newSubcategories.push('First Birthday');
            }
            // Anniversary
            if (name.includes('anniversary') || desc.includes('anniversary') || name.includes('wedding') || name.includes('couple')) {
                if (!newSubcategories.includes('Anniversary')) newSubcategories.push('Anniversary');
            }
            // Photo Cake
            if (name.includes('photo')) {
                if (!newSubcategories.includes('Photo Cake')) newSubcategories.push('Photo Cake');
            }
            // Pizza
            if (name.includes('pizza')) {
                if (!newSubcategories.includes('Pizza')) newSubcategories.push('Pizza');
            }
            // Patties
            if (name.includes('patty') || name.includes('patties')) {
                if (!newSubcategories.includes('Patties')) newSubcategories.push('Patties');
            }

            // Also check for default fallback
            if (!newCategory || newCategory === 'All') {
                newCategory = 'Bakery'; // fallback
            }

            // Update product
            product.category = newCategory;
            product.subcategories = newSubcategories;
            await product.save();
            updatedCount++;
        }

        console.log(`Successfully updated ${updatedCount} products categorization!`);
        process.exit(0);

    } catch (err) {
        console.error("Migration Error:", err);
        process.exit(1);
    }
};

run();
